const { handleCors, sunoFetch } = require('./_utils');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  try {
    const b = req.body || {};
    const data = await sunoFetch(req, '/api/generate/v2/', {
      method: 'POST',
      body: {
        mv: b.model || 'chirp-v3-5',
        title: b.title || 'Untitled',
        tags: b.tags || 'pop',
        prompt: b.lyrics || '',
        make_instrumental: b.make_instrumental || false,
        wait_audio: b.wait_audio !== false,
      },
    });
    res.json(data);
  } catch (err) {
    console.error('[custom_generate]', err.message);
    res.status(500).json({ error: err.message });
  }
};