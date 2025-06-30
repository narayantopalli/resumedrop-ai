import pandas as pd
from tqdm import tqdm
from langchain.text_splitter import RecursiveCharacterTextSplitter
import pickle

DATASET_PATH = "dataset/resumes.csv"

df = pd.read_csv(DATASET_PATH)

resumes_str = df["Resume_str"].tolist()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=400,
    chunk_overlap=100,
)
chunks = []
for resume in tqdm(resumes_str):
    chunks.extend(text_splitter.split_text(resume))

print(len(chunks))

chunks = [chunk for chunk in chunks if len(chunk.replace("\n", "").replace(" ", "").replace("\r", "")) > 100]

print(len(chunks))

print(chunks[0])

with open("chunks/chunks.pkl", "wb") as f:
    pickle.dump(chunks, f)
