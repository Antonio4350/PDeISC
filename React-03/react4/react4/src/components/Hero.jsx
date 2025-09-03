export default function Hero({ heroText }) {
  return (
    <div className="text-center">
      {heroText.split("\n").map((line, i) => (
        <p key={i} className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-400">{line}</p>
      ))}
    </div>
  );
}
