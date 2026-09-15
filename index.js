export default async function handler(request, response) {
  // Собираем полный URL для Groq API
  const targetUrl = new URL(request.url.replace('/api', ''), 'https://api.groq.com');

  // Копируем заголовки из исходного запроса
  const headers = new Headers(request.headers);
  headers.set('Host', 'api.groq.com');

  // Проксируем запрос
  const groqResponse = await fetch(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
  });

  // Копируем статус и заголовки ответа
  response.status(groqResponse.status);
  groqResponse.headers.forEach((value, key) => {
    response.setHeader(key, value);
  });

  // Возвращаем тело ответа
  const body = await groqResponse.arrayBuffer();
  response.send(Buffer.from(body));
}
