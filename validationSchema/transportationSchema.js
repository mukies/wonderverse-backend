exports.transportationSchema = {
  tourID: {
    notEmpty: {
      errorMessage: "Tour ID is required.",
    },
    isString: {
      errorMessage: "Tour ID must be in string format.",
    },
  },
  transportationType: {
    notEmpty: {
      errorMessage: "Transportation Type is required.",
    },
    isString: {
      errorMessage: "Transportation Type must be in string format.",
    },
  },
  costPerPerson: {
    notEmpty: {
      errorMessage: "Cost per Person is required.",
    },
    isNumeric: {
      errorMessage: "Cost per Person must be in numeric format.",
    },
  },
  transportationDesc: {
    optional: true,
    isString: {
      errorMessage: "Description must be in string format.",
    },
    isLength: {
      options: { min: 50 },
      errorMessage: "Description must be at least 50 characters long",
    },
  },
  contactNumber: {
    notEmpty: {
      errorMessage: "Contact Number is required.",
    },
    isString: {
      errorMessage: "Contact Number must be in string format.",
    },
  },
  contactEmail: {
    notEmpty: {
      errorMessage: "Email is required.",
    },
    isEmail: {
      errorMessage: "Invalid email format.",
    },
  },
  estimatedDuration: {
    notEmpty: {
      errorMessage: "Estimated Duration is required.",
    },
    isString: {
      errorMessage: "Estimated Duration must be in string format.",
    },
  },
  from: {
    notEmpty: {
      errorMessage: "From field is required.",
    },
    isString: {
      errorMessage: "From field must be in string format.",
    },
  },
  capacity: {
    optional: true,
    isNumeric: {
      errorMessage: "Cost per Person must be in numeric format.",
    },
  },
};
