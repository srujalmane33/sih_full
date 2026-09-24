import pandas as pd
import numpy as np
import joblib
import os
import json

from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.dummy import DummyClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)


# ============================================================
# Directories
# ============================================================

os.makedirs(
    "ml/trained_models",
    exist_ok=True
)

os.makedirs(
    "ml/metrics",
    exist_ok=True
)


# ============================================================
# Load data
# ============================================================

df = pd.read_csv(
    "data/moil_daily_operations.csv"
)

df["Date"] = pd.to_datetime(
    df["Date"]
)


# ============================================================
# Sort chronologically
# ============================================================

df = df.sort_values(
    "Date"
).reset_index(drop=True)


# ============================================================
# Features
# ============================================================

features = [
    "Pit_Code",
    "Rainfall_mm",
    "Water_Logging_Hours",
    "Active_Dumpers",
    "Active_Excavators",
    "Equipment_Availability",
    "Blasting_Delay_Flag",
    "Haul_Distance_km",
    "Shift_Efficiency"
]

target = "Shortfall_Risk_Flag"


X = df[features]
y = df[target]


# ============================================================
# Temporal split
#
# First 80% = training
# Last 20%  = testing
# ============================================================

split_index = int(
    len(df) * 0.80
)

X_train = X.iloc[
    :split_index
]

y_train = y.iloc[
    :split_index
]

X_test = X.iloc[
    split_index:
]

y_test = y.iloc[
    split_index:
]


print("============================================")
print("Shortfall Model Training")
print("============================================")

print("Training samples:", len(X_train))
print("Testing samples :", len(X_test))


# ============================================================
# Baseline
# ============================================================

baseline = DummyClassifier(
    strategy="most_frequent"
)

baseline.fit(
    X_train,
    y_train
)

baseline_pred = baseline.predict(
    X_test
)


print()
print(
    "Baseline Accuracy:",
    round(
        accuracy_score(
            y_test,
            baseline_pred
        ),
        3
    )
)


# ============================================================
# HistGradientBoosting
# ============================================================

model = HistGradientBoostingClassifier(
    max_iter=150,
    max_depth=5,
    learning_rate=0.06,
    l2_regularization=1.0,
    random_state=42
)


model.fit(
    X_train,
    y_train
)


# ============================================================
# Predictions
# ============================================================

predictions = model.predict(
    X_test
)

probabilities = model.predict_proba(
    X_test
)[:, 1]


# ============================================================
# Metrics
# ============================================================

accuracy = accuracy_score(
    y_test,
    predictions
)

precision = precision_score(
    y_test,
    predictions,
    zero_division=0
)

recall = recall_score(
    y_test,
    predictions,
    zero_division=0
)

f1 = f1_score(
    y_test,
    predictions,
    zero_division=0
)

roc_auc = roc_auc_score(
    y_test,
    probabilities
)

cm = confusion_matrix(
    y_test,
    predictions
)


print()
print("Model Performance")
print("-------------------------")

print(
    "Accuracy :",
    round(accuracy, 3)
)

print(
    "Precision:",
    round(precision, 3)
)

print(
    "Recall   :",
    round(recall, 3)
)

print(
    "F1 Score :",
    round(f1, 3)
)

print(
    "ROC-AUC  :",
    round(roc_auc, 3)
)

print()
print("Confusion Matrix:")
print(cm)

print()
print(
    classification_report(
        y_test,
        predictions,
        zero_division=0
    )
)


# ============================================================
# Save metrics
# ============================================================

metrics = {
    "accuracy": float(accuracy),
    "precision": float(precision),
    "recall": float(recall),
    "f1": float(f1),
    "roc_auc": float(roc_auc),
    "confusion_matrix": cm.tolist(),
    "training_samples": int(len(X_train)),
    "testing_samples": int(len(X_test)),
    "features": features
}


with open(
    "ml/metrics/shortfall_metrics.json",
    "w"
) as f:
    json.dump(
        metrics,
        f,
        indent=4
    )


# ============================================================
# Save model
# ============================================================

output_path = (
    "ml/trained_models/"
    "shortfall_gradient_model.joblib"
)

joblib.dump(
    model,
    output_path
)


print()
print("Model saved to:")
print(output_path)