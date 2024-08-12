const { validationResult } = require("express-validator");
const { tryCatchWrapper } = require("../helper/tryCatchHandler");
const { generateLink } = require("../helper/cloudinaryImgLinkGenerator");
const packageModel = require("../models/tourPackage.m");
const { get, set } = require("../config/cache_setup");
const mongoose = require("mongoose");
const tourModel = require("../models/tour.m");
const { clearCacheByPrefix } = require("../helper/clearCache");
const placeModel = require("../models/packagePlace.m");
const slugify = require("slugify");
const { invalidObj } = require("../helper/objectIdHendler");
const { paginate } = require("../helper/pagination");

exports.addPackage = tryCatchWrapper(async (req, res) => {
  const {
    placeName,
    location,
    state,
    activity,
    description,
    included,
    places,
    discountPercent,
    price,
    packageDuration,
  } = req.body;
  let { featureImages, mainImage } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({
      success: false,
      message: result.array()[0].msg,
    });

  const isNameExist = await packageModel.findOne({
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
      .json({ success: false, message: "Package name already exist." });

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

  let newPackage = new packageModel({
    placeName,
    slug: slugify(placeName.toLowerCase(), "+"),
    mainImage,
    state,
    activity,
    description,
    location: location.toLowerCase(),
    featureImages,
    included,
    places,
    discountPercent,
    price,
    packageDuration,
  });

  await newPackage.save();

  await clearCacheByPrefix("package");

  res.json({ success: true, data: newPackage });
});

exports.updatePackage = tryCatchWrapper(async (req, res) => {
  const {
    placeName,
    location,
    state,
    activity,
    description,
    included,
    places,
    discountPercent,
    price,
    packageDuration,
  } = req.body;
  let { featureImages, mainImage } = req.body;
  const { packageID } = req.params;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({
      success: false,
      message: result.array()[0].msg,
    });

  if (!mongoose.Types.ObjectId.isValid())
    return res
      .status(401)
      .json({ success: false, message: "Invalid package id" });

  const isNameExist = await packageModel.findOne({
    placeName,
    _id: { $ne: packageID },
  });

  if (isNameExist)
    return res
      .status(403)
      .json({ success: false, message: "Package name already exist." });

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

  let updatedPackage = await packageModel.findByIdAndUpdate(
    packageID,
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
      places,
      discountPercent,
      price,
      packageDuration,
    },
    { new: true }
  );

  await clearCacheByPrefix("package");

  res.json({ success: true, data: updatedPackage });
});

exports.getSinglePackage = tryCatchWrapper(async (req, res) => {
  const { slug } = req.params;

  let packageDetails = await get(`package:${slug}`);

  if (packageDetails) return res.json({ success: true, packageDetails });

  const package = await packageModel
    .findOne({ slug })
    .populate("activity")
    .populate("places");

  if (!package)
    return res
      .status(404)
      .json({ success: false, message: "Package not found" });

  const suggestedTour = await tourModel
    .find({ activity: package.activity._id })
    .select("placeName slug mainImage")
    .limit(5);
  const suggestedPackage = await packageModel
    .find({ activity: package.activity._id, _id: { $ne: package._id } })
    .select("placeName slug mainImage")
    .limit(5);

  packageDetails = {
    package,
    suggestedTour,
    suggestedPackage,
  };

  await set(`package:${package.slug}`, packageDetails, 3600);
  res.json({ success: true, packageDetails });
});

exports.getAllPackage = tryCatchWrapper(async (req, res) => {
  const { limit, page, skip } = paginate(req);

  let packages = await get(`packages:${page}`);
  if (packages) return res.json({ success: true, data: packages });

  packages = await packageModel
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("activity")
    .populate("places");

  const totalItems = await packageModel.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);

  const data = {
    page,
    packages,
    totalPages,
  };

  await set(`packages:${page}`, data, 3600);
  res.json({ success: true, data });
});

exports.searchPackage = tryCatchWrapper(async (req, res) => {
  const {
    query,
    activity = "none",
    state = "none",
    pricing = "none",
  } = req.query;

  if (!query)
    return res
      .status(400)
      .json({ success: false, message: "Empty search query" });

  let result = await get(
    `package:search:${query}:${activity}:${state}:${pricing}`
  );
  if (result) return res.json({ success: true, result });

  result = await packageModel.aggregate([
    {
      $search: {
        index: "package_index",
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
    result = result.filter((package) => package.activity._id == activity);
  }

  if (state !== "none") {
    result = result.filter((package) => package.state == slugify(state, "+"));
  }

  if (pricing !== "none") {
    if (pricing == "high-to-low") {
      result = result.sort((x, y) => y.price - x.price);
    }
    if (pricing == "low-to-high") {
      result = result.sort((x, y) => x.price - y.price);
    }
  }

  // .populate("activity");
  await set(
    `package:search:${query}:${activity}:${state}:${pricing}`,
    result,
    3600
  );
  res.json({ success: true, result });
});

exports.deletePackage = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const package = await packageModel.findById(id);
  if (!package)
    return res
      .status(404)
      .json({ success: false, message: "Package not found" });
  await clearCacheByPrefix("package");
  await packageModel.findByIdAndDelete(id);
  res.json({ success: true, message: "Package has been deleted." });
});

exports.deleteMultiplePackage = tryCatchWrapper(async (req, res) => {
  const { idArray } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  idArray.forEach(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

    const package = await packageModel.findById(id);
    if (!package)
      return res
        .status(404)
        .json({ success: false, message: "Package place not found" });
    await packageModel.findByIdAndDelete(id);
  });
  await clearCacheByPrefix("package");
  res.json({ success: true, message: "Data deleted successfully." });
});

exports.packageToggleStatus = tryCatchWrapper(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  if (status !== "active" && status !== "deactive")
    return res
      .status(400)
      .json({ success: false, message: "Invalid status type" });

  const package = await packageModel.findById(id);

  if (!package)
    return res
      .status(404)
      .json({ success: false, message: "Package not found" });

  if (package.status == "active") {
    package.status = "deactive";
  } else {
    package.status = "active";
  }
  await package.save();
  res.json({ success: true, message: "Package status changed." });
});

//package places

exports.addPackagePlaces = tryCatchWrapper(async (req, res) => {
  const { price, name } = req.body;
  let { image } = req.body;

  const result = validationResult(req);
  if (!result.array())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  if (!image.startsWith("http")) {
    image = await generateLink(image);
  }

  const newPlace = new placeModel({
    price,
    name,
    image,
  });

  await newPlace.save();
  await clearCacheByPrefix("place");

  res.json({ success: true, message: "Package place created", newPlace });
});
exports.updatePackagePlace = tryCatchWrapper(async (req, res) => {
  const { price, name } = req.body;
  let { image } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const result = validationResult(req);
  if (!result.array())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  if (!image.startsWith("http")) {
    image = await generateLink(image);
  }

  const updated = await placeModel.findByIdAndUpdate(
    id,
    {
      price,
      name,
      image,
    },
    { new: true }
  );
  await clearCacheByPrefix("place");
  res.json({ success: true, message: "place has been updated", data: updated });
});
exports.getAllPlace = tryCatchWrapper(async (req, res) => {
  let data = await get("place");
  if (data) return res.json({ success: true, data });

  data = await placeModel.find();

  await set("place", data, 3600);
  res.json({ success: true, data });
});
exports.getOnePlace = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  let data = await get(`place:${id}`);
  if (data) return res.json({ success: true, data });

  data = await placeModel.findById(id);
  if (!data)
    return res
      .status(404)
      .json({ success: false, message: "Package place not found" });

  await set(`place:${id}`, data, 3600);

  res.json({ success: true, data });
});

exports.deletePlace = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  const place = await placeModel.findById(id);
  if (!place)
    return res
      .status(404)
      .json({ success: false, message: "Package place not found" });
  await placeModel.findByIdAndDelete(id);
  await clearCacheByPrefix("place");
  res.json({ success: true, message: "Package place has been deleted." });
});

exports.deleteMultiplePlace = tryCatchWrapper(async (req, res) => {
  const { idArray } = req.body;

  const result = validationResult(req);
  if (!result.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: result.array()[0].msg });

  idArray.forEach(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

    const place = await placeModel.findById(id);
    if (!place)
      return res
        .status(404)
        .json({ success: false, message: "Package place not found" });
    await placeModel.findByIdAndDelete(id);
  });
  await clearCacheByPrefix("place");
  res.json({ success: true, message: "Data deleted successfully." });
});

exports.placeToggleStatus = tryCatchWrapper(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return invalidObj(res);

  if (status !== "active" && status !== "deactive")
    return res
      .status(400)
      .json({ success: false, message: "Invalid status type" });

  const place = await placeModel.findById(id);

  if (!place)
    return res.status(404).json({ success: false, message: "Place not found" });

  if (place.status == "active") {
    place.status = "deactive";
  } else {
    place.status = "active";
  }
  await place.save();
  res.json({ success: true, message: "Place status changed." });
});
