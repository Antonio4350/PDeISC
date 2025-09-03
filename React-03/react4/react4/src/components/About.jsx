export default function About({ about }) {
  return (
    <div className="max-w-3xl text-center">
      <h2 className="text-3xl font-bold text-purple-400 mb-6">Sobre mí</h2>
      <p className="text-lg leading-relaxed">{about}</p>
    </div>
  );
}
