const { handleCors, sunoFetch } = require('./_utils');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  try {
    const b = req.body || {};
    const data = await sunoFetch(req, '/api/generate/v2/', {
      method: 'POST',
      body: {
        mv: b.model || 'chirp-v3-5',
        audio_id: b.audio_id || '',
        prompt: b.prompt || '',
        continue_at: b.continue_at || 0,
        make_instrumental: b.make_instrumental || false,
      },
    });
    res.json(data);
  } catch (err) {
    console.error('[extend_audio]', err.message);
    res.status(500).json({ error: err.message });
  }
};