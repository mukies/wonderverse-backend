exports.hotelSchema = {
  tourID: {
    notEmpty: {
      errorMessage: "Tour ID is required.",
    },
    isString: {
      errorMessage: "Tour ID must be in string format.",
    },
  },
  hotelName: {
    notEmpty: {
      errorMessage: "Hotel Name is required.",
    },
    isString: {
      errorMessage: "Hotel Name must be in string format.",
    },
  },
  livingCostPerDayPerPerson: {
    notEmpty: {
      errorMessage: "Living Cost per Day per Person is required.",
    },
    isNumeric: {
      errorMessage:
        "Living Cost per Day per Person field must be in numeric format.",
    },
  },
  hotelDesc: {
    optional: true,
    isString: {
      errorMessage: "Description must be in string format.",
    },
    isLength: {
      options: { min: 50 },
      errorMessage: "Description must be at least 50 characters long",
    },
  },
  hotelContactNumber: {
    notEmpty: {
      errorMessage: "Contact number is required.",
    },
    isString: {
      errorMessage: "Contact number must be in string format.",
    },
  },
  hotelLocation: {
    notEmpty: {
      errorMessage: "Hotel location is required.",
    },
    isString: {
      errorMessage: "Hotel location must be in string format.",
    },
  },
  hotelEmail: {
    notEmpty: {
      errorMessage: "Email is required.",
    },
    isEmail: {
      errorMessage: "Invalid email format.",
    },
  },
  hotelMainImage: {
    notEmpty: {
      errorMessage: "Hotel image is required.",
    },
    isString: {
      errorMessage: "Hotel image must be in base64 string format.",
    },
  },
  featureImages: {
    notEmpty: {
      errorMessage: "Feature images is required.",
    },
    isArray: {
      errorMessage: "Feature Images must be an array",
    },
    custom: {
      options: (value) => {
        return value.every((item) => typeof item === "string");
      },
      errorMessage: "All elements of Feature Images must be strings",
    },
  },
};
