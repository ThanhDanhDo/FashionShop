import os
import time
import torch
import argparse
import numpy as np
from tqdm import tqdm
import pandas as pd

from SASRec import SASREC
from data_utils import *
from evaluate import *

def str2bool(s):
    if s not in {'false', 'true'}:
        raise ValueError('Not a valid boolean string')
    return s == 'true'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--batch_size', default=128, type=int)
    parser.add_argument('--learning_rate', default=0.001, type=float)
    parser.add_argument('--sequence_size', default=10, type=int)
    parser.add_argument('--embedding_dims', default=50, type=int)
    parser.add_argument('--num_blocks', default=2, type=int)
    parser.add_argument('--num_epochs', default=100, type=int)
    parser.add_argument('--num_heads', default=1, type=int)
    parser.add_argument('--dropout_rate', default=0.2, type=float)
    parser.add_argument('--l2_emb', default=0.0, type=float)
    parser.add_argument('--device', default='cuda' if torch.cuda.is_available() else 'cpu', type=str)
    parser.add_argument('--inference_only', default=False, type=str2bool)
    parser.add_argument('--state_dict_path', default=None, type=str)
    parser.add_argument('--data_path', default="/Users/ngoquyen/Desktop/java/dataset/interactions.csv", type=str)
    parser.add_argument('--recommendation_save_path', default="/Users/ngoquyen/Desktop/java/recommendation/recommendation.csv", type=str)
    args = parser.parse_args()

    train_dir = "/Users/ngoquyen/Desktop/java/train_dir"
    dataset = data_retrieval(args.data_path)
    [train, validation, test, num_users, num_products] = dataset
    num_batch = (len(train) - 1) // args.batch_size + 1

    f = open("/Users/ngoquyen/Desktop/java/log.txt", 'w')
    f.write('epoch (val_ndcg, val_hit, val_recall) (test_ndcg, test_hit, test_recall)\n')

    sampler = Sampler(train, num_users, num_products, batch_size=args.batch_size, sequence_size=args.sequence_size)
    model = SASREC(num_users, num_products, args.device, embedding_dims = args.embedding_dims, sequence_size = args.sequence_size, dropout_rate = args.dropout_rate, num_blocks = args.num_blocks).to(args.device)
    for _, param in model.named_parameters():
        try:
            torch.nn.init.xavier_normal_(param.data)
        except:
            pass
    model.position_emb.weight.data[0, :] = 0
    model.product_emb.weight.data[0, :] = 0
    model.train()

    epoch_start_idx = 1
    if args.state_dict_path is not None:
        model.load_state_dict(torch.load(args.state_dict_path, map_location=torch.device(args.device)))
        tail = args.state_dict_path[args.state_dict_path.find('epoch=') + 6:]
        epoch_start_idx = int(tail[:tail.find('.')]) + 1

    if args.inference_only:
        model.eval()
        test_result = evaluate(model, dataset, sequence_size = 10, k = k)
        val_result = evaluate_validation(model, dataset, sequence_size = 10, k = k)
        print('valid (NDCG@%d: %.4f, Hit@%d: %.4f, Recall@%d: %.4f), test (NDCG@%d: %.4f, Hit@%d: %.4f, Recall@%d: %.4f)' %
            (k, val_result["NDCG@k"], k, val_result["Hit@k"], k, val_result["Recall@k"],
            k, test_result["NDCG@k"], k, test_result["Hit@k"], k, test_result["Recall@k"]))
        sys.exit()

    bce_criterion = torch.nn.BCEWithLogitsLoss()
    adam_optimizer = torch.optim.Adam(model.parameters(), lr=args.learning_rate, betas=(0.9, 0.98))
    best_val_ndcg, best_val_hr, best_val_recall = 0.0, 0.0, 0.0
    best_test_ndcg, best_test_hr, best_test_recall = 0.0, 0.0, 0.0
    total_time = 0.0
    t0 = time.time()

    for epoch in range(epoch_start_idx, args.num_epochs + 1):
        if args.inference_only: 
            break

        with tqdm(total=num_batch, desc=f"Epoch {epoch}/{args.num_epochs}", unit="batch") as pbar:
            for step in range(num_batch):
                user, seq_product, pos_product, neg_product = sampler.next_batch()
                user, seq_product, pos_product, neg_product = np.array(user), np.array(seq_product), np.array(pos_product), np.array(neg_product)

                pos_logits, neg_logits = model(user, seq_product, pos_product, neg_product)
                pos_labels, neg_labels = torch.ones(pos_logits.shape, device=args.device), torch.zeros(neg_logits.shape, device=args.device)

                adam_optimizer.zero_grad()
                indices = np.where(pos_product != 0)
                loss = bce_criterion(pos_logits[indices], pos_labels[indices])
                loss += bce_criterion(neg_logits[indices], neg_labels[indices])
                for param in model.product_emb.parameters():
                    loss += args.l2_emb * torch.norm(param)

                loss.backward()
                adam_optimizer.step()

                pbar.set_postfix({"loss": f"{loss.item():.4f}"})
                pbar.update(1)

        if epoch % 25 == 0:
            model.eval()
            t1 = time.time() - t0
            total_time += t1
            print('Evaluating')
            for k in [5]:
                test_result = evaluate(model, dataset, sequence_size = args.sequence_size, k = k)
                val_result = evaluate_validation(model, dataset, args.sequence_size, k = k)
                print('epoch:%d, time: %f(s), valid (NDCG@%d: %.4f, Hit@%d: %.4f, Recall@%d: %.4f), test (NDCG@%d: %.4f, Hit@%d: %.4f, Recall@%d: %.4f)' %
                    (epoch, total_time, k, val_result["NDCG@k"], k, val_result["Hit@k"], k, val_result["Recall@k"],
                    k, test_result["NDCG@k"], k, test_result["Hit@k"], k, test_result["Recall@k"]))

            if val_result["NDCG@k"] > best_val_ndcg or val_result["Hit@k"] > best_val_hr or val_result["Recall@k"] > best_val_recall or test_result["NDCG@k"] > best_test_ndcg or test_result["Hit@k"] > best_test_hr or test_result["Recall@k"] > best_test_recall:
                best_val_ndcg = max(val_result["NDCG@k"], best_val_ndcg)
                best_val_hr = max(val_result["Hit@k"], best_val_hr)
                best_val_recall = max(val_result["Recall@k"], best_val_recall)
                best_test_ndcg = max(test_result["NDCG@k"], best_test_ndcg)
                best_test_hr = max(test_result["Hit@k"], best_test_hr)
                best_test_recall = max(test_result["Recall@k"], best_test_recall)
                folder = train_dir
                fname = 'SASRec.epoch={}.learning_rate={}.layer={}.head={}.embedding_dims={}.sequence_size={}.pth'
                fname = fname.format(epoch, args.learning_rate, args.num_blocks, args.num_heads, args.embedding_dims, args.sequence_size)
                torch.save(model.state_dict(), os.path.join(folder, fname))

            f.write(str(epoch) + ' ' + str(val_result) + ' ' + str(test_result) + '\n')
            f.flush()
            t0 = time.time()
            model.train()

    f.close()
    print("I am done training")
    
    model.eval()
    recommendation = defaultdict(list)

    with tqdm(total=num_batch, desc=f"Predict recommended product", unit="batch") as pbar:
        for step in range(num_batch):
            user, seq_product, pos_product, neg_product = sampler.next_batch()
            user, seq_product, pos_product, neg_product = np.array(user), np.array(seq_product), np.array(pos_product), np.array(neg_product)
    
            for index, u in enumerate(user):
                interacted = set(train[u] + validation[u] + test[u])
                predict = list(set(range(num_products)) - interacted)

                predictions = -model.predict(
                    u,
                    np.array([seq_product[index]]),
                    np.array([predict])
                )[0]

                predictions = predictions.squeeze()

                if predictions.ndim == 1:
                    top5_idx = predictions.argsort()[:5]
                    top5_products = [predict[i] for i in top5_idx]
                    recommendation[u] = top5_products
                else:
                    raise ValueError(f"Expected 1D predictions, got shape: {predictions.shape}")

            pbar.set_postfix({"loss": f"{loss.item():.4f}"})
            pbar.update(1)

    df = pd.DataFrame([
        {'user_id': user_id, 'recommended_products': products}
        for user_id, products in recommendation.items()
    ])
    df.to_csv(args.recommendation_save_path, index=False)

if __name__ == '__main__':
    main()

    