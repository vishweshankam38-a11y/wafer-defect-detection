import pandas as pd
import numpy as np
import cv2
import os
from tqdm import tqdm

print("Loading dataset...")

df = pd.read_pickle("../dataset/LSWMD.pkl")

save_dir = "../dataset/images"

os.makedirs(save_dir, exist_ok=True)

count = 0

print("Converting wafer maps to images...")

for i in tqdm(range(len(df))):

    wafer = df.iloc[i]["waferMap"]
    label = df.iloc[i]["failureType"]

    if isinstance(label, np.ndarray):

        if len(label) == 0:
            continue

        label = label[0]

    if label is None:
        continue

    label = str(label).replace(" ", "_")

    class_dir = os.path.join(save_dir, label)

    os.makedirs(class_dir, exist_ok=True)

    img = (wafer * 255).astype("uint8")

    path = os.path.join(class_dir, f"{count}.png")

    cv2.imwrite(path, img)

    count += 1

print("Dataset conversion completed!")
print("Total images:", count)