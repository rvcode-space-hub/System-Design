const p2pService = require("../services/transactions/p2pService");
const { response, errorResponse } = require("../core/utils/response");

exports.sendMoney = async (req, res, next) => {
  try {
    const {
      sender_wallet_id,
      receiver_wallet_id,
      amount,
      product_profile_id,
      service_type_id,
      meta
    } = req.body;

    const user_id = req.user?.user_id; // from authenticate middleware

    // Basic validation
    if (!sender_wallet_id || !receiver_wallet_id || !amount) {
      return errorResponse(res, "Missing required fields", 400);
    }

    if (!product_profile_id || !service_type_id) {
      return errorResponse(res, "product_profile_id and service_type_id are required", 400);
    }

    // Call Service Layer
    const result = await p2pService.sendMoney({
      sender_wallet_id,
      receiver_wallet_id,
      amount,
      user_id,
      product_profile_id,
      service_type_id,
      meta: meta || {}
    });

    return response(res, result, "Transaction successful");

  } catch (err) {
    console.error("Controller Error:", err.message);
    next(err); // Pass to global error handler
  }
};
