export default async function handler(request, response) {
  const targetUrl = new URL(request.url.replace('/api', ''), 'https://api.groq.com');

  try {
    const groqResponse = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    });

    response.status(groqResponse.status);
    groqResponse.headers.forEach((value, key) => {
      response.setHeader(key, value);
    });

    const body = await groqResponse.arrayBuffer();
    response.send(Buffer.from(body));
  } catch (error) {
    console.error('Proxy error:', error);
    response.status(500).json({ error: 'Proxy failed', details: error.message });
  }
}
