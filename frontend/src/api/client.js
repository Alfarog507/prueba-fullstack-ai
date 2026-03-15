const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function getPosts() {
  const res = await fetch(`${BASE_URL}/posts`);
  if (!res.ok) throw new Error('Error al obtener los posts');
  return res.json();
}

export async function analyzeComments(comments) {
  const res = await fetch(`${BASE_URL}/ai/analyze-comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comments }),
  });
  if (!res.ok) throw new Error('Error al analizar los comentarios');
  return res.json();
}
