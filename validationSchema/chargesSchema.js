exports.chargesSchema = {
  serviceCharge: {
    notEmpty: {
      errorMessage: "Service charge is require",
    },
    isNumeric: {
      errorMessage: "Service charge must be numeric",
    },
  },
  taxPercent: {
    notEmpty: {
      errorMessage: "Tax percent is require",
    },
    isNumeric: {
      errorMessage: "Tax percent must be numeric",
    },
  },
  insuranceCharge: {
    notEmpty: {
      errorMessage: "Insurance charge is require",
    },
    isNumeric: {
      errorMessage: "Insurance charge must be numeric",
    },
  },
};
