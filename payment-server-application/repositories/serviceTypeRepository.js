const db = require('../config/DB')
const its_service_types = db.models.its_service_types
const { Op } = require("sequelize");

class ServiceTypeRepository {
  
  // Get service type by ID
  async getById(serviceTypeId) {
    return await its_service_types.findOne({
      where: { service_type_id: serviceTypeId }
    });
  }

  // Get by service code (e.g., P2P_TRANSFER, RECHARGE)
  async getByCode(code) {
    return await its_service_types.findOne({
      where: { service_code: code }
    });
  }

  //  Get active services
  async getActiveServices() {
    return await its_service_types.findAll({
      where: { is_active: true }
    });
  }

  //  Get services by category (example: WALLET, BANK, UPI)
  async getByCategory(category) {
    return await its_service_types.findAll({
      where: { category }
    });
  }

  //  Flexible Query (used by rule engine)
  async search(filters = {}) {
    return await its_service_types.findAll({
      where: { ...filters }
    });
  }

  // 🟡 ADMIN: Create new service type
  async create(data) {
    return await its_service_types.create(data);
  }

  // 🟡 ADMIN: Update service type
  async update(serviceTypeId, updates) {
    return await its_service_types.update(updates, {
      where: { service_type_id: serviceTypeId }
    });
  }

  //  Check if service code exists & active
  async isServiceActive(code) {
    const svc = await this.getByCode(code);
    return svc && svc.is_active;
  }
}

module.exports = new ServiceTypeRepository();
