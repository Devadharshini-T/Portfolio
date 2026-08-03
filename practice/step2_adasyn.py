import pandas as pd
from imblearn.over_sampling import ADASYN
from collections import Counter

print("Loading Training Data...")

X_train = pd.read_csv("X_train.csv")
y_train = pd.read_csv("y_train.csv").values.ravel()

print("\nOriginal Class Distribution")
print(Counter(y_train))

adasyn = ADASYN(
    random_state=42,
    n_neighbors=5
)

X_resampled, y_resampled = adasyn.fit_resample(
    X_train,
    y_train
)

print("\nBalanced Class Distribution")
print(Counter(y_resampled))

pd.DataFrame(X_resampled).to_csv(
    "X_train_balanced.csv",
    index=False
)

pd.DataFrame(y_resampled).to_csv(
    "y_train_balanced.csv",
    index=False
)

print("\nBalanced dataset saved successfully!")