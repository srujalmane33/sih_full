import numpy as np
import pandas as pd
import os

os.makedirs("data", exist_ok=True)

np.random.seed(42)


# ============================================================
# 1. BOREHOLE / GEOLOGICAL DATA
# ============================================================

bh_records = []

for i in range(1, 1001):

    # Study area
    lat = np.random.uniform(21.790, 21.820)
    lon = np.random.uniform(79.795, 79.825)

    # Borehole depth
    depth = np.random.uniform(10, 100)

    # --------------------------------------------------------
    # Geological spatial mineralization zones
    # --------------------------------------------------------

    zone_1 = np.exp(
        -(
            ((lat - 21.805) / 0.006) ** 2
            + ((lon - 79.810) / 0.007) ** 2
        )
    )

    zone_2 = 0.7 * np.exp(
        -(
            ((lat - 21.812) / 0.004) ** 2
            + ((lon - 79.802) / 0.005) ** 2
        )
    )

    zone_3 = 0.5 * np.exp(
        -(
            ((lat - 21.798) / 0.005) ** 2
            + ((lon - 79.818) / 0.004) ** 2
        )
    )

    mineralization = zone_1 + zone_2 + zone_3

    # --------------------------------------------------------
    # Depth influence
    # Manganese mineralization concentrated at certain depths
    # --------------------------------------------------------

    depth_effect = np.exp(-((depth - 52) / 20) ** 2)

    # --------------------------------------------------------
    # Structural / geological features
    # --------------------------------------------------------

    distance_to_fault = abs(
        1000 * (lon - (79.810 + 0.4 * (lat - 21.805)))
    )

    fracture_density = np.clip(
        2 + mineralization * 8 + np.random.normal(0, 1.5),
        0.2,
        15
    )

    rock_hardness = np.clip(
        70 - mineralization * 12 + np.random.normal(0, 5),
        35,
        90
    )

    slope = np.clip(
        np.random.normal(10, 4),
        1,
        25
    )

    # --------------------------------------------------------
    # Lithology
    # --------------------------------------------------------

    lithology = np.random.choice(
        ["Metasediment", "Quartzite", "Schist", "Banded_Manganese"],
        p=[0.30, 0.25, 0.25, 0.20]
    )

    lithology_effect = {
        "Metasediment": 0,
        "Quartzite": -2,
        "Schist": 3,
        "Banded_Manganese": 8
    }[lithology]

    # --------------------------------------------------------
    # Satellite variables
    # IMPORTANT:
    # NDVI and NDWI are generated independently.
    # They are NOT calculated from Mn grade.
    # --------------------------------------------------------

    ndvi = np.clip(
        np.random.normal(0.42, 0.12),
        0.05,
        0.85
    )

    ndwi = np.clip(
        np.random.normal(0.10, 0.08),
        -0.2,
        0.6
    )

    # --------------------------------------------------------
    # Geochemical variables
    # --------------------------------------------------------

    fe_content = np.clip(
        np.random.normal(10, 3),
        2,
        20
    )

    sio2_content = np.clip(
        np.random.normal(45, 8),
        20,
        70
    )

    # --------------------------------------------------------
    # Mn grade
    # --------------------------------------------------------

    mn_grade = (
        8
        + 28 * mineralization
        + 10 * depth_effect
        + 0.5 * fracture_density
        - 0.08 * rock_hardness
        - 0.015 * distance_to_fault
        + lithology_effect
        + np.random.normal(0, 3)
    )

    # Add some influence from chemistry
    mn_grade += -0.08 * fe_content
    mn_grade += -0.03 * sio2_content

    mn_grade = np.clip(mn_grade, 2, 52)

    # --------------------------------------------------------
    # Ore classification
    # --------------------------------------------------------

    if mn_grade >= 35:
        ore_class = "High_Grade"
    elif mn_grade >= 20:
        ore_class = "Medium_Grade"
    else:
        ore_class = "Low_Grade_Waste"

    bh_records.append({
        "Borehole_ID": f"BH_{i:04d}",
        "Latitude": lat,
        "Longitude": lon,
        "Depth_m": depth,
        "Surface_NDVI": ndvi,
        "Surface_NDWI": ndwi,
        "Slope_Deg": slope,
        "Lithology": lithology,
        "Fracture_Density": fracture_density,
        "Rock_Hardness": rock_hardness,
        "Distance_to_Fault_m": distance_to_fault,
        "Fe_Content": fe_content,
        "SiO2_Content": sio2_content,
        "Mn_Percentage": mn_grade,
        "Ore_Class": ore_class
    })


df_bh = pd.DataFrame(bh_records)

df_bh.to_csv(
    "data/moil_borehole_reserves.csv",
    index=False
)


# ============================================================
# 2. DAILY OPERATIONS DATA
# ============================================================

ops_records = []

pits = [
    "Pit-1_East",
    "Pit-2_Central",
    "Pit-3_DeepBench"
]

pit_mapping = {
    "Pit-1_East": 0,
    "Pit-2_Central": 1,
    "Pit-3_DeepBench": 2
}


dates = pd.date_range(
    start="2025-01-01",
    periods=700,
    freq="D"
)


for _ in range(2000):

    date = np.random.choice(dates)

    pit = np.random.choice(pits)

    rain = np.random.exponential(scale=18.0)

    if np.random.rand() < 0.35:
        rain = 0.0

    rain = max(0, rain)

    dumpers = np.random.randint(3, 11)

    excavators = np.random.randint(1, 4)

    equipment_availability = np.clip(
        np.random.normal(0.88, 0.08),
        0.55,
        1.0
    )

    blasting_delay = (
        1
        if (rain > 30 or np.random.rand() < 0.10)
        else 0
    )

    water_logging = 0

    if rain > 25:
        water_logging = min(
            24,
            max(
                0,
                (rain - 25) * 0.3
                + np.random.normal(0, 1)
            )
        )

    haul_distance = np.random.uniform(1.5, 8.0)

    shift_efficiency = np.clip(
        np.random.normal(0.85, 0.10),
        0.50,
        1.0
    )

    planned_tonnes = np.random.uniform(
        1000,
        1500
    )

    # Pit-specific productivity
    pit_factor = {
        "Pit-1_East": 1.00,
        "Pit-2_Central": 0.95,
        "Pit-3_DeepBench": 0.88
    }[pit]

    weather_factor = max(
        0.50,
        1.0 - water_logging / 25
    )

    blasting_factor = (
        0.85
        if blasting_delay
        else 1.0
    )

    haul_factor = max(
        0.70,
        1.0 - haul_distance / 40
    )

    equipment_factor = equipment_availability

    fleet_factor = (
        (dumpers / 10) * 0.60
        + (excavators / 3) * 0.40
    )

    production_efficiency = (
        pit_factor
        * weather_factor
        * blasting_factor
        * haul_factor
        * equipment_factor
        * shift_efficiency
        * fleet_factor
    )

    actual_tonnes = (
        planned_tonnes
        * production_efficiency
        + np.random.normal(0, 25)
    )

    actual_tonnes = max(
        0,
        actual_tonnes
    )

    shortfall = (
        1
        if actual_tonnes < 0.80 * planned_tonnes
        else 0
    )

    ops_records.append({
        "Date": date,
        "Pit_Code": pit_mapping[pit],
        "Pit_Name": pit,
        "Planned_Tonnes": planned_tonnes,
        "Actual_Tonnes": actual_tonnes,
        "Rainfall_mm": rain,
        "Water_Logging_Hours": water_logging,
        "Active_Dumpers": dumpers,
        "Active_Excavators": excavators,
        "Equipment_Availability": equipment_availability,
        "Blasting_Delay_Flag": blasting_delay,
        "Haul_Distance_km": haul_distance,
        "Shift_Efficiency": shift_efficiency,
        "Shortfall_Risk_Flag": shortfall
    })


df_ops = pd.DataFrame(ops_records)

df_ops.to_csv(
    "data/moil_daily_operations.csv",
    index=False
)


print("============================================")
print("Synthetic MOIL datasets generated")
print("============================================")
print(f"Borehole records: {len(df_bh)}")
print(f"Operations records: {len(df_ops)}")
print()
print("Files:")
print("data/moil_borehole_reserves.csv")
print("data/moil_daily_operations.csv")