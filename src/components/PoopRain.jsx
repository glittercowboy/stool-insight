import React, { useEffect, useState } from 'react';

const PoopRain = () => {
  const [poops, setPoops] = useState([]);

  useEffect(() => {
    // Create 15 poop emojis with random positions starting above the viewport
    const newPoops = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${-Math.random() * 50}%`, // Start above viewport
      delay: Math.random() * 1.5,
      size: Math.random() * (30 - 15) + 15, // Random size between 15-30px
      duration: 2 + Math.random() * 1 // Random duration between 2-3s
    }));
    setPoops(newPoops);

    // Clean up after animation
    const timer = setTimeout(() => {
      setPoops([]);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {poops.map((poop) => (
        <div
          key={poop.id}
          className="absolute"
          style={{
            left: poop.left,
            top: poop.top,
            fontSize: `${poop.size}px`,
            opacity: 0.7,
            animation: `poopRain ${poop.duration}s linear ${poop.delay}s forwards`
          }}
        >
          💩
        </div>
      ))}
    </div>
  );
};

export default PoopRain;
