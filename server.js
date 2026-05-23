const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', createProxyMiddleware({
  target: 'https://api.openai.com',
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('Host', 'api.openai.com');
    },
    proxyRes: (proxyRes, req, res) => {
      proxyRes.headers['access-control-allow-origin'] = '*';
    },
  },
}));

app.listen(PORT, () => {
  console.log(`OpenAI Proxy running on port ${PORT}`);
});
