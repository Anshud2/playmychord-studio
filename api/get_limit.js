const { handleCors, sunoFetch } = require('./_utils');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  try {
    const data = await sunoFetch(req, '/api/billing/info/');
    res.json({
      credits_left: data.total_credits_left || 0,
      period: 'day',
      monthly_limit: data.monthly_limit || 50,
      monthly_usage: data.monthly_usage || 0,
      raw: data,
    });
  } catch (err) {
    console.error('[get_limit]', err.message);
    res.status(500).json({ error: err.message });
  }
};