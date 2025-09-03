export default function Hero({ heroText }) {
  return (
    <div className="text-center space-y-3">
      {heroText.split("\n").map((line, i) => (
        <p
          key={i}
          className="text-xl sm:text-2xl md:text-4xl font-bold text-purple-400"
        >
          {line}
        </p>
      ))}
    </div>
  );
}
