const profileRepository = require("../../repositories/profileRepository");
const ApiError = require("../../core/errors/ApiError");

class ChargeService {
  async calculateCharges({ amount, service_type, channel }) {
    if (!amount || amount <= 0) {
      throw new ApiError(400, "Invalid transaction amount");
    }

    const rule = await profileRepository.getProfileRule(service_type, channel);

    if (!rule) {
      throw new ApiError(404, "Service charge rule not found");
    }

    let serviceCharge = 0;

    switch (rule.charge_type) {
      case "PERCENTAGE":
        serviceCharge = this.percentageCharge(amount, rule);
        break;

      case "FIXED":
        serviceCharge = this.fixedCharge(rule);
        break;

      case "SLAB":
        serviceCharge = this.slabCharge(amount, rule.slabs || []);
        break;

      default:
        throw new ApiError(400, "Invalid charge type");
    }

    const gstAmount = rule.gst_enabled
      ? this.calculateGST(serviceCharge, Number(rule.gst_percentage || 18))
      : 0;

    return {
      serviceCharge,
      gst: gstAmount,
      totalFee: serviceCharge + gstAmount
    };
  }

  percentageCharge(amount, rule) {
    let percent = Number(rule.percentage || 0);
    let charge = (amount * percent) / 100;

    const max = Number(rule.max_charge || 0);
    const min = Number(rule.min_charge || 0);

    if (max > 0 && charge > max) charge = max;
    if (min > 0 && charge < min) charge = min;

    return charge;
  }

  fixedCharge(rule) {
    return Number(rule.fixed_amount || 0);
  }

  slabCharge(amount, slabs) {
    const slab = slabs.find(
      (s) => amount >= Number(s.min_amount) && amount <= Number(s.max_amount)
    );

    if (!slab) {
      throw new ApiError(400, "No matching charge slab found");
    }

    if (slab.type === "FIXED") {
      return Number(slab.value);
    }

    if (slab.type === "PERCENTAGE") {
      return (amount * Number(slab.value)) / 100;
    }

    throw new ApiError(400, "Invalid slab type");
  }

  calculateGST(amount, gstPercent) {
    return (amount * gstPercent) / 100;
  }
}

module.exports = new ChargeService();
