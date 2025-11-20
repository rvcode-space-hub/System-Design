const profileRepository = require("../../repositories/profileRepository");
const serviceTypeRepository = require("../../repositories/serviceTypeRepository");

class CommissionService {
  async calculateCommission({ userId, productProfileId, serviceTypeId, amount }) {
    try {
      console.log("Commission Input:", {
        userId,
        productProfileId,
        serviceTypeId,
        amount
      });

      // Validate inputs
      if (!userId || !productProfileId || !serviceTypeId || !amount) {
        throw new Error(
          `Missing Values → userId:${userId}, productProfileId:${productProfileId}, serviceTypeId:${serviceTypeId}, amount:${amount}`
        );
      }

      // Fetch PRODUCT PROFILE (not user-based)
      const profile = await profileRepository.findProfileById(productProfileId);

      if (!profile) {
        return {
          commission: 0,
          type: "NONE",
          remark: "NO_PROFILE_FOUND"
        };
      }

      // Fetch SERVICE TYPE configuration
      const serviceType = await serviceTypeRepository.getById(serviceTypeId);

      if (!serviceType) {
        return {
          commission: 0,
          type: "NONE",
          remark: "NO_SERVICE_TYPE_FOUND"
        };
      }

      const {
        commission_type,
        commission_rate,
        min_commission,
        max_commission
      } = serviceType;

      let commission = 0;

      // Commission Logic
      if (commission_type === "PERCENTAGE") {
        commission = (amount * commission_rate) / 100;

        if (min_commission && commission < min_commission) {
          commission = min_commission;
        }

        if (max_commission && commission > max_commission) {
          commission = max_commission;
        }
      }

      if (commission_type === "FLAT") {
        commission = commission_rate || 0;
      }

      // Never allow negative commission
      if (commission < 0) commission = 0;

      return {
        commission,
        type: commission_type || "NONE",
        remark: "SUCCESS",
        service_type_id: serviceTypeId,
        product_profile_id: productProfileId
      };

    } catch (error) {
      console.error("CommissionService Error:", error);
      throw new Error("COMMISSION_CALCULATION_FAILED");
    }
  }
}

module.exports = new CommissionService();
