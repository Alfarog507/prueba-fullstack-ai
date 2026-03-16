import { useState, useEffect } from 'react';
import { getPosts, analyzeComments } from './api/client';
import SearchBar from './components/SearchBar';
import PostsTable from './components/PostsTable';
import Pagination from './components/Pagination';
import AIAnalysis from './components/AIAnalysis';

const PAGE_SIZE = 10;

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(() => setError('No se pudieron cargar los posts.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  async function handleAnalyze() {
    setAnalyzing(true);
    setAnalysis(null);
    setAnalysisError(null);
    try {
      const comments = posts.flatMap(p => p.bodies).slice(0, 20);
      const result = await analyzeComments(comments);
      setAnalysis(result);
    } catch {
      setAnalysisError('No se pudo completar el análisis.');
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Posts por usuario</h1>

        <div className="mb-4">
          <SearchBar value={search} onChange={handleSearch} />
        </div>

        {loading && (
          <p className="text-gray-500 text-center py-8">Cargando...</p>
        )}

        {error && (
          <p className="text-red-500 text-center py-8">{error}</p>
        )}

        {!loading && !error && (
          <>
            <PostsTable posts={paginated} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <div className="mt-6">
              <AIAnalysis
                onAnalyze={handleAnalyze}
                analyzing={analyzing}
                analysis={analysis}
                error={analysisError}
                disabled={posts.length === 0}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
