exports.userRegisterSchema = {
  photo: {
    optional: true,
    isString: {
      errorMessage: "Photo must be in string format",
    },
  },
  country: {
    notEmpty: {
      errorMessage: "Country is required.",
    },
    isString: {
      errorMessage: "Country must be in string format",
    },
  },
  firstName: {
    notEmpty: {
      errorMessage: "First Name is required.",
    },
    isString: {
      errorMessage: "First Name must be in string format",
    },
    isLength: {
      options: { min: 2 },
      errorMessage: "First Name must be at least 2 characters long",
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
  lastName: {
    notEmpty: {
      errorMessage: "Last Name is required.",
    },
    isString: {
      errorMessage: "Last Name must be in string format",
    },
    isLength: {
      options: { min: 2 },
      errorMessage: "Last Name must be at least 2 characters long",
    },
  },
  email: {
    notEmpty: {
      errorMessage: "Email is required.",
    },
    isEmail: {
      errorMessage: "Invalid email format. Please provide valid email.",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required.",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    matches: {
      options:
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/,
      errorMessage:
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    },
  },
};

exports.adminRegisterSchema = {
  fullName: {
    notEmpty: {
      errorMessage: "First Name is required.",
    },
    isString: {
      errorMessage: "First Name must be in string format",
    },
    isLength: {
      options: { min: 2 },
      errorMessage: "First Name must be at least 2 characters long",
    },
  },

  email: {
    notEmpty: {
      errorMessage: "Email is required.",
    },
    isEmail: {
      errorMessage: "Invalid email format. Please provide valid email.",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required.",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    matches: {
      options:
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/,
      errorMessage:
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    },
  },
};

exports.loginSchema = {
  email: {
    notEmpty: {
      errorMessage: "Email is required.",
    },
    isEmail: {
      errorMessage: "Invalid email format. Please provide valid email.",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required.",
    },
  },
};

exports.partnerRegisterSchema = {
  photo: {
    notEmpty: {
      errorMessage: "Photo is required.",
    },
    isString: {
      errorMessage: "Photo must be in string format",
    },
  },

  firstName: {
    notEmpty: {
      errorMessage: "First Name is required.",
    },
    isString: {
      errorMessage: "First Name must be in string format",
    },
    isLength: {
      options: { min: 2 },
      errorMessage: "First Name must be at least 2 characters long",
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
  lastName: {
    notEmpty: {
      errorMessage: "Last Name is required.",
    },
    isString: {
      errorMessage: "Last Name must be in string format",
    },
    isLength: {
      options: { min: 2 },
      errorMessage: "Last Name must be at least 2 characters long",
    },
  },
  email: {
    notEmpty: {
      errorMessage: "Email is required.",
    },
    isEmail: {
      errorMessage: "Invalid email format. Please provide valid email.",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required.",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    matches: {
      options:
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/,
      errorMessage:
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    },
  },
};
