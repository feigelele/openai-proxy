export default async function handler(req, res) {
  const { path } = req.query;
  const targetPath = '/' + (Array.isArray(path) ? path.join('/') : path || '');

  const url = 'https://api.openai.com' + targetPath + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');

  try {
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (!['host', 'connection'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    }
    headers['host'] = 'api.openai.com';

    const response = await fetch(url, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.arrayBuffer();
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(Buffer.from(data));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
