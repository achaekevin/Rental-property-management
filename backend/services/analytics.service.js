const { Op } = require('sequelize');
const {
  User, Organization, Property, Unit, Tenant, Landlord,
  Lease, Invoice, Payment, Expense, Maintenance
} = require('../models');

class AnalyticsService {
  async getDashboardStats(user) {
    const role = user.role || 'TENANT';

    switch (role) {
      case 'SUPER_ADMINISTRATOR':
        return await this.getSuperAdminDashboard();
      case 'PROPERTY_MANAGER':
        return await this.getPropertyManagerDashboard(user.organizationId);
      case 'LANDLORD':
        return await this.getLandlordDashboard(user.id);
      case 'TENANT':
        return await this.getTenantDashboard(user.id);
      default:
        return await this.getTenantDashboard(user.id);
    }
  }

  async getSuperAdminDashboard() {
    const totalOrganizations = await Organization.count();
    const totalPropertyManagers = await User.count({ where: { role: 'PROPERTY_MANAGER' } });
    const totalLandlords = await User.count({ where: { role: 'LANDLORD' } });
    const totalTenants = await User.count({ where: { role: 'TENANT' } });
    const totalProperties = await Property.count();
    const totalUnits = await Unit.count();
    const occupiedUnits = await Unit.count({ where: { status: 'OCCUPIED' } });
    const vacantUnits = await Unit.count({ where: { status: 'AVAILABLE' } });

    const rentCollectedSum = await Payment.sum('amount', { where: { status: 'SUCCESS' } }) || 0;
    const outstandingRentSum = await Invoice.sum('balance', { where: { status: { [Op.in]: ['UNPAID', 'PARTIALLY_PAID', 'OVERDUE'] } } }) || 0;

    const recentRegistrations = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    const recentPayments = await Payment.findAll({
      attributes: ['id', 'amount', 'paymentMethod', 'status', 'paidAt'],
      order: [['paidAt', 'DESC']],
      limit: 5
    });

    return {
      role: 'SUPER_ADMINISTRATOR',
      metrics: {
        totalOrganizations,
        totalPropertyManagers,
        totalLandlords,
        totalTenants,
        totalProperties,
        totalUnits,
        occupiedUnits,
        vacantUnits,
        totalRentCollected: parseFloat(rentCollectedSum),
        outstandingRent: parseFloat(outstandingRentSum),
        systemHealth: 'OPERATIONAL'
      },
      recentRegistrations,
      recentPayments
    };
  }

  async getPropertyManagerDashboard(organizationId) {
    const whereOrg = organizationId ? { organizationId } : {};

    const totalProperties = await Property.count({ where: whereOrg });
    const totalUnits = await Unit.count({
      include: [{ model: Property, as: 'property', where: whereOrg, required: true }]
    });
    const occupiedUnits = await Unit.count({
      where: { status: 'OCCUPIED' },
      include: [{ model: Property, as: 'property', where: whereOrg, required: true }]
    });
    const vacantUnits = totalUnits - occupiedUnits;
    const occupancyRate = totalUnits > 0 ? parseFloat(((occupiedUnits / totalUnits) * 100).toFixed(1)) : 0;

    const activeTenants = await Tenant.count({ where: { ...whereOrg, status: 'Active' } });
    const activeLeases = await Lease.count({ where: { ...whereOrg, status: 'ACTIVE' } });

    const rentCollected = await Payment.sum('amount', { where: { ...whereOrg, status: 'SUCCESS' } }) || 0;
    const outstandingRent = await Invoice.sum('balance', { where: { ...whereOrg, status: { [Op.in]: ['UNPAID', 'PARTIALLY_PAID', 'OVERDUE'] } } }) || 0;
    const overdueInvoices = await Invoice.count({ where: { ...whereOrg, status: 'OVERDUE' } });

    const pendingMaintenance = await Maintenance.count({
      where: { ...whereOrg, status: { [Op.in]: ['SUBMITTED', 'REVIEWING', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS'] } }
    });

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringLeases = await Lease.count({
      where: {
        ...whereOrg,
        status: 'ACTIVE',
        endDate: { [Op.lte]: thirtyDaysFromNow }
      }
    });

    return {
      role: 'PROPERTY_MANAGER',
      metrics: {
        totalProperties,
        totalUnits,
        occupiedUnits,
        vacantUnits,
        occupancyRate,
        activeTenants,
        activeLeases,
        rentCollected: parseFloat(rentCollected),
        outstandingRent: parseFloat(outstandingRent),
        overdueInvoices,
        pendingMaintenance,
        expiringLeases
      }
    };
  }

  async getLandlordDashboard(userId) {
    const landlord = await Landlord.findOne({ where: { userId } });
    const landlordId = landlord ? landlord.id : null;

    const totalProperties = await Property.count();
    const totalUnits = await Unit.count();
    const occupiedUnits = await Unit.count({ where: { status: 'OCCUPIED' } });
    const vacantUnits = totalUnits - occupiedUnits;
    const occupancyRate = totalUnits > 0 ? parseFloat(((occupiedUnits / totalUnits) * 100).toFixed(1)) : 0;

    const expectedRentSum = await Lease.sum('rentAmount', { where: { status: 'ACTIVE' } }) || 0;
    const collectedRentSum = await Payment.sum('amount', { where: { status: 'SUCCESS' } }) || 0;
    const outstandingRentSum = await Invoice.sum('balance', { where: { status: { [Op.in]: ['UNPAID', 'PARTIALLY_PAID', 'OVERDUE'] } } }) || 0;
    const totalExpensesSum = await Expense.sum('amount') || 0;
    const netIncome = parseFloat(collectedRentSum) - parseFloat(totalExpensesSum);

    return {
      role: 'LANDLORD',
      metrics: {
        myPropertiesCount: totalProperties,
        totalUnits,
        occupiedUnits,
        vacantUnits,
        occupancyRate,
        expectedRent: parseFloat(expectedRentSum),
        collectedRent: parseFloat(collectedRentSum),
        outstandingRent: parseFloat(outstandingRentSum),
        expenses: parseFloat(totalExpensesSum),
        netIncome
      }
    };
  }

  async getTenantDashboard(userId) {
    const tenant = await Tenant.findOne({
      where: { userId },
      include: [
        { model: Property, as: 'property' },
        { model: Unit, as: 'unit' }
      ]
    });

    const tenantId = tenant ? tenant.id : null;
    const activeLease = tenantId ? await Lease.findOne({ where: { tenantId, status: 'ACTIVE' } }) : null;
    const unpaidInvoices = tenantId ? await Invoice.findAll({ where: { tenantId, status: { [Op.in]: ['UNPAID', 'PARTIALLY_PAID', 'OVERDUE'] } } }) : [];

    const outstandingBalance = unpaidInvoices.reduce((acc, inv) => acc + parseFloat(inv.balance || 0), 0);
    const maintenanceCount = tenantId ? await Maintenance.count({ where: { tenantId } }) : 0;

    return {
      role: 'TENANT',
      metrics: {
        currentProperty: tenant?.property?.name || 'N/A',
        currentUnit: tenant?.unit?.unitNumber || 'N/A',
        monthlyRent: tenant ? parseFloat(tenant.rentAmount || 0) : 0,
        nextDueDate: activeLease ? activeLease.endDate : 'N/A',
        outstandingBalance,
        leaseStatus: activeLease ? activeLease.status : 'No Active Lease',
        maintenanceRequestsCount: maintenanceCount
      }
    };
  }
}

module.exports = new AnalyticsService();
