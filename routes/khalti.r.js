const { default: axios } = require("axios");

const router = require("express").Router();

// router.post("/complete-khalti-payment", async (req, res) => {
//   console.log("queries", req.query);

//   res.json({
//     success: true,
//     message: "Payment Successful",
//     data: req.query,
//   });
// });

router.get("/complete-khalti-payment", async (req, res) => {
  try {
    console.log("Received payment data:", req.query);

    // Extract necessary information from the query parameters
    const { pidx } = req.query;

    if (!pidx) {
      throw new Error("Payment IDX not provided");
    }

    // Verify the payment with Khalti
    const verificationResponse = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      {
        pidx: pidx,
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Verification response:", verificationResponse.data);

    // Check the status of the payment
    if (verificationResponse.data.status === "Completed") {
      // Payment is successful
      // Update your database here to mark the payment as successful

      res.json({
        success: true,
        message: "Payment Verified Successfully",
        data: verificationResponse.data,
      });
    } else {
      // Payment is not completed
      throw new Error(
        `Payment verification failed. Status: ${verificationResponse.data.status}`
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(400).json({
      success: false,
      message: "Payment Verification Failed",
      error: error.message,
    });
  }
});

module.exports = router;
