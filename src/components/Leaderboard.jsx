import React from 'react';

const Leaderboard = () => {
  const leaderboardData = [
    { name: "Dr. Poopenstein", score: 98, title: "The Golden Throne" },
    { name: "Sir Plops-a-Lot", score: 95, title: "The Royal Flush" },
    { name: "The Bowel Whisperer", score: 92, title: "The Perfect Form" },
    { name: "Captain Colon", score: 89, title: "The Solid Performance" },
    { name: "Lady Loopoop", score: 87, title: "The Classic Drop" },
    { name: "Duke of Dookie", score: 85, title: "The Noble Effort" },
    { name: "Countess of Crap", score: 82, title: "The Decent Delivery" },
    { name: "Baron von BM", score: 79, title: "The Average Joe" },
    { name: "The Turd Burglar", score: 76, title: "The Mediocre Moment" },
    { name: "Professor Poop", score: 73, title: "The Struggling Scholar" }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e'; // A range
    if (score >= 80) return '#84cc16'; // B range
    if (score >= 70) return '#eab308'; // C range
    if (score >= 60) return '#f97316'; // D range
    return '#ef4444'; // F range
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full">
      <h2 className="text-xl font-semibold mb-6 text-brown-700">Hall of Fame 🏆</h2>
      
      <div className="space-y-4">
        {leaderboardData.map((entry, index) => (
          <div
            key={index}
            className="p-4 bg-amber-50 rounded-lg transition-all duration-300 hover:shadow-md hover:translate-x-1 hover:bg-amber-100"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-amber-800 w-6">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                </span>
                <span className="text-brown-700 font-semibold">{entry.name}</span>
              </div>
              <span className="font-bold text-2xl" style={{ color: getScoreColor(entry.score) }}>
                {entry.score}
              </span>
            </div>
            <p className="text-amber-700 text-sm italic ml-9">{entry.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
