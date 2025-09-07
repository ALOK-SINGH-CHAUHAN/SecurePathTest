import { useState, useEffect } from "react";

const mottos = [
  "💪 Strong women lift each other up 💪",
  "🌟 Your safety is your power 🌟", 
  "🛡️ Trust your instincts, stay safe 🛡️",
  "🚀 Confident journeys start here 🚀"
];

export default function SafetyMottoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mottos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-accent py-3 overflow-hidden">
      <div className="text-center font-medium text-primary transition-all duration-500">
        {mottos[currentIndex]}
      </div>
    </div>
  );
}
