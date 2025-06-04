import torch
import numpy as np
import sys
import argparse
from SASRec import SASREC

def fine_tune_model(model, user_id, sequence, device, num_products, lr=1e-4, num_epochs=25):
    model.train()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    bce_loss = torch.nn.BCEWithLogitsLoss(reduction='none')

    for epoch in range(num_epochs):
        x = sequence[:-1]
        pos = sequence[1:]
        seq_len = len(x)

        product_set = set(sequence)
        neg = []
        for _ in range(seq_len):
            t = np.random.randint(1, num_products + 1)
            while t in product_set:
                t = np.random.randint(1, num_products + 1)
            neg.append(t)

        x_tensor = torch.LongTensor([x]).to(device)
        pos_tensor = torch.LongTensor([pos]).to(device)
        neg_tensor = torch.LongTensor([neg]).to(device)
        user_ids = torch.LongTensor([user_id]).to(device)

        optimizer.zero_grad()
        pos_logits, neg_logits = model(user_ids, x_tensor, pos_tensor, neg_tensor)

        pos_labels = torch.ones_like(pos_logits, device=device)
        neg_labels = torch.zeros_like(neg_logits, device=device)

        mask = (pos_tensor != 0).float().to(device)

        loss_pos = (bce_loss(pos_logits, pos_labels) * mask)
        loss_neg = (bce_loss(neg_logits, neg_labels) * mask)

        loss = (loss_pos.sum() + loss_neg.sum()) / mask.sum()

        loss.backward()
        optimizer.step()

    return loss.item()

def recommend(user_id, new_item_id, user_sequences, all_product_ids, model_path, sequence_size=50, top_k=5, num_epochs=25):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    num_users = max(user_sequences.keys()) + 1
    num_products = max(all_product_ids) + 1

    model = SASREC(
        num_users=num_users,
        num_products=num_products,
        device=device,
        embedding_dims=64,
        sequence_size=sequence_size,
        num_blocks=2,
        dropout_rate=0.1
    ).to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()

    sequence = user_sequences.get(user_id, []).copy()
    sequence.append(new_item_id)
    if len(sequence) > sequence_size:
        sequence = sequence[-sequence_size:]
    user_sequences[user_id] = sequence

    loss = fine_tune_model(model, user_id, sequence, device, num_products, num_epochs=num_epochs)

    interacted_set = set(sequence)
    candidate_products = [pid for pid in all_product_ids if pid not in interacted_set]
    if len(candidate_products) == 0:
        return []

    padded_sequence = sequence + [0] * (sequence_size - len(sequence))
    user_interacts = np.array([padded_sequence])

    model.eval()
    with torch.no_grad():
        scores = model.predict(
            user_ids=[user_id],
            user_interacts=user_interacts,
            product_indices=candidate_products
        ).cpu().numpy()

    scores = scores.flatten()
    top_indices = np.argsort(-scores)[:top_k]
    top_products = [candidate_products[i] for i in top_indices]
    return top_products

if __name__ == "__main__":
    all_product_ids = list(range(1, 50))

    if len(sys.argv) < 4:
        print("Usage: recommend.py <user_id> <new_item_id> <sequence_comma_separated>")
        sys.exit(1)

    user_id = int(sys.argv[1])
    new_item_id = int(sys.argv[2])
    sequence = list(map(int, sys.argv[3].split(",")))
    user_sequences = {user_id: sequence}

    model_path = "../train_dir/SASRec.epoch=75.learning_rate=0.001.layer=2.head=1.embedding_dims=64.sequence_size=25.pth"

    recommended = recommend(
        user_id=user_id,
        new_item_id=new_item_id,
        user_sequences=user_sequences,
        all_product_ids=all_product_ids,
        model_path=model_path,
        sequence_size=25,
        top_k=5,
        num_epochs=20
    )
    print(",".join(map(str, recommended)))