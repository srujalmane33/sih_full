const reserveService = require('../services/reserve.service');

exports.getReserveEstimation = async (req, res, next) => {
  try {

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
    } = req.body;


    if (
      latitude === undefined ||
      longitude === undefined ||
      depth_m === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: "latitude, longitude, and depth_m are required."
      });
    }


    const result = await reserveService.estimateReserve({

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

    });


    return res.json({
      success: true,
      data: result
    });

  } catch (err) {

    next(err);

  }
};