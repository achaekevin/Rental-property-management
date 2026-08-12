const paymentService = require('../services/payment.service');

class PaymentController {
  async getAll(req, res) {
    try {
      const payments = await paymentService.getAllPayments(req.user?.organizationId);
      res.json({ success: true, count: payments.length, data: payments });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async create(req, res) {
    try {
      const payment = await paymentService.createPayment(req.body, req.user?.organizationId);
      res.status(201).json({ success: true, message: 'Payment recorded successfully', data: payment });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async mpesaStkPush(req, res) {
    try {
      const result = await paymentService.handleMpesaStkPush(req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new PaymentController();
