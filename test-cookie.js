const { getToken, getHeaders } = require('./_utils');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const token = getToken(req);

  if (!token) {
    return res.status(400).json({
      ok: false,
      message: 'Nenhum token encontrado. Cole o token nas configurações do app.',
    });
  }

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/musicgen-medium', {
      method: 'POST',
      headers: getHeaders(req),
      body: JSON.stringify({
        inputs: 'test'
      }),
    });

    const text = await response.text();

    if (response.ok) {
      return res.status(200).json({
        ok: true,
        status: response.status,
        message: 'Token do Hugging Face funcionando!',
        token_length: token.length,
      });
    }

    return res.status(200).json({
      ok: false,
      status: response.status,
      message: 'Token inválido ou expirado',
      detail: text.substring(0, 200),
      token_length: token.length,
    });

  } catch (err) {
    return res.status(200).json({
      ok: false,
      message: 'Erro ao conectar com Hugging Face',
      detail: err.message,
      token_length: token.length,
    });
  }
};