exports.bookingSchema = {
  selectedGuide: {
    isOptional: true,
    isString: {
      errorMessage: "Selected Guide ID must be in string format.",
    },
  },
  selectedHotel: {
    notEmpty: {
      errorMessage: "Selected Hotel is required.",
    },
    isObject: {
      errorMessage: "Selected Hotel must be in object format.",
    },
  },
  "selectedHotel.hotelID": {
    notEmpty: {
      errorMessage: "Hotel ID property of Selected Hotel is required.",
    },
    isString: {
      errorMessage:
        "Hotel ID property of Selected Hotel must be in string format.",
    },
  },
  "selectedHotel.numberOfPeople": {
    notEmpty: {
      errorMessage: "numberOfPeople property of Selected Hotel is required.",
    },
    isNumeric: {
      errorMessage:
        "numberOfPeople property of Selected Hotel must be in numeric format.",
    },
  },
  "selectedHotel.stayingDays": {
    notEmpty: {
      errorMessage: "stayingDays property of Selected Hotel is required.",
    },
    isNumeric: {
      errorMessage:
        "stayingDays property of Selected Hotel must be in numeric format.",
    },
  },
  "selectedHotel.totalHotelCost": {
    notEmpty: {
      errorMessage: "totalHotelCost property of Selected Hotel is required.",
    },
    isNumeric: {
      errorMessage:
        "totalHotelCost property of Selected Hotel must be in numeric format.",
    },
  },

  selectedTransportation: {
    notEmpty: {
      errorMessage: "Selected Transportation is required.",
    },
    isObject: {
      errorMessage: "Selected Transportation must be in object format.",
    },
  },

  "selectedTransportation.transportationID": {
    notEmpty: {
      errorMessage:
        "Transportation ID property in Selected Transportation object is required.",
    },
    isString: {
      errorMessage: "Transportation ID must be in string format.",
    },
  },
  "selectedTransportation.numberOfPeople": {
    notEmpty: {
      errorMessage:
        "NumberOfPeople property in Selected Transportation object is required.",
    },
    isNumeric: {
      errorMessage:
        "numberOfPeople property of Selected Transportation must be in numeric format.",
    },
  },

  "selectedTransportation.totalCost": {
    notEmpty: {
      errorMessage:
        "totalCost property of Selected Transportation is required.",
    },
    isNumeric: {
      errorMessage:
        "totalCost property of Selected Transportation must be in numeric format.",
    },
  },

  tourStartingDate: {
    notEmpty: {
      errorMessage: "Tour starting date is required.",
    },
    isString: {
      errorMessage: "Tour starting date must be in string format.",
    },
  },

  participants: {
    notEmpty: {
      errorMessage: "Participants is required.",
    },
    isNumeric: {
      errorMessage: "Participants must be in numeric format.",
    },
  },

  totalTourCost: {
    notEmpty: {
      errorMessage: "Total tour cost is required.",
    },
    isNumeric: {
      errorMessage: "Total tour cost must be in numeric format.",
    },
  },

  userDetails: {
    notEmpty: {
      errorMessage: "User details is required.",
    },
    isArray: {
      errorMessage: "User details must be an array",
    },
  },

  "userDetails.*.fullName": {
    notEmpty: {
      errorMessage: "Full name in user details array is required.",
    },
    isString: {
      errorMessage: "Full name in user details array must be in string format.",
    },
  },
  "userDetails.*.email": {
    notEmpty: {
      errorMessage: "Email in user details array is required.",
    },
    isEmail: {
      errorMessage: "Invalid email format.",
    },
  },
  "userDetails.*.contactNumber": {
    notEmpty: {
      errorMessage: "Contact number in user details array is required.",
    },
    isString: {
      errorMessage:
        "Contact number in user details array must be in string format.",
    },
  },
  "userDetails.*.country": {
    notEmpty: {
      errorMessage: "Country in user details array is required.",
    },
    isString: {
      errorMessage: "Country in user details array must be in string format.",
    },
  },
  "userDetails.*.passportNumber": {
    optional: true,
    isString: {
      errorMessage:
        "Passport number in user details array must be in string format.",
    },
  },
};
