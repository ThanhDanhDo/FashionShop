import torch
import torch.nn as nn
import numpy as np

class point_wise_feed_forward_net(nn.Module):
    def __init__(self, embedding_dims, dropout_rate):
        super().__init__()
        self.conv1 = nn.Conv1d(in_channels=embedding_dims, out_channels=embedding_dims, kernel_size=1)
        self.conv2 = nn.Conv1d(in_channels=embedding_dims, out_channels=embedding_dims, kernel_size=1)

        self.dropout1 = nn.Dropout(dropout_rate)
        self.dropout2 = nn.Dropout(dropout_rate)

        self.relu = nn.ReLU()

    def forward(self, inputs):
        outputs = self.dropout1(self.relu(self.conv1(inputs.transpose(-1, -2))))
        outputs = self.dropout2(self.conv2(outputs)).transpose(-1, -2)

        return outputs

class SASREC(nn.Module):
    def __init__(self, num_users, num_products, device, embedding_dims = 64, sequence_size = 50, dropout_rate = 0.1, num_blocks = 2):
        super().__init__()
        self.num_users = num_users
        self.num_products = num_products
        self.device = device

        self.product_emb = torch.nn.Embedding(self.num_products+1, embedding_dims, padding_idx=0)
        self.position_emb = torch.nn.Embedding(sequence_size+1, embedding_dims, padding_idx=0)

        self.dropout = torch.nn.Dropout(dropout_rate)

        self.attention_layernorms = torch.nn.ModuleList()
        self.attention_layers = torch.nn.ModuleList()

        self.forward_layernorms = torch.nn.ModuleList()
        self.forward_layers = torch.nn.ModuleList()

        self.last_layernorm = torch.nn.LayerNorm(embedding_dims, eps=1e-8)

        for _ in range(num_blocks):
            new_attention_layernorm = torch.nn.LayerNorm(embedding_dims, eps=1e-8)
            self.attention_layernorms.append(new_attention_layernorm)

            new_attention_layer = torch.nn.MultiheadAttention(embedding_dims, num_heads=4)
            self.attention_layers.append(new_attention_layer)

            new_forward_layernorm = torch.nn.LayerNorm(embedding_dims, eps=1e-8)
            self.forward_layernorms.append(new_forward_layernorm)

            new_forward_layer = point_wise_feed_forward_net(embedding_dims, dropout_rate)
            self.forward_layers.append(new_forward_layer)

    def contextualized_respresent(self, user_interacts):
        if torch.is_tensor(user_interacts):
            user_interacts_np = user_interacts.cpu().numpy()
        else:
            user_interacts_np = user_interacts
        interacts_emb = self.product_emb(torch.LongTensor(user_interacts_np).to(self.device)) * (self.product_emb.embedding_dim ** 0.5)
        
        seq_length = user_interacts_np.shape[1]
        positions = torch.arange(1, seq_length + 1, device=self.device).unsqueeze(0)
        mask = torch.LongTensor(user_interacts_np != 0).to(self.device)
        filtered_pos = positions * mask
        
        positions_emb = self.position_emb(filtered_pos)
        
        contextualized_respresent = interacts_emb + positions_emb
        contextualized_respresent = self.dropout(contextualized_respresent)
        mask_length = contextualized_respresent.shape[1]
        attention_mask = ~torch.tril(torch.ones((mask_length, mask_length), dtype=torch.bool, device=self.device))

        for i in range(len(self.attention_layers)):
            contextualized_respresent = torch.transpose(contextualized_respresent, 0, 1)
            query = self.attention_layernorms[i](contextualized_respresent)
            contextualized_respresent, _ = self.attention_layers[i](
                query, contextualized_respresent, contextualized_respresent, 
                attn_mask=attention_mask
            )
            contextualized_respresent += query
            contextualized_respresent = torch.transpose(contextualized_respresent, 0, 1)

            contextualized_respresent = self.forward_layernorms[i](contextualized_respresent)
            contextualized_respresent = self.forward_layers[i](contextualized_respresent)

        contextualized_respresent = self.last_layernorm(contextualized_respresent)
        return contextualized_respresent

    def forward(self, user_ids, user_interacts, pos_interacts, neg_interacts):
        contextualized_respresent = self.contextualized_respresent(user_interacts)

        pos_embs = self.product_emb(torch.LongTensor(pos_interacts).to(self.device))
        neg_embs = self.product_emb(torch.LongTensor(neg_interacts).to(self.device))

        pos_logits = (contextualized_respresent * pos_embs).sum(dim=-1)
        neg_logits = (contextualized_respresent * neg_embs).sum(dim=-1)

        return pos_logits, neg_logits

    def predict(self, user_ids, user_interacts, product_indices):
        contextualized_respresent = self.contextualized_respresent(user_interacts)

        final_respresent = contextualized_respresent[:, -1, :]

        product_embs = self.product_emb(torch.LongTensor(product_indices).to(self.device))

        logits = product_embs.matmul(final_respresent.unsqueeze(-1)).squeeze(-1)

        return logits