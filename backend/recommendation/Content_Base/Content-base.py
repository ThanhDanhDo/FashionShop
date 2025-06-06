import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import torch
import torchvision.transforms as T
from PIL import Image
import requests
from io import BytesIO
from torchvision.models import resnet50, ResNet50_Weights
from concurrent.futures import ThreadPoolExecutor, as_completed
import sys
import warnings
warnings.filterwarnings("ignore")
import contextlib
import os

def clean_text(text):
    text = text.lower()
    text = text.replace("|", " ")
    text = re.sub(r"[^a-z0-9_ ]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def load_and_process_product_data(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    
    df["description"] = df["description"].fillna("").astype(str) \
        .str.replace(r"\\n", " ", regex=True) \
        .str.replace(r"\n", " ", regex=True)
    
    df["category_text"] = (
        "main_" + df["main_category_id"].astype(str) +
        " sub_" + df["sub_category_id"].astype(str)
    )
    
    df["text"] = (
        df["name"].astype(str) + " " +
        df["description"].astype(str) + " " +
        df["gender"].astype(str) + " " +
        df["size"].astype(str) + " " +
        df["color"].astype(str) + " " +
        df["category_text"]
    )
    
    df["text"] = df["text"].apply(clean_text)
    
    return df

def vectorize_text(df, text_column='text'):
    vectorizer = TfidfVectorizer(max_features=7000, stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df[text_column])
    return tfidf_matrix, vectorizer

@contextlib.contextmanager
def suppress_stdout():
    with open(os.devnull, 'w') as devnull:
        old_stdout = sys.stdout
        sys.stdout = devnull
        try:
            yield
        finally:
            sys.stdout = old_stdout

device = 'cuda' if torch.cuda.is_available() else 'cpu'

with suppress_stdout():
    resnet = resnet50(weights=ResNet50_Weights.DEFAULT)
resnet = torch.nn.Sequential(*list(resnet.children())[:-1])
resnet.to(device)
resnet.eval()

transform = T.Compose([
    T.Resize(256),
    T.CenterCrop(224),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225])
])

def get_image_embedding(img_url):
    try:
        response = requests.get(img_url, timeout=5)
        img = Image.open(BytesIO(response.content)).convert('RGB')
        img_t = transform(img).unsqueeze(0).to(device)
        with torch.no_grad():
            emb = resnet(img_t)
        return emb.squeeze().cpu().numpy()
    except Exception as e:
#         print(f"Error loading image {img_url}: {e}")
        return np.zeros(2048)

def get_product_image_embedding(imgurls_str):
    if pd.isna(imgurls_str) or imgurls_str.strip() == "":
        return np.zeros(2048)
    imgurls = imgurls_str.split(",")
    first_url = imgurls[0].strip()
    emb = get_image_embedding(first_url)
    return emb

def build_combined_embeddings(df, text_embeddings, alpha=0.6):
#     print("Computing image embeddings ...")
    def safe_image_embedding(imgurls):
        return get_product_image_embedding(imgurls)

#     with ThreadPoolExecutor(max_workers=8) as executor:
#         futures = [executor.submit(safe_image_embedding, imgurls) for imgurls in df["imgurls"]]
#         img_embeddings = []
#         for future in as_completed(futures):
#             img_embeddings.append(future.result())
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(safe_image_embedding, imgurls) for imgurls in df["imgurls"]]
        img_embeddings = [future.result() for future in futures]
    
    img_embeddings = np.vstack(img_embeddings)

    def l2_normalize(x):
        norm = np.linalg.norm(x, axis=1, keepdims=True)
        return x / (norm + 1e-10)

    text_emb_np = text_embeddings.astype('float32')
    img_embeddings = img_embeddings.astype('float32')

    text_emb_np = l2_normalize(text_emb_np)
    img_embeddings = l2_normalize(img_embeddings)

    combined = np.concatenate([alpha * text_emb_np, (1 - alpha) * img_embeddings], axis=1)
    combined = l2_normalize(combined)

    return combined

def get_recommendations_by_id(product_id, df, embeddings, top_k=5):
    id_to_index = pd.Series(df.index, index=df["id"]).drop_duplicates()
    idx = id_to_index.get(product_id)
    if idx is None:
        return f"Sản phẩm có ID '{product_id}' không tồn tại trong dữ liệu."

    cosine_sim = cosine_similarity(embeddings[idx:idx+1], embeddings).flatten()
    sim_scores = list(enumerate(cosine_sim))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_k + 1]
    product_indices = [i[0] for i in sim_scores]

    return df[["id", "name"]].iloc[product_indices].assign(similarity=[s[1] for s in sim_scores])


if __name__ == "__main__":
    df = load_and_process_product_data("product.csv")
    tfidf_matrix, vectorizer = vectorize_text(df)
    text_embeddings = tfidf_matrix.toarray()

    combined_embeddings = build_combined_embeddings(df, text_embeddings)

    product_id_to_search = int(sys.argv[1])
    recommendations = get_recommendations_by_id(product_id_to_search, df, combined_embeddings, top_k=4)

    recommended_ids = recommendations["id"].tolist()
    print(",".join(map(str, recommended_ids)))