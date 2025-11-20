const db = require('../config/DB');
const its_product_profiles = db.models.its_product_profiles;
const its_service_types = db.models.its_service_types;   // <-- ADD THIS
const { Op } = require("sequelize");

class ProfileRepository {
  async findProfileById(profileId) {
    try {
      return await its_product_profiles.findOne({
        where: { product_profile_id: profileId },
      });
    } catch (error) {
      throw new Error('DB Error: Unable to fetch product profile → ' + error.message);
    }
  }

  async getAllProfiles() {
    try {
      return await its_product_profiles.findAll();
    } catch (error) {
      throw new Error('DB Error: Unable to fetch all product profiles → ' + error.message);
    }
  }

  async isP2PSupported(profileId) {
    try {
      const profile = await its_product_profiles.findOne({
        where: { product_profile_id: profileId },
        attributes: ['is_p2p_enable'],
      });
      return profile ? profile.is_p2p_enable === true : false;
    } catch (error) {
      throw new Error('DB Error: Unable to check P2P support → ' + error.message);
    }
  }

  async getProfileConfig(profileId) {
    try {
      return await its_product_profiles.findOne({
        where: { product_profile_id: profileId },
        attributes: [
          'min_amount',
          'max_amount',
          'daily_limit',
          'monthly_limit',
          'charge_percent',
          'commission_percent',
          'service_type_id',   // <-- Important (mapping)
        ],
      });
    } catch (error) {
      throw new Error('DB Error: Unable to fetch profile config → ' + error.message);
    }
  }
  async getServiceTypeRule(service_type_code, channel) {
    try {
      return await its_service_types.findOne({
        where: {
          service_code: service_type_code,   // maps to P2P_TRANSFER
          channel: channel,                  // WALLET
          is_active: true
        }
      });
    } catch (error) {
      throw new Error('DB Error: Unable to fetch service type rule → ' + error.message);
    }
  }

  // OLD getProfileRule kept for backward compatibility (optional)
  async getProfileRule(service_type, channel) {
    return this.getServiceTypeRule(service_type, channel);
  }


  async createProfile(data) {
    try {
      return await its_product_profiles.create(data);
    } catch (error) {
      throw new Error('DB Error: Unable to create profile → ' + error.message);
    }
  }

  async updateProfile(profileId, updates) {
    try {
      await its_product_profiles.update(updates, {
        where: { product_profile_id: profileId },
      });
      return await this.findProfileById(profileId);
    } catch (error) {
      throw new Error('DB Error: Unable to update profile → ' + error.message);
    }
  }
}

module.exports = new ProfileRepository();
