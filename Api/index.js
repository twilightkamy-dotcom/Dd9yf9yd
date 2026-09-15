export const config = {
  runtime: 'nodejs',
  api: {
    bodyParser: false, // Отключаем автоматический парсинг тела
  },
};

export default async function handler(request, response) {
  try {
    // Формируем правильный URL для Groq
    const targetUrl = new URL(request.url.replace('/api', ''), 'https://api.groq.com');

    // Проксируем запрос
    const groqResponse = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request, // Передаём тело как поток
      duplex: 'half', // Обязательный флаг для потоковой передачи
    });

    // Возвращаем ответ от Groq
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
