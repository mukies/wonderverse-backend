exports.passportSchema = {
  passportNumber: {
    notEmpty: {
      errorMessage: "Passport number is required.",
    },
    isString: {
      errorMessage: "Passport number must be a string",
    },
  },
  passportExpiryDate: {
    notEmpty: {
      errorMessage: "Passport expiry date is required.",
    },
    isDate: {
      errorMessage: "Passport expiry date must be in date format",
    },
  },
  arrivalDate: {
    notEmpty: {
      errorMessage: "Arrival date is required.",
    },
    isDate: {
      errorMessage: "Arrival date must be in date format",
    },
  },
  departureDate: {
    notEmpty: {
      errorMessage: "Departure date is required.",
    },
    isDate: {
      errorMessage: "Departure date must be in date format",
    },
  },
};

exports.userDetailSchema = {
  firstName: {
    notEmpty: {
      errorMessage: "First Name is required.",
    },
    isString: {
      errorMessage: "First Name must be a string",
    },
  },
  lastName: {
    notEmpty: {
      errorMessage: "Last Name is required.",
    },
    isString: {
      errorMessage: "Last Name must be a string",
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
  country: {
    notEmpty: {
      errorMessage: "Country is required.",
    },
    isString: {
      errorMessage: "Country must be a string",
    },
  },
};

exports.passwordSchema = {
  oldPassword: {
    notEmpty: {
      errorMessage: "Old password is required.",
    },
  },
  newPassword: {
    notEmpty: {
      errorMessage: "New Password is required.",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "New Password must be at least 8 characters long",
    },
    matches: {
      options:
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/,
      errorMessage:
        "New Password must contain at least one lowercase, uppercase, number, and special character",
    },
  },
};

exports.resetPasswordSchema = {
  newPassword: {
    notEmpty: {
      errorMessage: "New Password is required.",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "New Password must be at least 8 characters long",
    },
    matches: {
      options:
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/,
      errorMessage:
        "New Password must contain at least one lowercase, uppercase, number, and special character",
    },
  },
};
