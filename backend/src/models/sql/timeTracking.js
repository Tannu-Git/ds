const { query } = require('../../config/db');

const timeTrackingQueries = {
  // Get all time tracking records
  getAllTimeTracking: async () => {
    const sql = `
      SELECT t.*, e.emp_name 
      FROM time_tracking t
      LEFT JOIN employees e ON t.emp_id = e.emp_id
      ORDER BY t.date DESC
    `;
    return await query(sql);
  },

  // Get time tracking by ID
  getTimeTrackingById: async (trackingId) => {
    const sql = `
      SELECT t.*, e.emp_name 
      FROM time_tracking t
      LEFT JOIN employees e ON t.emp_id = e.emp_id
      WHERE t.tracking_id = ?
    `;
    const results = await query(sql, [trackingId]);
    return results[0];
  },

  // Get time tracking by employee ID
  getTimeTrackingByEmployee: async (empId) => {
    const sql = `
      SELECT t.*, e.emp_name 
      FROM time_tracking t
      LEFT JOIN employees e ON t.emp_id = e.emp_id
      WHERE t.emp_id = ?
      ORDER BY t.date DESC
    `;
    return await query(sql, [empId]);
  },

  // Create new time tracking record
  createTimeTracking: async (trackingData) => {
    const sql = `
      INSERT INTO time_tracking 
      (emp_id, task, hours, date) 
      VALUES (?, ?, ?, ?)
    `;
    const result = await query(sql, [
      trackingData.emp_id,
      trackingData.task,
      trackingData.hours,
      trackingData.date || new Date()
    ]);
    return { tracking_id: result.insertId, ...trackingData };
  },

  // Update time tracking record
  updateTimeTracking: async (trackingId, trackingData) => {
    const sql = `
      UPDATE time_tracking 
      SET task = ?, hours = ?, date = ?, updated_at = NOW()
      WHERE tracking_id = ?
    `;
    await query(sql, [
      trackingData.task,
      trackingData.hours,
      trackingData.date,
      trackingId
    ]);
    return await timeTrackingQueries.getTimeTrackingById(trackingId);
  },

  // Delete time tracking record
  deleteTimeTracking: async (trackingId) => {
    const sql = 'DELETE FROM time_tracking WHERE tracking_id = ?';
    return await query(sql, [trackingId]);
  },

  // Get time tracking summary by employee
  getEmployeeTimeSummary: async (empId, startDate, endDate) => {
    const sql = `
      SELECT 
        DATE(date) as work_date,
        SUM(hours) as total_hours,
        GROUP_CONCAT(task) as tasks
      FROM time_tracking
      WHERE emp_id = ?
        AND date BETWEEN ? AND ?
      GROUP BY DATE(date)
      ORDER BY date DESC
    `;
    return await query(sql, [empId, startDate, endDate]);
  }
};

module.exports = timeTrackingQueries;