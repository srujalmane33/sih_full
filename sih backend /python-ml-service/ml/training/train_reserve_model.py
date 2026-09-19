import pandas as pd
import numpy as np
import joblib
import os

from sklearn.ensemble import RandomForestRegressor
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# ============================================================
# Directories
# ============================================================

os.makedirs("ml/trained_models", exist_ok=True)
os.makedirs("ml/metrics", exist_ok=True)


# ============================================================
# Load data
# ============================================================

df = pd.read_csv(
    "data/moil_borehole_reserves.csv"
)


# ============================================================
# Features
# ============================================================

features = [
    "Latitude",
    "Longitude",
    "Depth_m",
    "Surface_NDVI",
    "Surface_NDWI",
    "Slope_Deg",
    "Fracture_Density",
    "Rock_Hardness",
    "Distance_to_Fault_m",
    "Fe_Content",
    "SiO2_Content"
]

target = "Mn_Percentage"


X = df[features]
y = df[target]


# ============================================================
# Spatial holdout
#
# Instead of random splitting, divide the study area into
# spatial blocks and keep some blocks completely unseen.
# ============================================================

df["lat_block"] = (
    df["Latitude"] / 0.004
).astype(int)

df["lon_block"] = (
    df["Longitude"] / 0.004
).astype(int)

df["spatial_block"] = (
    df["lat_block"].astype(str)
    + "_"
    + df["lon_block"].astype(str)
)


blocks = df["spatial_block"].unique()

np.random.seed(42)

np.random.shuffle(blocks)

test_block_count = max(
    1,
    int(len(blocks) * 0.20)
)

test_blocks = set(
    blocks[:test_block_count]
)

test_mask = df["spatial_block"].isin(
    test_blocks
)

train_mask = ~test_mask


X_train = df.loc[
    train_mask,
    features
]

y_train = df.loc[
    train_mask,
    target
]

X_test = df.loc[
    test_mask,
    features
]

y_test = df.loc[
    test_mask,
    target
]


print("============================================")
print("Reserve Model Training")
print("============================================")

print("Training samples:", len(X_train))
print("Testing samples :", len(X_test))


# ============================================================
# Baseline
# ============================================================

baseline = DummyRegressor(
    strategy="mean"
)

baseline.fit(
    X_train,
    y_train
)

baseline_pred = baseline.predict(
    X_test
)

baseline_mae = mean_absolute_error(
    y_test,
    baseline_pred
)

baseline_rmse = np.sqrt(
    mean_squared_error(
        y_test,
        baseline_pred
    )
)

baseline_r2 = r2_score(
    y_test,
    baseline_pred
)


# ============================================================
# Random Forest
# ============================================================

model = RandomForestRegressor(
    n_estimators=300,
    max_depth=12,
    min_samples_leaf=3,
    random_state=42,
    n_jobs=-1
)


model.fit(
    X_train,
    y_train
)


# ============================================================
# Evaluation
# ============================================================

predictions = model.predict(
    X_test
)

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = np.sqrt(
    mean_squared_error(
        y_test,
        predictions
    )
)

r2 = r2_score(
    y_test,
    predictions
)


print()
print("Baseline:")
print("MAE :", round(baseline_mae, 3))
print("RMSE:", round(baseline_rmse, 3))
print("R2  :", round(baseline_r2, 3))

print()
print("Random Forest:")
print("MAE :", round(mae, 3))
print("RMSE:", round(rmse, 3))
print("R2  :", round(r2, 3))


# ============================================================
# Feature importance
# ============================================================

importance = pd.DataFrame({
    "Feature": features,
    "Importance": model.feature_importances_
})

importance = importance.sort_values(
    "Importance",
    ascending=False
)

importance.to_csv(
    "ml/metrics/reserve_feature_importance.csv",
    index=False
)


# ============================================================
# Save metrics
# ============================================================

metrics = {
    "baseline": {
        "MAE": round(float(baseline_mae), 4),
        "RMSE": round(float(baseline_rmse), 4),
        "R2": round(float(baseline_r2), 4)
    },
    "random_forest": {
        "MAE": round(float(mae), 4),
        "RMSE": round(float(rmse), 4),
        "R2": round(float(r2), 4)
    },
    "training_samples": int(len(X_train)),
    "testing_samples": int(len(X_test)),
    "features": features
}

import json

with open(
    "ml/metrics/reserve_metrics.json",
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
    "reserve_rf_model.joblib"
)

joblib.dump(
    model,
    output_path
)

print()
print("Model saved to:")
print(output_path)

print()
print("Feature importance saved to:")
print("ml/metrics/reserve_feature_importance.csv")