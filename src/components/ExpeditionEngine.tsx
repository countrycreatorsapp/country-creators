import React, { useState } from 'react';

// The RNG Engine Data (The "Deck" of Events)
const EXPEDITION_EVENTS = [
  // --- 80% POSITIVE EVENTS ---
  { id: 'p1', type: 'positive', title: 'Bountiful Catch', text: 'Your fishing boats discovered a massive school of tuna.', reward: '+50 Food', color: 'text-emerald-400' },
  { id: 'p2', type: 'positive', title: 'Ancient Shrine', text: 'Scouts found a beautiful, untouched shrine in the mountains. Your people rejoice.', reward: '+15 Culture', color: 'text-purple-400' },
  { id: 'p3', type: 'positive', title: 'Driftwood Haul', text: 'A massive amount of usable timber washed ashore after a storm.', reward: '+40 Materials', color: 'text-orange-400' },
  { id: 'p4', type: 'positive', title: 'Merchant Fleet', text: 'A friendly merchant fleet from a neighboring island visited your port.', reward: '+75 Gold', color: 'text-yellow-400' },
  { id: 'p5', type: 'positive', title: 'Lost Scroll', text: 'An explorer unearthed an ancient text hidden in a cave.', reward: '+20 Tech Points', color: 'text-cyan-400' },
  { id: 'p6', type: 'positive', title: 'Fertile Soil', text: 'A rare patch of volcanic soil was found to be incredibly fertile.', reward: '+30 Food, +10 Gold', color: 'text-emerald-400' },
  { id: 'p7', type: 'positive', title: 'Gold Vein', text: 'Miners struck a small but pure vein of gold in the highlands.', reward: '+100 Gold', color: 'text-yellow-400' },
  
  // --- 5% NEUTRAL EVENTS ---
  { id: 'n1', type: 'neutral', title: 'Quiet Day', text: 'The scouts returned. The islands are peaceful, but they found nothing of note.', reward: 'No Change', color: 'text-slate-400' },

  // --- 15% NEGATIVE EVENTS (The "Far Fewer" Hazards) ---
  { id: 'h1', type: 'negative', title: 'Minor Tremor', text: 'A small earthquake damaged some of your outer roads.', reward: '-15 Materials', color: 'text-rose-400' },
  { id: 'h2', type: 'negative', title: 'Typhoon Warning', text: 'Heavy rains washed away some of your coastal food stores.', reward: '-20 Food', color: 'text-rose-400' },
];

export default function ExpeditionEngine() {
  const [hasExplored, setHasExplored] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState(null);

  const handleExpedition = () => {
    setIsRolling(true);
    
    // Simulate the suspense of the scouts searching
    setTimeout(() => {
      // RNG Math: Pick a random event from the deck
      const randomIndex = Math.floor(Math.random() * EXPEDITION_EVENTS.length);
      setResult(EXPEDITION_EVENTS[randomIndex]);
      setIsRolling(false);
      setHasExplored(true);
    }, 1500);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-center">
      <h2 className="text-2xl font-bold text-white mb-2">Daily Expedition</h2>
      <p className="text-slate-400 text-sm mb-6">
        Send your scouts into the archipelago. They might find riches, or they might encounter hazards. You get one expedition per day.
      </p>

      {!hasExplored && !isRolling && (
        <button 
          onClick={handleExpedition}
          className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all transform hover:scale-105 active:scale-95"
        >
          🗺️ Send the Scouts
        </button>
      )}

      {isRolling && (
        <div className="py-8 animate-pulse">
          <p className="text-indigo-400 font-bold text-lg">Scouts are exploring the islands...</p>
        </div>
      )}

      {hasExplored && result && (
        <div className={`mt-4 p-6 rounded-lg border bg-slate-900/50 transform transition-all animate-fade-in-up ${
          result.type === 'positive' ? 'border-emerald-500/30' : 
          result.type === 'negative' ? 'border-rose-500/30' : 'border-slate-500/30'
        }`}>
          <div className="flex justify-center mb-3">
            <span className="text-4xl">
              {result.type === 'positive' ? '✨' : result.type === 'negative' ? '⚠️' : '🏕️'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{result.title}</h3>
          <p className="text-slate-300 text-sm mb-4">{result.text}</p>
          <div className="py-2 px-4 bg-slate-800 rounded inline-block">
            <span className={`font-black tracking-wider ${result.color}`}>
              {result.reward}
            </span>
          </div>
        </div>
      )}

      {hasExplored && (
        <p className="mt-6 text-xs text-slate-500 font-mono">
          Expedition complete. Next scouts available in 23:59:59.
        </p>
      )}
    </div>
  );
}