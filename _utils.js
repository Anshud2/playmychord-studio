const HF_BASE = 'https://api-inference.huggingface.co/models';

function getToken(req) {
  if (req && req.headers) {
    const headerToken = req.headers['x-hf-token'] || req.headers['X-HF-Token'];
    if (headerToken) return headerToken;
  }
  return process.env.HF_TOKEN || '';
}

function getHeaders(req, extra = {}) {
  const token = getToken(req);
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...extra,
  };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return headers;
}

async function hfFetch(req, model, options = {}) {
  const url = HF_BASE + '/' + model;
  const fetchOptions = {
    method: options.method || 'POST',
    headers: getHeaders(req, options.headers),
  };
  if (options.body) {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);
  const text = await response.text();

  const isHtml = text.trim().startsWith('<');
  if (isHtml) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Token inválido ou expirado! Gere um novo token no Hugging Face.');
    }
    if (response.status === 503 || response.status === 502 || response.status === 504) {
      throw new Error('Hugging Face temporariamente indisponível (erro ' + response.status + '). Tente novamente em alguns minutos.');
    }
    throw new Error('Hugging Face retornou HTML em vez de JSON. Status: ' + response.status);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const msg = data.detail || data.message || data.error || ('Erro HTTP ' + response.status);
    throw new Error(String(msg));
  }
  return data;
}

function handleCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-hf-token');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

module.exports = { HF_BASE, getToken, getHeaders, hfFetch, handleCors };