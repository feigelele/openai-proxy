export default async function handler(req, res) {
  // req.url 是 /v1/models 这样的路径
  const targetUrl = 'https://api.openai.com' + req.url;

  try {
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (!['host', 'connection', 'x-forwarded-for', 'x-forwarded-host'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    }
    headers['host'] = 'api.openai.com';

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : null,
    });

    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    const data = await response.text();
    res.send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
