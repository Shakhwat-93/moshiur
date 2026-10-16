import {
  getDuplicateSettings,
  updateDuplicateSettings,
  getDuplicateLogs
} from './_lib/duplicateProtectionService.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Retrieve configuration and blocked logs
    if (req.method === 'GET') {
      const config = await getDuplicateSettings();
      const logsSummary = await getDuplicateLogs(25);

      return res.status(200).json({
        success: true,
        config,
        totalBlocked: logsSummary.totalBlocked,
        logs: logsSummary.logs
      });
    }

    // POST: Update configuration
    if (req.method === 'POST') {
      const {
        is_enabled,
        block_same_phone,
        block_same_ip,
        duration_minutes
      } = req.body || {};

      const updated = await updateDuplicateSettings({
        is_enabled,
        block_same_phone,
        block_same_ip,
        duration_minutes
      });

      return res.status(200).json({
        success: true,
        message: 'ডুপ্লিকেট অর্ডার প্রতিরোধ সেটিংস সফলভাবে সংরক্ষিত হয়েছে',
        config: updated
      });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('[API admin-duplicate-config error]:', err.message);
    return res.status(400).json({
      success: false,
      error: err.message || 'Error processing request'
    });
  }
}
