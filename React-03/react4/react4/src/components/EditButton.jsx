export default function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 p-3 rounded-full shadow-lg text-white"
    >
      ✏️
    </button>
  );
}

