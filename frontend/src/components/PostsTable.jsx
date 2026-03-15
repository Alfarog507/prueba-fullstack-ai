export default function PostsTable({ posts }) {
  if (posts.length === 0) {
    return (
      <p className="text-gray-400 text-center py-8">No se encontraron usuarios.</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Usuario</th>
            <th className="px-4 py-3 text-right">Cantidad de Posts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {posts.map(({ name, postCount }) => (
            <tr key={name} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-700">{name}</td>
              <td className="px-4 py-3 text-right font-medium text-gray-900">{postCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
