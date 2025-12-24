type Props = {
  value: number; // This should be the percentage
};

export default function ProgressBar({ value }: Props) {
  // Clamp value between 0 and 100
  const percentage = Math.min(100, Math.max(0, value));

  let color = "#22c55e"; // Success Green
  if (percentage < 40) color = "#ef4444"; // Danger Red
  else if (percentage < 70) color = "#f59e0b"; // Warning Orange

  return (
    <div className="progress-bar-container" style={{
      background: "#30363d",
      borderRadius: "10px",
      height: "10px",
      width: "100%",
      overflow: "hidden"
    }}>
      <div
        className="progress-fill"
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
          height: "100%",
          transition: "width 0.4s ease"
        }}
      />
    </div>
  );
}