const { handleCors, hfFetch } = require('./_utils');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  try {
    const body = req.body || {};
    const prompt = body.prompt || '';

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    const data = await hfFetch(req, 'facebook/musicgen-medium', {
      method: 'POST',
      body: {
        inputs: prompt,
      },
    });

    res.json({
      success: true,
      prompt: prompt,
      message: 'Música gerada com sucesso!',
      data: data,
    });
  } catch (err) {
    console.error('[generate]', err.message);
    res.status(500).json({ error: err.message });
  }
};