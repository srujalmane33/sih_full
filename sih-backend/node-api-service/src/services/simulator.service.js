const mlClient = require('../config/mlClient');

exports.runSimulatorPrediction = async (simulatorData) => {
  const {
    locationName,
    latitude,
    longitude,
    targetQuota,
    rainfall,
    soilMoisture,
    equipmentDowntime,
    ndvi,
    rockHardness,
  } = simulatorData;

  const { data } = await mlClient.post('/predict-simulator', {
    location_name: locationName,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    target_quota: parseFloat(targetQuota),
    rainfall: parseFloat(rainfall),
    soil_moisture: parseFloat(soilMoisture),
    equipment_downtime: parseFloat(equipmentDowntime),
    ndvi: parseFloat(ndvi),
    rock_hardness: rockHardness,
  });

  return data;
};
