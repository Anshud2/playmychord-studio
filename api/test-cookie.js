const { getCookie, getHeaders } = require('./_utils');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const cookie = getCookie(req);

  if (!cookie) {
    return res.status(400).json({
      ok: false,
      message: 'Nenhum cookie encontrado. Cole o cookie nas configuracoes do app.',
    });
  }

  try {
    const response = await fetch('https://studio-api.suno.ai/api/billing/info/', {
      method: 'GET',
      headers: getHeaders(req),
    });

    const text = await response.text();
    const isHtml = text.trim().startsWith('<');

    if (isHtml) {
      if (response.status === 401 || response.status === 403) {
        return res.status(200).json({
          ok: false,
          status: response.status,
          message: 'Cookie expirado!',
          detail: 'Acesse https://suno.com, copie o Cookie e cole no app.',
          cookie_length: cookie.length,
        });
      }

      return res.status(200).json({
        ok: false,
        status: response.status,
        message: 'A API do Suno retornou HTML em vez de JSON.',
        detail: 'O servidor pode estar em manutencao ou o endpoint mudou.',
        response_preview: text.substring(0, 200),
        cookie_length: cookie.length,
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return res.status(200).json({
        ok: false,
        status: response.status,
        message: 'Erro da API do Suno',
        detail: data.detail || data.message || data.error || 'HTTP ' + response.status,
        cookie_length: cookie.length,
      });
    }

    return res.status(200).json({
      ok: true,
      status: response.status,
      message: 'Cookie funcionando! API do Suno respondeu corretamente.',
      credits_left: data.total_credits_left || data.credits_left || 0,
      cookie_length: cookie.length,
      data: data,
    });

  } catch (err) {
    return res.status(200).json({
      ok: false,
      message: 'Erro ao conectar com a API do Suno',
      detail: err.message,
      cookie_length: cookie.length,
    });
  }
};