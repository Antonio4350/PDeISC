export default function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 p-2 rounded-full text-white shadow"
    >
      ✏️
    </button>
  );
}
