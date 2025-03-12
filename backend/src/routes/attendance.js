const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { Employee, Attendance } = require('../models'); // Add this line at the top

// Generate QR code for attendance
router.post('/generate-qr', auth, roleAuth(['admin']), async (req, res) => {
  try {
    // Create a payload with timestamp and secret
    const payload = {
      timestamp: Date.now(),
      secret: crypto.randomBytes(16).toString('hex'),
      companyId: 'EMS-001' // Add company identifier
    };

    // Encrypt the payload
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.JWT_SECRET, 'salt', 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Combine IV and encrypted data
    const qrCode = `${iv.toString('hex')}:${encrypted}`;
    
    res.json({ qrCode });
  } catch (error) {
    console.error('QR Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate QR code' });
  }
});

// Verify QR code
router.post('/verify-qr', auth, async (req, res) => {
  try {
    const { qrData } = req.body;
    const [ivHex, encryptedData] = qrData.split(':');

    // Decrypt and verify
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.JWT_SECRET, 'salt', 32);
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const payload = JSON.parse(decrypted);

    // Verify timestamp (QR code valid for 5 minutes)
    const timeDiff = Date.now() - payload.timestamp;
    if (timeDiff > 5 * 60 * 1000) {
      return res.status(400).json({ message: 'QR code expired' });
    }

    res.json({ valid: true, payload });
  } catch (error) {
    res.status(400).json({ message: 'Invalid QR code' });
  }
});

// Add attendance record
router.post('/scan', auth, async (req, res) => {
  try {
    const { emp_id, timestamp } = req.body;
    const attendance = await Attendance.create({
      emp_id,
      timestamp,
      status: 'IN'
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Failed to record attendance' });
  }
});

// Get attendance history
router.get('/:emp_id', auth, roleAuth(['admin', 'manager']), async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      where: { emp_id: req.params.emp_id },
      order: [['timestamp', 'DESC']],
      limit: 30 // Last 30 records
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance history' });
  }
});

// Add this new route for getting all attendance records
router.get('/all', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      include: [{
        model: Employee,
        attributes: ['emp_name', 'emp_id']
      }],
      order: [['timestamp', 'DESC']]
    });
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    res.status(500).json({ message: 'Failed to fetch attendance records' });
  }
});
module.exports = router;