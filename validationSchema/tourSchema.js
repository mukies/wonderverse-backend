exports.tourSchema = {
  placeName: {
    notEmpty: {
      errorMessage: "Place Name is required.",
    },
    isString: {
      errorMessage: "Place Name must be in string format",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Place Name must be at least 3 characters long",
    },
  },
  state: {
    notEmpty: {
      errorMessage: "State object id is required.",
    },
    isString: {
      errorMessage: "State object id must be in string format",
    },
  },
  activity: {
    notEmpty: {
      errorMessage: "Activity object id is required.",
    },
    isString: {
      errorMessage: "Activity object id must be in string format",
    },
  },
  location: {
    notEmpty: {
      errorMessage: "Location is required.",
    },
    isString: {
      errorMessage: "Location must be in string format",
    },
  },
  mainImage: {
    notEmpty: {
      errorMessage: "Main image is required.",
    },
    isString: {
      errorMessage: "Main image must be in base64 string format.",
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
  included: {
    optional: true,
    isString: {
      errorMessage: "What's Included field must be in string format",
    },
  },
  // excluded: {
  //   optional: true,
  //   isString: {
  //     errorMessage: "What's Excluded field must be in string format",
  //   },
  // },
  description: {
    optional: true,
    isString: {
      errorMessage: "Description must be in string format",
    },
  },

  // type: {
  //   isIn: {
  //     options: [["normal", "package"]],
  //     errorMessage: 'Type must be either "normal" or "package".',
  //   },
  // },
  // places: {
  //   custom: {
  //     options: (value, { req }) => {
  //       if (req.body.type === "package" && (!value || value.length === 0)) {
  //         throw new Error('Places field is required when type is "package".');
  //       }
  //       return true;
  //     },
  //   },
  //   isArray: {
  //     options: true,
  //     errorMessage: "Places must be an array.",
  //   },
  //   custom: {
  //     options: (value, { req }) => {
  //       if (req.body.type === "package" && !Array.isArray(value)) {
  //         throw new Error("Places must be an array.");
  //       }
  //       return true;
  //     },
  //   },
  // },
};
