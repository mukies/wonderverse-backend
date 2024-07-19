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
  gender: {
    notEmpty: {
      errorMessage: "Gender is required.",
    },
    isString: {
      errorMessage: "Gender must be in string format",
    },
    isIn: {
      options: [["male", "female", "other"]],
      errorMessage: 'Only "male", "female" or "other" are valid gender.',
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
        if (value.length > 2)
          throw new Error("More than 2 photos are not allowed.");
        if (value.length < 2)
          throw new Error(
            "You have to submit front and back side of the photo."
          );
        value.every((item) => {
          if (typeof item !== "string")
            throw new Error("Image url must be in string format.");
          else return true;
        });
        return true;
      },
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
