exports.tourSchema = {
  placeName: {
    notEmpty: {
      errorMessage: "Place Name is required.",
    },
    isString: {
      errorMessage: "Place Name must be in string format",
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
      errorMessage: "mainImage must be in string format",
    },
  },
  featureImages: {
    notEmpty: {
      errorMessage: "Feature images is required.",
    },
    isArray: {
      errorMessage: "Feature images is must be an array of strings.",
    },
  },
};
