import React from 'react';

const BUILDINGS = [
  {
    id: 'fishing_fleet',
    name: 'Coastal Fishing Fleet',
    description: 'Survive the Archipelago. Generates reliable food from the ocean.',
    cost: { gold: 50, materials: 100 },
    benefit: '+20 Food / Day',
    icon: '⛵',
    unlocked: true,
  },
  {
    id: 'market',
    name: 'Grand Bazaar',
    description: 'Allows you to trade excess resources with other students.',
    cost: { gold: 200, materials: 50 },
    benefit: 'Unlocks Global Trade',
    icon: '⚖️',
    unlocked: true,
  },
  {
    id: 'library',
    name: 'Village Library',
    description: 'Generates passive Tech Points over time.',
    cost: { gold: 150, materials: 150 },
    benefit: '+5 Tech Points / Day',
    icon: '📚',
    unlocked: false, // Requires Bronze Age Tech
    requirement: 'Requires Writing Tech',
  },
  {
    id: 'reinforced_walls',
    name: 'Reinforced Walls',
    description: 'Protects your population and resources from earthquakes and typhoons.',
    cost: { gold: 300, materials: 300 },
    benefit: 'Negates 1 Natural Disaster',
    icon: '🧱',
    unlocked: true,
  }
];

export default function BuildingStore() {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">City Infrastructure</h2>
        <span className="text-sm bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/50">
          Available Gold: 320 🪙
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BUILDINGS.map((b) => (
          <div 
            key={b.id} 
            className={`p-4 rounded-lg border flex flex-col justify-between ${
              b.unlocked 
                ? 'bg-slate-700/50 border-slate-600 hover:border-emerald-500 transition-colors cursor-pointer' 
                : 'bg-slate-900/50 border-slate-800 opacity-60 grayscale cursor-not-allowed'
            }`}
          >
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">{b.icon}</span>
                <h3 className="font-bold text-lg text-white">{b.name}</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4 h-10">{b.description}</p>
            </div>

            <div className="border-t border-slate-600/50 pt-3 mt-2">
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-emerald-400 font-bold">{b.benefit}</span>
                {!b.unlocked && (
                  <span className="text-rose-400 text-xs font-bold">{b.requirement}</span>
                )}
              </div>
              
              <button 
                disabled={!b.unlocked}
                className={`w-full py-2 rounded font-bold text-sm flex justify-center items-center space-x-2 ${
                  b.unlocked 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-900' 
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <span>Build:</span>
                {b.cost.gold > 0 && <span>{b.cost.gold} 🪙</span>}
                {b.cost.materials > 0 && <span>{b.cost.materials} 🪵</span>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}