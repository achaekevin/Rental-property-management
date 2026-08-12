const { sequelize, Payment, Invoice, PaymentAllocation, MpesaTransaction } = require('../models');

class PaymentService {
  async getAllPayments(organizationId) {
    const where = organizationId ? { organizationId } : {};
    return await Payment.findAll({ where, order: [['createdAt', 'DESC']] });
  }

  async createPayment(data, organizationId) {
    if (organizationId) data.organizationId = organizationId;

    return await sequelize.transaction(async (t) => {
      const payment = await Payment.create(data, { transaction: t });

      if (data.invoiceId) {
        const invoice = await Invoice.findByPk(data.invoiceId, { transaction: t });
        if (invoice) {
          const newPaidAmount = parseFloat(invoice.paidAmount || 0) + parseFloat(payment.amount);
          const newBalance = Math.max(0, parseFloat(invoice.totalAmount) - newPaidAmount);
          const newStatus = newBalance === 0 ? 'PAID' : 'PARTIALLY_PAID';

          await invoice.update({ paidAmount: newPaidAmount, balance: newBalance, status: newStatus }, { transaction: t });

          await PaymentAllocation.create({
            paymentId: payment.id,
            invoiceId: invoice.id,
            allocatedAmount: payment.amount
          }, { transaction: t });
        }
      }

      return payment;
    });
  }

  async handleMpesaStkPush(paymentData) {
    const { phoneNumber, amount, accountReference } = paymentData;
    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const payment = await Payment.create({
      amount,
      phoneNumber,
      reference: accountReference || 'M-PESA RENT',
      checkoutRequestId,
      paymentMethod: 'M-Pesa',
      status: 'PENDING'
    });

    await MpesaTransaction.create({
      paymentId: payment.id,
      checkoutRequestId,
      phoneNumber,
      amount,
      resultCode: 0,
      resultDesc: 'STK Push Sent'
    });

    return {
      success: true,
      message: 'M-Pesa STK Push initiated successfully',
      checkoutRequestId,
      paymentId: payment.id
    };
  }
}

module.exports = new PaymentService();
