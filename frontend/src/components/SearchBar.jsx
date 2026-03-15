export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Buscar por nombre de usuario..."
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
