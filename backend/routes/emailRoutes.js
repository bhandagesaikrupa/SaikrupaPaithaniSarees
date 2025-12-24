import express from 'express';
import { sendOrderConfirmationEmail } from '../emailService.js';

const router = express.Router();

// Email confirmation route
router.post('/send-order-confirmation', async (req, res) => {
  try {
    const { to, subject, orderId, orderNumber, customerName, orderData, paymentMethod, totalAmount } = req.body;
    
    //console.log('📧 Received email request for order:', orderNumber);
    
    // Validate required fields
    if (!to || !customerName || !orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, customerName, orderNumber'
      });
    }

    const result = await sendOrderConfirmationEmail({
      to,
      subject: subject || (paymentMethod === 'cod' 
        ? `Order Confirmed - Your SaiKrupa Paithani Order #${orderNumber}`
        : `Payment Successful - Your SaiKrupa Paithani Order #${orderNumber}`),
      orderId,
      orderNumber,
      customerName,
      orderData,
      paymentMethod: paymentMethod || 'razorpay',
      totalAmount
    });

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Email sent successfully',
        orderNumber: orderNumber
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send email',
        error: result.message 
      });
    }
  } catch (error) {
    console.error('Email API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Test email endpoint
router.post('/test', async (req, res) => {
  try {
    const testData = {
      to: req.body.to || 'diyawakhare27@gmail.com',
      customerName: 'Test Customer',
      orderNumber: 'TEST12345',
      orderData: {
        shippingAddress: {
          firstName: 'Test',
          lastName: 'Customer',
          address: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          phone: '+91 9876543210',
          email: 'test@example.com'
        },
        shippingMethod: 'standard',
        items: [
          { name: 'Test Paithani Saree', quantity: 1, price: 2500 },
          { name: 'Test Silk Saree', quantity: 2, price: 1500 }
        ]
      },
      paymentMethod: req.body.paymentMethod || 'razorpay',
      totalAmount: 5500
    };

    const result = await sendOrderConfirmationEmail(testData);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test email sent successfully',
        to: testData.to
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: result.message 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;