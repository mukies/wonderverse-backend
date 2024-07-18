exports.guideSchema = {
  guideName: {
    notEmpty: {
      errorMessage: "Guide name is required.",
    },
    isString: {
      errorMessage: "Guide name must be in string format.",
    },
    isLength: {
      options: { min: 2 },
      errorMessage: "Guide name must be at least 2 characters long",
    },
  },
  guideEmail: {
    notEmpty: {
      errorMessage: "Guide email is required.",
    },
    isEmail: {
      errorMessage: "Invalid email format.",
    },
  },

  // price: {
  //   notEmpty: {
  //     errorMessage: "Price is required.",
  //   },
  //   isNumeric: {
  //     errorMessage: "Price must be in numeric format.",
  //   },
  // },

  guidingDestinations: {
    notEmpty: {
      errorMessage: "Guiding Destinations is required.",
    },
    isArray: {
      errorMessage: "Guiding Destinations must be an array",
    },
    custom: {
      options: (value) => {
        return value.every((item) => typeof item === "string");
      },
      errorMessage: "All items of Guiding destination array should be string",
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
  citizenshipPhoto: {
    notEmpty: {
      errorMessage: "Citizenship Photo is required.",
    },
    isArray: {
      errorMessage: "Citizenship Photos must be an array",
    },

    custom: {
      options: (value) => {
        return value.every((item) => typeof item === "string");
      },
      errorMessage: "Front and back side of citizenship Images must be strings",
    },
  },
  guidePhoto: {
    notEmpty: {
      errorMessage: "Guide Photo is required.",
    },
    isString: {
      errorMessage: "Guide Photo must be in string format.",
    },
  },
  nationalIdPhoto: {
    optional: true,
    isString: {
      errorMessage: "National ID field must be in string format.",
    },
  },
};
