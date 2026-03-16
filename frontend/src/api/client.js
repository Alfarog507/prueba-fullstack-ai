const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function getPosts() {
  const res = await fetch(`${BASE_URL}/posts`);
  if (!res.ok) throw new Error('Error al obtener los posts');
  return res.json();
}

export async function streamAnalyzeComments(comments, onChunk, onDone, onError) {
  const res = await fetch(`${BASE_URL}/ai/analyze-comments/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comments }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Error al analizar los comentarios');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split('\n\n');
    buffer = blocks.pop(); // keep incomplete SSE block in buffer

    for (const block of blocks) {
      const dataLine = block.split('\n').find(l => l.startsWith('data: '));
      if (!dataLine) continue;
      const event = JSON.parse(dataLine.slice(6));
      if (event.type === 'chunk') onChunk(event.text);
      else if (event.type === 'done') onDone(event.result);
      else if (event.type === 'error') onError(event.message);
    }
  }
}
