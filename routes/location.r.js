const { busPark, cities } = require("../helper/locations");

const router = require("express").Router();

router.get("/cities", (req, res) => {
  try {
    res.json({ success: true, cities });
  } catch (error) {
    console.log("Error while fetching cities", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching cities" });
  }
});

router.get("/bus-park", (req, res) => {
  try {
    res.json({ success: true, busPark });
  } catch (error) {
    console.log("Error while fetching bus park", error);
    res
      .status(500)
      .json({ success: false, message: "Error while fetching bus park" });
  }
});

module.exports = router;
