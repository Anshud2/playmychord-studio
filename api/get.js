const { handleCors, sunoFetch } = require('./_utils');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  try {
    const ids = req.query.ids;
    const path = ids ? '/api/feed/?ids=' + encodeURIComponent(ids) : '/api/feed/?page=0';
    const data = await sunoFetch(req, path);
    res.json(data);
  } catch (err) {
    console.error('[get]', err.message);
    res.status(500).json({ error: err.message });
  }
};