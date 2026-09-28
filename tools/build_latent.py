"""
build_latent.py — projection réelle des projets et compétences en 2D.

Chaîne : data/corpus.json
         -> encodage par un modèle de phrases multilingue (transformers, mean pooling)
         -> t-SNE (scikit-learn, distance cosinus)
         -> data/latent.json, lu par le site.

Le JSON conserve le nom du modèle et les paramètres exacts : la page affiche
ce qui a réellement été calculé, pas une étiquette décorative.

Usage :
    python tools/build_latent.py
    python tools/build_latent.py --model intfloat/multilingual-e5-small --perplexity 8
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import torch
from sklearn.manifold import TSNE
from transformers import AutoModel, AutoTokenizer

ROOT = Path(__file__).resolve().parents[1]
CORPUS = ROOT / "data" / "corpus.json"
OUTPUT = ROOT / "data" / "latent.json"

# Modèle multilingue léger (~470 Mo) : le corpus est en français.
DEFAULT_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"


def encode(texts: list[str], model_name: str) -> np.ndarray:
    """Encode les textes et renvoie des vecteurs normalisés (mean pooling)."""
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name)
    model.eval()

    vectors = []
    batch_size = 16
    for start in range(0, len(texts), batch_size):
        batch = texts[start : start + batch_size]
        inputs = tokenizer(batch, padding=True, truncation=True, max_length=256, return_tensors="pt")
        with torch.no_grad():
            output = model(**inputs).last_hidden_state
        mask = inputs["attention_mask"].unsqueeze(-1).float()
        pooled = (output * mask).sum(1) / mask.sum(1).clamp(min=1e-9)
        vectors.append(torch.nn.functional.normalize(pooled, p=2, dim=1).cpu().numpy())
    return np.vstack(vectors)


def project(vectors: np.ndarray, perplexity: float, seed: int) -> np.ndarray:
    """t-SNE en 2D, puis mise à l'échelle dans un carré 0-100 avec marge."""
    tsne = TSNE(
        n_components=2,
        metric="cosine",
        init="pca",
        perplexity=perplexity,
        learning_rate="auto",
        max_iter=2000,
        random_state=seed,
    )
    xy = tsne.fit_transform(vectors)
    lo, hi = xy.min(axis=0), xy.max(axis=0)
    span = np.where(hi - lo == 0, 1, hi - lo)
    return 6 + 88 * (xy - lo) / span


def neighbours(vectors: np.ndarray, k: int) -> np.ndarray:
    """k plus proches voisins par similarité cosinus (vecteurs déjà normalisés)."""
    similarity = vectors @ vectors.T
    np.fill_diagonal(similarity, -np.inf)
    return np.argsort(-similarity, axis=1)[:, :k], similarity


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--perplexity", type=float, default=8.0)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--neighbours", type=int, default=2)
    args = parser.parse_args()

    corpus = json.loads(CORPUS.read_text(encoding="utf-8"))
    texts = [item["text"] for item in corpus]
    print(f"{len(texts)} entrées à encoder avec {args.model}")

    vectors = encode(texts, args.model)
    print(f"vecteurs : {vectors.shape}")

    perplexity = min(args.perplexity, (len(texts) - 1) / 3)
    xy = project(vectors, perplexity, args.seed)
    knn, similarity = neighbours(vectors, args.neighbours)

    points = []
    for i, item in enumerate(corpus):
        close = [
            {"id": corpus[j]["id"], "similarity": round(float(similarity[i, j]), 4)}
            for j in knn[i]
        ]
        points.append({**item, "x": round(float(xy[i, 0]), 2), "y": round(float(xy[i, 1]), 2), "near": close})

    edges = []
    seen = set()
    for i, row in enumerate(knn):
        for j in row:
            key = tuple(sorted((i, int(j))))
            if key in seen:
                continue
            seen.add(key)
            edges.append({"a": corpus[key[0]]["id"], "b": corpus[key[1]]["id"],
                          "similarity": round(float(similarity[key[0], key[1]]), 4)})

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "model": args.model,
        "method": "t-SNE (scikit-learn)",
        "params": {
            "perplexity": round(float(perplexity), 2),
            "metric": "cosine",
            "init": "pca",
            "seed": args.seed,
            "dimensions": int(vectors.shape[1]),
        },
        "counts": {
            "points": len(points),
            "projects": sum(1 for p in points if p["kind"] == "project"),
            "skills": sum(1 for p in points if p["kind"] == "skill"),
            "edges": len(edges),
        },
        "points": points,
        "edges": edges,
    }
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"écrit : {OUTPUT.relative_to(ROOT)} ({len(points)} points, {len(edges)} liens, "
          f"perplexity={payload['params']['perplexity']})")


if __name__ == "__main__":
    main()
