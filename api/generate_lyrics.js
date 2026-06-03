const { handleCors, sunoFetch } = require('./_utils');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  try {
    const data = await sunoFetch(req, '/api/generate/lyrics/', {
      method: 'POST',
      body: { prompt: (req.body || {}).prompt || '' },
    });
    res.json(data);
  } catch (err) {
    console.error('[generate_lyrics]', err.message);
    res.status(500).json({ error: err.message });
  }
};