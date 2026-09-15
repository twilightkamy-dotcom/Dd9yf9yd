export default async function handler(request, response) {
  const targetUrl = new URL(request.url.replace('/api', ''), 'https://api.groq.com');

  const headers = new Headers(request.headers);
  headers.set('Host', 'api.groq.com');

  const groqResponse = await fetch(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
  });

  response.status(groqResponse.status);
  groqResponse.headers.forEach((value, key) => {
    response.setHeader(key, value);
  });

  const body = await groqResponse.arrayBuffer();
  response.send(Buffer.from(body));
}
