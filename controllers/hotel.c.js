const { validationResult } = require("express-validator");
const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const hotelRegistrationModel = require("../models/hoteRegistration.m");
const { set, get } = require("../config/cache_setup");
const { paginate } = require("../helper/pagination");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");

exports.addHotel = async (req, res) => {
  const { tour, hotelDocuments, hotelDetails } = req.body;

  //validation
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }
  try {
    //hotel documents

    hotelDocuments.ownerCitizenshipPhoto = await Promise.all(
      hotelDocuments.ownerCitizenshipPhoto.map(async (photo) => {
        if (!photo.startsWith("http")) {
          //todo generate cloudinary link

          return await generateLink(photo);
        }
        return photo;
      })
    );

    if (!hotelDocuments.hotelRegistrationPhoto.startsWith("http")) {
      hotelDocuments.hotelRegistrationPhoto = await generateLink(
        hotelDocuments.hotelRegistrationPhoto
      );
    }

    if (!hotelDocuments.hotelPanNumberPhoto.startsWith("http")) {
      hotelDocuments.hotelPanNumberPhoto = await generateLink(
        hotelDocuments.hotelPanNumberPhoto
      );
    }

    //hotel details

    if (!hotelDetails.hotelMainImage.startsWith("http")) {
      hotelDetails.hotelMainImage = await generateLink(
        hotelDetails.hotelMainImage
      );
    }

    if (hotelDetails.featureImages) {
      hotelDetails.featureImages = await Promise.all(
        hotelDetails.featureImages.map(async (photo) => {
          if (!photo.startsWith("http")) {
            //todo generate cloudinary link
            return await generateLink(photo);
          }
          return photo;
        })
      );
    }

    const newHotel = new hotelRegistrationModel({
      hotelDocuments,
      tour,
      hotelDetails,
      requestedBy: req.partner,
    });

    await newHotel.save();

    res.status(201).json({
      success: true,
      message: "Hotel details sent for review.",
      newHotel,
    });
  } catch (error) {
    console.log("Error while adding hotel.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while adding hotel." });
  }
};

exports.editHotelDetails = async (req, res) => {
  const { hotelDocuments, tour, hotelDetails } = req.body;
  const { id } = req.params;
  //validation
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }
  try {
    const hotel = await hotelRegistrationModel.findById(id);

    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });

    if (hotel.requestedBy.toString() !== req.partner)
      return res.status(401).json({
        success: false,
        message: "Unable to update other's hotel details.",
      });

    //hotel documents

    hotelDocuments.ownerCitizenshipPhoto = await Promise.all(
      hotelDocuments.ownerCitizenshipPhoto.map(async (photo) => {
        if (!photo.startsWith("http")) {
          //todo generate cloudinary link

          return await generateLink(photo);
        }
        return photo;
      })
    );

    if (!hotelDocuments.hotelRegistrationPhoto.startsWith("http")) {
      hotelDocuments.hotelRegistrationPhoto = await generateLink(
        hotelDocuments.hotelRegistrationPhoto
      );
    }

    if (!hotelDocuments.hotelPanNumberPhoto.startsWith("http")) {
      hotelDocuments.hotelPanNumberPhoto = await generateLink(
        hotelDocuments.hotelPanNumberPhoto
      );
    }

    //hotel details

    if (!hotelDetails.hotelMainImage.startsWith("http")) {
      hotelDetails.hotelMainImage = await generateLink(
        hotelDetails.hotelMainImage
      );
    }

    if (hotelDetails.featureImages) {
      hotelDetails.featureImages = await Promise.all(
        hotelDetails.featureImages.map(async (photo) => {
          if (!photo.startsWith("http")) {
            //todo generate cloudinary link
            return await generateLink(photo);
          }
          return photo;
        })
      );
    }

    const updatedHotel = await hotelRegistrationModel.findByIdAndUpdate(
      id,
      {
        hotelDocuments,
        tour,
        hotelDetails,
        status: "pending",
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Hotel details sent for review.",
      updatedHotel,
    });
  } catch (error) {
    console.log("Error while updating hotel details.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while updating hotel details." });
  }
};

exports.fetch_All_Personal_Hotels = async (req, res) => {
  try {
    const hotels = await hotelRegistrationModel
      .find({
        requestedBy: req.partner,
      })
      .populate("tour", "placeName mainImage slug location avgRating");

    res.status(200).json({ success: true, hotels });
  } catch (error) {
    console.log("Error while fetching hotels.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching hotels." });
  }
};

exports.fetch_Single_Hotel_data = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await hotelRegistrationModel
      .findById(id)
      .populate("tour", "placeName mainImage slug location avgRating");

    res.status(200).json({ success: true, hotel });
  } catch (error) {
    console.log("Error while fetching hotel data.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching hotel data." });
  }
};

// exports.fetchHotelByTourId = async (req, res) => {
//   const { tourID } = req.params;
//   try {
//     const hotels = await hotelRegistrationModel.find({ tour: tourID });

//     res.status(200).json({ success: true, hotels });
//   } catch (error) {
//     console.log("Error while fetching hotels.", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error while fetching hotels." });
//   }
// };

exports.deleteHotel = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await hotelRegistrationModel.findById(id);

    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });

    console.log("reqby", hotel.requestedBy);
    console.log("req.partner", req.partner);

    if (hotel.requestedBy.toString() !== req.partner.toString())
      return res.status(401).json({
        success: false,
        message: "Unable to delete other's hotel.",
      });

    await hotelRegistrationModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Hotel deleted successfully." });
  } catch (error) {
    console.log("Error while deleting hotel.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while deleting hotel." });
  }
};

//admin action

exports.approveHotel = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await hotelRegistrationModel.findById(id);

    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });

    hotel.status = "approved";

    await hotel.save();

    res.json({ success: true, message: "Hotel has been approved." });
  } catch (error) {
    console.log("Error while approving hotel", error);
    res
      .status(500)
      .json({ success: false, message: "Error while approving hotel" });
  }
};

exports.rejectHotel = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await hotelRegistrationModel.findById(id);

    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });

    hotel.status = "rejected";

    await hotel.save();

    res.json({ success: true, message: "Hotel has been rejected." });
  } catch (error) {
    console.log("Error while rejecting hotel", error);
    res
      .status(500)
      .json({ success: false, message: "Error while rejecting hotel" });
  }
};

exports.allApprovedHotel = tryCatchWrapper(async (req, res) => {
  const { limit, page, skip } = paginate(req);

  let hotels = await get(`registeredHotel:${page}`);

  if (hotels) return res.json({ success: true, data: hotels });

  hotels = await hotelRegistrationModel
    .find({ status: "approved" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("requestedBy", "photo firstName lastName gender email");

  const totalItems = await hotelRegistrationModel.countDocuments({
    status: "approved",
  });
  const totalPages = Math.ceil(totalItems / limit);

  const data = {
    hotels,
    totalItems,
    totalPages,
    page,
  };

  await set(`registeredHotel:${page}`, data, 3600);
  res.json({ success: true, data });
});
