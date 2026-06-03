const { getCookie } = require('./_utils');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  const cookie = getCookie(req);
  const hasCookie = !!cookie && cookie.length > 10;
  res.json({
    status: 'ok',
    has_cookie: hasCookie,
    cookie_length: cookie ? cookie.length : 0,
    message: hasCookie
      ? 'Cookie configurado! A API deve funcionar.'
      : 'Cookie NAO configurado! Adicione SUNO_COOKIE nas variaveis de ambiente OU cole no app frontend.',
  });
};