import React from 'react';
import ExpeditionEngine from '../../components/ExpeditionEngine';
import BuildingStore from '../../components/BuildingStore';

// Mock data to simulate the Supabase database for now
const mockNationData = {
  passcode: 'purple-dragon-72',
  nationName: 'The Republic of Awesome',
  level: 2,
  era: 'Stone Age',
  resources: {
    population: 150,
    gold: 320,
    materials: 85,
    techPoints: 40,
    culture: 10
  },
  activeEvents: [
    { id: 1, name: 'The Archipelago Shift', type: 'crisis', effect: '-50% Farming Output' }
  ]
};

export default function Dashboard() {
  const { nationName, level, era, resources, activeEvents } = mockNationData;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-6 pb-20">
      {/* Header Bar */}
      <header className="flex justify-between items-center pb-6 border-b border-slate-700">
        <div>
          <h1 className="text-4xl font-extrabold text-emerald-400">{nationName}</h1>
          <p className="text-slate-400 mt-1">
            Level {level} Empire • {era} Era
          </p>
        </div>
        <button className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-600 transition-colors">
          Log Out
        </button>
      </header>

      {/* Resource HUD (Heads Up Display) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
        <ResourceCard title="Population" value={resources.population} icon="👥" color="text-blue-400" />
        <ResourceCard title="Gold" value={resources.gold} icon="🪙" color="text-yellow-400" />
        <ResourceCard title="Materials" value={resources.materials} icon="🪵" color="text-orange-400" />
        <ResourceCard title="Tech Points" value={resources.techPoints} icon="🔬" color="text-cyan-400" />
        <ResourceCard title="Culture" value={resources.culture} icon="🏛️" color="text-purple-400" />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Left Column: Daily Actions & Active Events */}
        <div className="col-span-1 space-y-6">
          
          {/* Daily Expedition Engine */}
          <ExpeditionEngine />

          {/* Active Crises Panel */}
          <div className="bg-slate-800 p-6 rounded-xl border border-rose-900/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
            <h2 className="text-xl font-bold text-white mb-4">Active Crises</h2>
            {activeEvents.length > 0 ? (
              activeEvents.map(event => (
                <div key={event.id} className="bg-rose-950/30 border border-rose-800 rounded-lg p-4 mb-3">
                  <h3 className="font-bold text-rose-400 flex items-center gap-2">
                    <span>⚠️</span> {event.name}
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">Effect: {event.effect}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No active threats. Your borders are secure.</p>
            )}
          </div>
          
        </div>

        {/* Right Columns: City Infrastructure & Upgrades */}
        <div className="col-span-2 space-y-6">
          <BuildingStore />
        </div>

      </div>
    </div>
  );
}

// Helper Component for the Resources
function ResourceCard({ title, value, icon, color }) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md flex items-center space-x-4 transition-transform hover:scale-105">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{title}</p>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
      </div>
    </div>
  );
}