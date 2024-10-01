const axios = require("axios");
const crypto = require("crypto");

// Function to verify Khalti Payment
exports.verifyKhaltiPayment = async (pidx) => {
  console.log("pidx", pidx);
  const headersList = {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify({ pidx });

  const reqOptions = {
    url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  try {
    const response = await axios.request(reqOptions);
    console.log("res-data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error verifying Khalti payment:", error);
    throw error;
  }
};

// Function to initialize Khalti Payment
exports.initializeKhaltiPayment = async () => {
  const headersList = {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  //   const bodyContent = JSON.stringify(details);
  let bodyContent = {
    amount: 1000 * 100,
    purchase_order_id: crypto.randomUUID(),
    purchase_order_name: "this-is-name",
    return_url: `${process.env.FRONTEND_URL}/add-tour`,
    // return_url: `${process.env.FRONTEND_URL}/slider/`,
    website_url: `${process.env.FRONTEND_URL}`,
  };

  bodyContent = JSON.stringify(bodyContent);
  console.log("body-con", bodyContent);
  const reqOptions = {
    url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  try {
    const response = await axios.request(reqOptions);
    console.log("res-data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error initializing Khalti payment:", error);
    throw error;
  }
};
