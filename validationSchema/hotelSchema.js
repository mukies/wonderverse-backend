exports.hotelSchema = {
  tour: {
    notEmpty: {
      errorMessage: "Tour ID is required.",
    },
    isArray: {
      errorMessage: "Tour ID must be in array format.",
    },
  },
  hotelDocuments: {
    notEmpty: {
      errorMessage: "Hotel Documents is required.",
    },
    isObject: {
      errorMessage: "Hotel Documents must be in object format.",
    },
  },
  hotelDetails: {
    notEmpty: {
      errorMessage: "Hotel Details is required.",
    },
    isObject: {
      errorMessage: "Hotel Details must be in object format.",
    },
  },

  "hotelDetails.hotelName": {
    notEmpty: {
      errorMessage: "Hotel Name is required.",
    },
    isString: {
      errorMessage: "Hotel Name must be in string format.",
    },
  },
  "hotelDetails.livingCostPerDayPerPerson": {
    notEmpty: {
      errorMessage: "Living Cost per Day per Person is required.",
    },
    isNumeric: {
      errorMessage:
        "Living Cost per Day per Person field must be in numeric format.",
    },
  },
  "hotelDetails.hotelDesc": {
    optional: true,
    isString: {
      errorMessage: "Description must be in string format.",
    },
  },
  "hotelDetails.hotelContactNumber": {
    notEmpty: {
      errorMessage: "Hotel Contact number is required.",
    },
    isString: {
      errorMessage: "Contact number must be in string format.",
    },
  },
  "hotelDetails.hotelLocation": {
    notEmpty: {
      errorMessage: "Hotel location is required.",
    },
    isString: {
      errorMessage: "Hotel location must be in string format.",
    },
  },
  "hotelDetails.hotelEmail": {
    notEmpty: {
      errorMessage: "Email is required.",
    },
    isEmail: {
      errorMessage: "Invalid email format.",
    },
  },
  "hotelDetails.hotelMainImage": {
    notEmpty: {
      errorMessage: "Hotel image is required.",
    },
    isString: {
      errorMessage: "Hotel image must be in base64 string format.",
    },
  },
  "hotelDetails.featureImages": {
    optional: true,
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

  //hotel document

  "hotelDocuments.ownerName": {
    notEmpty: {
      errorMessage: "Owner Name is required.",
    },
    isString: {
      errorMessage: "Owner Name must be in string format.",
    },
  },
  "hotelDocuments.ownerCitizenshipPhoto": {
    notEmpty: {
      errorMessage: "Owner Citizenship Photo is required.",
    },
    isArray: {
      errorMessage: "Owner Citizenship Photo must be an array",
    },

    custom: {
      options: (value) => {
        return value.every((item) => typeof item === "string");
      },
      errorMessage: "Front and back side of citizenship Images must be strings",
    },
  },
  "hotelDocuments.hotelRegistrationNumber": {
    notEmpty: {
      errorMessage: "Hotel Registration Number is required.",
    },
    isString: {
      errorMessage: "Hotel Registration Number must be in string format.",
    },
  },
  "hotelDocuments.hotelRegistrationPhoto": {
    notEmpty: {
      errorMessage: "Hotel Registration Photo is required.",
    },
    isString: {
      errorMessage: "Hotel Registration Photo must be in string format.",
    },
  },
  "hotelDocuments.hotelPanNumber": {
    notEmpty: {
      errorMessage: "Hotel Pan Number is required.",
    },
    isString: {
      errorMessage: "Hotel Pan Number must be in string format.",
    },
  },
  "hotelDocuments.hotelPanNumberPhoto": {
    notEmpty: {
      errorMessage: "Hotel Pan Card Photo is required.",
    },
    isString: {
      errorMessage: "Hotel Pan Card Photo must be in string format.",
    },
  },
};
