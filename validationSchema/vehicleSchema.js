exports.vehicleSchema = {
  vehicleName: {
    notEmpty: {
      errorMessage: "Vehicle Name is required.",
    },
    isString: {
      errorMessage: "Vehicle Name must be in string format.",
    },
  },
  vehicleType: {
    notEmpty: {
      errorMessage: "Vehicle Type is required.",
    },
    isString: {
      errorMessage: "Vehicle Type must be in string format.",
    },
  },
  vehicleNumberPlate: {
    notEmpty: {
      errorMessage: "Vehicle Number Plate is required.",
    },
    isString: {
      errorMessage: "Vehicle Number Plate must be in string format.",
    },
  },
  vehicleCapacity: {
    notEmpty: {
      errorMessage: "Vehicle Capacity is required.",
    },
    isNumeric: {
      errorMessage: "Vehicle Capacity must be in numeric format.",
    },
  },
  vehiclePhoto: {
    notEmpty: {
      errorMessage: "Vehicle Photo is required.",
    },
    isString: {
      errorMessage: "Vehicle Photo must be in string format.",
    },
  },
  featureImages: {
    notEmpty: {
      errorMessage: "Feature Images is required.",
    },
    isArray: {
      errorMessage: "Feature Images must be an array",
    },
    // isLength: {
    //   options: { max: 2 },
    //   errorMessage: "More than 2 Images is not allowed",
    // },
    custom: {
      options: (value) => {
        return value.every((item) => typeof item === "string");
      },
      errorMessage: "Feature Images must be in string format",
    },
  },
  blueBookPhoto: {
    notEmpty: {
      errorMessage: "Blue-Book Photos is required.",
    },

    isArray: {
      errorMessage: "Blue-Book Photos must be an array",
    },
    // isLength: {
    //   options: { max: 2 },
    //   errorMessage: "More than 2 Images is not allowed",
    // },
    custom: {
      options: (value) => {
        return value.every((item) => typeof item === "string");
      },
      errorMessage: "Blue-Book Images must be in string format",
    },
  },
  driverDetails: {
    notEmpty: {
      errorMessage: "Driver Details is required.",
    },
    isObject: {
      errorMessage: "Driver Details must be in object format.",
    },
  },
  "driverDetails.driverName": {
    notEmpty: {
      errorMessage: "Driver Name is required.",
    },
    isString: {
      errorMessage: "Driver Name must be in string format.",
    },
  },
  "driverDetails.driverLicencePhoto": {
    notEmpty: {
      errorMessage: "Driver Licence Photo is required.",
    },
    isString: {
      errorMessage: "Driver Licence Photo must be in string format.",
    },
  },
  "driverDetails.driverContactNumber": {
    notEmpty: {
      errorMessage: "Driver Contact Number is required.",
    },
    isString: {
      errorMessage: "Driver Contact Number must be in string format.",
    },
  },
  "driverDetails.conducterName": {
    optional: true,
    isString: {
      errorMessage: "Conducter Name must be in string format.",
    },
  },
};
