const axios = require("axios");
const crypto = require("crypto");

exports.getEsewaPaymentHash = async (amount, transaction_uuid) => {
  try {
    const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_MERCHANT_CODE}`;

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");

    return {
      signature: hash,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };
  } catch (error) {
    throw error;
  }
};

exports.verifyEsewaPayment = async (encodedData) => {
  try {
    //decoding base64 code revieved from esewa
    let decodedData = atob(encodedData);
    decodedData = await JSON.parse(decodedData);

    const data = `total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_MERCHANT_CODE}`;

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");

    let headersList = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    let reqOptions = {
      url: `${
        process.env.ESEWA_VERIFY_URL
      }/api/epay/transaction/status/?product_code=${
        process.env.ESEWA_MERCHANT_CODE
      }&total_amount=${decodedData.total_amount.replace(
        /,/g,
        ""
      )}&transaction_uuid=${decodedData.transaction_uuid}`,
      method: "GET",
      headers: headersList,
    };
    let response = await axios.request(reqOptions);
    // console.log("first", response.data);
    // if (hash !== decodedData.signature) {
    //   throw { message: "Invalid Info", decodedData };
    // }

    return { response: response.data, decodedData };
  } catch (error) {
    throw error;
  }
};
