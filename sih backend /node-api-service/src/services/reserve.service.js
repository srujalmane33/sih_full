const mlClient = require('../config/mlClient');

const BoreholeRecord = require('../models/BoreholeRecord');

const logger = require('../utils/logger');


exports.estimateReserve = async (coords) => {

  const {

    latitude,
    longitude,
    depth_m,

    surface_ndvi,
    surface_ndwi,

    slope_deg,

    fracture_density,

    rock_hardness,

    distance_to_fault_m,

    fe_content,

    sio2_content

  } = coords;


  const { data } = await mlClient.post(
    '/predict-reserves',
    {

      latitude: parseFloat(latitude),

      longitude: parseFloat(longitude),

      depth_m: parseFloat(depth_m),


      surface_ndvi:
        surface_ndvi !== undefined
          ? parseFloat(surface_ndvi)
          : 0.35,


      surface_ndwi:
        surface_ndwi !== undefined
          ? parseFloat(surface_ndwi)
          : 0.10,


      slope_deg:
        slope_deg !== undefined
          ? parseFloat(slope_deg)
          : 10.0,


      fracture_density:
        fracture_density !== undefined
          ? parseFloat(fracture_density)
          : 5.0,


      rock_hardness:
        rock_hardness !== undefined
          ? parseFloat(rock_hardness)
          : 65.0,


      distance_to_fault_m:
        distance_to_fault_m !== undefined
          ? parseFloat(distance_to_fault_m)
          : 10.0,


      fe_content:
        fe_content !== undefined
          ? parseFloat(fe_content)
          : 10.0,


      sio2_content:
        sio2_content !== undefined
          ? parseFloat(sio2_content)
          : 45.0

    }
  );


  // Optional database persistence

  BoreholeRecord.create({

    boreholeId:
      `BH_REQ_${Date.now().toString().slice(-4)}`,

    latitude,

    longitude,

    depthMeters: depth_m,

    predictedMnGrade:
      data.predicted_mn_percentage,

    gradeClass:
      data.grade_class

  }).catch(
    err =>
      logger.warn(
        "DB save skipped:",
        err.message
      )
  );


  return data;
};