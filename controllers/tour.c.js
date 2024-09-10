const tourModel = require("../models/tour.m");
const slugify = require("slugify");
const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const activityModel = require("../models/activity.m");
const { validationResult } = require("express-validator");
const hotelRegistrationModel = require("../models/hoteRegistration.m");
const guideRegistrationModel = require("../models/guideRegistration.m");
const { get, set, del } = require("../config/cache_setup");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const packageModel = require("../models/tourPackage.m");
const { default: mongoose } = require("mongoose");
const { invalidObj } = require("../helper/objectIdHendler");
const { clearCacheByPrefix } = require("../helper/clearCache");
const userModel = require("../models/user.m");
const { paginate } = require("../helper/pagination");
// const transportationModel = require("../models/transportation.m");

exports.createTour = async (req, res) => {
  const { placeName, state, activity, description, location, included } =
    req.body;
  let { featureImages, mainImage } = req.body;
  try {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).json({
        success: false,
        message: result.array()[0].msg,
      });

    const isNameExist = await tourModel.findOne({
      $or: [
        {
          slug: slugify(placeName.toLowerCase(), "+"),
        },
        {
          placeName,
        },
      ],
    });

    if (isNameExist)
      return res
        .status(403)
        .json({ success: false, message: "Tour name already exist." });

    if (!mainImage.startsWith("http")) {
      mainImage = await generateLink(mainImage);
    }

    featureImages = await Promise.all(
      featureImages.map(async (img) => {
        if (!img.startsWith("http")) {
          return await generateLink(img);
        }
        return img;
      })
    );

    let newTour = new tourModel({
      placeName,
      slug: slugify(placeName.toLowerCase(), "+"),
      mainImage,
      state,
      activity,
      description,
      location: location.toLowerCase(),
      featureImages,
      included,
    });
    await newTour.save();

    newTour = await newTour.populate("activity", "title");

    await clearCacheByPrefix("tour");

    res.status(201).json({ success: true, message: "tour created", newTour });
  } catch (error) {
    console.log("Error while creating the tour.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while creating tour." });
  }
};

exports.allTours = async (req, res) => {
  const { limit, page, skip } = paginate(req);

  try {
    let tours = await get(`tours:page${page}`);
    if (tours) {
      return res.json({
        success: true,
        data: tours,
      });
    }
    tours = await tourModel
      .find()
      .populate("activity")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalItems = await tourModel.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const tourData = {
      totalPages,
      tours,
      totalItems,
      page,
    };
    await set(`tours:page${page}`, tourData, 3600);

    res.status(200).json({
      success: true,
      data: tourData,
    });
  } catch (error) {
    console.log("Error while fetching all tour");
    res
      .status(500)
      .json({ success: false, message: "Error while fetching all tour." });
  }
};

exports.allToursNames = async (req, res) => {
  // const { page } = req.query;
  try {
    const tours = await tourModel.find().select("placeName");

    res.status(200).json({ success: true, tours });
  } catch (error) {
    console.log("Error while fetching all tour");
    res
      .status(500)
      .json({ success: false, message: "Error while fetching all tour." });
  }
};

exports.getToursByState = async (req, res) => {
  const { state } = req.params;

  try {
    const tours = await tourModel
      .find({ state })
      .populate("activity")
      .limit(10);
    res.status(200).json({ success: true, tours });
  } catch (error) {
    console.log("Error while fetching tours data.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching tours data." });
  }
};
exports.getToursByActivity = async (req, res) => {
  const { slug } = req.params;

  try {
    const activity = await activityModel.findOne({ slug });

    if (!activity)
      return res
        .status(404)
        .json({ success: false, message: "Activity not found." });

    let tours = await get(`tours_activity_${activity._id}`);

    if (!tours) {
      tours = await tourModel
        .find({ activity: activity._id })
        .populate("activity")
        .limit(10);

      await set(`tours_activity_${activity._id}`, tours, 3600);
    }
    res.status(200).json({ success: true, tours });
  } catch (error) {
    console.log("Error while fetching tours data.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching tours data." });
  }
};

//all
exports.getAllToursByState = tryCatchWrapper(async (req, res) => {
  const { state } = req.params;

  const tours = await tourModel.find({ state }).populate("activity");

  res.status(200).json({ success: true, tours });
});

exports.getAllToursByActivity = tryCatchWrapper(async (req, res) => {
  const { slug } = req.params;

  const activity = await activityModel.findOne({ slug });

  if (!activity)
    return res
      .status(404)
      .json({ success: false, message: "Activity not found." });

  let tours = await get(`tours_activity_${activity._id}`);

  if (!tours) {
    tours = await tourModel
      .find({ activity: activity._id })
      .populate("activity");

    await set(`tours_activity_${activity._id}`, tours, 3600);
  }
  res.json({ success: true, tours });
});

exports.singleTour = async (req, res) => {
  try {
    const { slug } = req.params;

    // const availableTransportations = await transportationModel.find({ tourID });
    let tourDetails = await get(`tour:${slug}`);
    if (tourDetails) return res.json({ success: true, tourDetails });

    let tour = await tourModel
      .findOne({ slug })
      .populate("activity")
      .populate("reviews.userID", "firstName lastName photo country");

    if (!tour) {
      tour = await tourModel
        .findOne({ _id: slug })
        .populate("activity")
        .populate("reviews.userID", "firstName lastName photo country");
    }

    if (!tour)
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });

    let guides = await guideRegistrationModel
      .find({
        guidingDestinations: tour._id,
        status: "approved",
      })
      .select("guideName guidePhoto gender guideEmail contactNumber plans")
      .populate("plans");

    guides = guides.map(
      (guide) =>
        (guide.plans = guide.plans.filter(
          (plan) => plan.tour.toString() == tour._id.toString()
        ))
    );

    const hotels = await hotelRegistrationModel
      .find({ tour: tour._id })
      .select("-hotelDocuments");

    const suggestedTour = await tourModel
      .find({ activity: tour.activity._id, _id: { $ne: tour._id } })
      .select("placeName slug mainImage")
      .limit(5);
    const suggestedPackage = await packageModel
      .find({ activity: tour.activity._id })
      .select("placeName slug mainImage")
      .limit(5);

    tourDetails = {
      tour,
      guides,
      hotels,
      suggestedTour,
      suggestedPackage,
    };
    await set(`tour:${slug}`, tourDetails, 3600);
    res.status(200).json({ success: true, tourDetails });
  } catch (error) {
    console.log("Error while getting tour details.", error);
    res
      .status(500)
      .json({ message: "Error while getting tour details.", success: false });
  }
};

exports.editTour = async (req, res) => {
  const { placeName, state, activity, description, location, included } =
    req.body;
  let { featureImages, mainImage } = req.body;

  const { tourID } = req.params;

  try {
    //TODO: Validation check for all fields
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).json({
        success: false,
        message: result.array(),
      });

    const isNameExist = await tourModel.findOne({
      slug: slugify(placeName.toLowerCase(), "+"),
      _id: { $ne: tourID },
    });

    if (isNameExist)
      return res
        .status(403)
        .json({ success: false, message: "Tour name already exist." });

    //use cloudinary
    featureImages = await Promise.all(
      featureImages.map(async (item) => {
        if (!item.startsWith("http")) {
          return await generateLink(item);
        }
        return item;
      })
    );

    //convert main image links into cloudinary links
    if (!mainImage.startsWith("http")) {
      mainImage = await generateLink(mainImage);
    }

    const tourUpdate = await tourModel.findByIdAndUpdate(
      tourID,
      {
        placeName,
        slug: slugify(placeName.toLowerCase(), "+"),
        mainImage,
        state,
        activity,
        description,
        location: location.toLowerCase(),
        featureImages,
        included,
      },
      { new: true }
    );
    await clearCacheByPrefix("tour");
    res
      .status(200)
      .json({ success: true, message: "Tour has been updated", tourUpdate });
  } catch (error) {
    console.log("Error while creating the tour.", error);
    res
      .status(500)
      .json({ success: false, message: "Error while creating tour." });
  }
};

exports.deleteTour = tryCatchWrapper(async (req, res) => {
  const { tourID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tourID)) return invalidObj(res);
  const tour = await tourModel.findById(tourID);
  if (!tour)
    return res.status(404).json({ success: false, message: "Tour not found" });

  await tourModel.findByIdAndDelete(tourID);

  await clearCacheByPrefix("tour");

  res
    .status(200)
    .json({ success: true, message: "Tour deleted successfully." });
});

exports.featuredTrips = async (req, res) => {
  try {
    const trips = await tourModel
      .find()
      .sort({ avgRating: -1 })
      .populate("activity");

    res.status(200).json({ success: true, trips });
  } catch (error) {
    console.log("Error while fetching featured trip");
    res
      .status(500)
      .json({ success: false, message: "Error while fetching featured trip." });
  }
};
exports.homePageFeaturedTrips = async (req, res) => {
  try {
    const trips = await tourModel
      .find()
      .sort({ avgRating: -1 })
      .limit(8)
      .populate("activity");

    res.status(200).json({ success: true, trips });
  } catch (error) {
    console.log("Error while fetching featured trip");
    res
      .status(500)
      .json({ success: false, message: "Error while fetching featured trip." });
  }
};

exports.searchTour = async (req, res) => {
  const { query, activity = "none", state = "none" } = req.query;
  try {
    if (!query)
      return res
        .status(400)
        .json({ success: false, message: "Empty search query" });

    let result = await get(`tour:search:${query}:${activity}:${state}`);
    if (result) return res.json({ success: true, result });

    result = await tourModel.aggregate([
      {
        $search: {
          index: "Tour_Index",
          compound: {
            should: [
              {
                autocomplete: {
                  query: query,
                  path: "placeName",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                  },
                },
              },
              {
                autocomplete: {
                  query: query,
                  path: "location",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                  },
                },
              },
              {
                autocomplete: {
                  query: query,
                  path: "state",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                  },
                },
              },
              {
                autocomplete: {
                  query: query,
                  path: "slug",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                  },
                },
              },
            ],
          },
        },
      },
      {
        $addFields: {
          score: { $meta: "searchScore" },
        },
      },
      {
        $sort: { score: -1, avgRating: -1 },
      },
      {
        $lookup: {
          from: "activities",
          localField: "activity",
          foreignField: "_id",
          as: "activity",
        },
      },
      {
        $unwind: {
          path: "$activity",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (activity !== "none") {
      result = result.filter((tour) => tour.activity._id == activity);
    }

    if (state !== "none") {
      result = result.filter((tour) => tour.state == slugify(state, "+"));
    }

    // .populate("activity");
    await set(`tour:search:${query}:${activity}:${state}`, result, 3600);
    res.json({ success: true, result });
  } catch (error) {
    console.log("Error while searching the tour", error);
    res
      .status(500)
      .json({ success: false, message: "Error while searching the tour" });
  }
};

exports.addToFavourite = tryCatchWrapper(async (req, res) => {
  const { tourID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tourID)) return invalidObj(res);
  const user = await userModel.findById(req.user);

  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const tour = await tourModel.findById(tourID);

  if (!tour)
    return res.status.json({ success: false, message: "Tour not found" });

  user.favourite.push(tourID);
  await user.save();
  res.json({ success: true, message: "Tour added to favourite", data: tour });
});

exports.deleteMultiTour = tryCatchWrapper(async (req, res) => {
  const { idArray } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  idArray.forEach(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

    const tour = await tourModel.findById(id);
    if (!tour)
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    await tourModel.findByIdAndDelete(id);
  });
  await clearCacheByPrefix("tour");
  res.json({ success: true, message: "Tours deleted successfully." });
});

exports.tourToggleStatus = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const tour = await tourModel.findById(id);

  if (!tour)
    return res.status(404).json({ success: false, message: "Tour not found" });

  if (tour.status == "active") {
    tour.status = "inactive";
  } else {
    tour.status = "active";
  }
  await clearCacheByPrefix("tour");
  await tour.save();
  res.json({ success: true, message: "Tour status changed." });
});
