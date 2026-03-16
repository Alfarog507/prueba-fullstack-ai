const SENTIMENT_STYLES = {
  positive: 'bg-green-100 text-green-700',
  neutral: 'bg-yellow-100 text-yellow-700',
  negative: 'bg-red-100 text-red-700',
};

export default function AIAnalysis({ onAnalyze, analyzing, analysis, error, disabled }) {
  return (
    <div>
      <button
        onClick={onAnalyze}
        disabled={analyzing || disabled}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {analyzing ? 'Analizando...' : 'Analizar comentarios con IA'}
      </button>

      {error && (
        <p className="mt-3 text-red-500 text-sm text-center">{error}</p>
      )}

      {analysis && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-700 text-sm mb-3">{analysis.summary}</p>
          <div className="flex flex-wrap gap-2">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${SENTIMENT_STYLES[analysis.sentiment] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {analysis.sentiment}
            </span>
            {analysis.categories?.map(cat => (
              <span
                key={cat}
                className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
