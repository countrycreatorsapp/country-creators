"use client";
import React, { useEffect, useState } from 'react';
import { loginWithPasscode, setNationName } from '../../lib/supabase';
import ExpeditionEngine from '../../components/ExpeditionEngine';
import BuildingStore from '../../components/BuildingStore';
import FlagUploader from '../../components/FlagUploader';

export default function Dashboard() {
  const [nationData, setNationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [namingModalOpen, setNamingModalOpen] = useState(false);
  const [newNationName, setNewNationName] = useState('');
  const [namingLoading, setNamingLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const passcode = sessionStorage.getItem('cc_passcode');
      if (!passcode) {
        window.location.href = '/';
        return;
      }
      try {
        const data = await loginWithPasscode(passcode);
        setNationData(data);
        if (data.nation_name === 'Pending Naming...') {
          setNamingModalOpen(true);
        }
      } catch (err) {
        console.error('Failed to load nation', err);
        window.location.href = '/';
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNationName || newNationName.trim() === '') return;
    setNamingLoading(true);
    try {
      const updated = await setNationName(nationData.passcode, newNationName);
      setNationData({ ...nationData, nation_name: updated.nation_name });
      setNamingModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error updating name. Try again.');
    }
    setNamingLoading(false);
  };

  if (loading || !nationData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 border-opacity-50"></div>
      </div>
    );
  }

  // Use real resources or fallbacks if the array is empty
  const res = nationData.resources && nationData.resources.length > 0 ? nationData.resources[0] : {
    population: 100, gold: 50, materials: 50, tech_points: 0, culture: 0
  };

  // Hardcoded for the Japan unit crisis for now. Can be dynamic later.
  const activeEvents = [
    { id: 1, name: 'The Archipelago Shift', type: 'crisis', effect: '-50% Farming Output' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 pb-20 relative overflow-hidden">
      
      {/* Background Decor (Visual Engagement) */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10 pointer-events-none" />

      {/* Naming Modal */}
      {namingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 p-8 rounded-2xl border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)] max-w-lg w-full transform transition-all scale-100 opacity-100">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
              Found Your Nation
            </h2>
            <p className="text-slate-400 text-sm mb-6 font-medium">
              You have been given a plot of land and 100 citizens. What will your country be called?
            </p>
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="e.g. The Republic of Awesome"
                className="w-full px-4 py-4 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-lg shadow-inner"
                value={newNationName}
                onChange={(e) => setNewNationName(e.target.value)}
                maxLength={40}
                required
              />
              <button
                type="submit"
                disabled={namingLoading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black rounded-xl hover:from-emerald-400 hover:to-teal-300 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50"
              >
                {namingLoading ? 'Declaring Independence...' : 'Claim Nation'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <header className="flex justify-between items-center pb-6 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-6">
          {/* Bigger National Flag next to the name */}
          <div className="w-32 h-20 bg-slate-900 rounded-lg border-2 border-emerald-500/30 overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.2)] flex-shrink-0 flex items-center justify-center">
            {nationData.flag_url ? (
              <img src={nationData.flag_url} alt="Flag" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl opacity-30">🏴</span>
            )}
          </div>
          <div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 drop-shadow-sm">
              {nationData.nation_name}
            </h1>
            <p className="text-slate-400 mt-2 font-mono text-sm uppercase tracking-widest font-bold">
              Level {nationData.level} Empire • {nationData.era} Era
            </p>
          </div>
        </div>
        <button 
          onClick={() => { sessionStorage.clear(); window.location.href = '/'; }}
          className="text-sm font-bold bg-slate-900/50 hover:bg-rose-900/50 text-slate-300 hover:text-rose-400 px-6 py-3 rounded-xl border border-slate-700 hover:border-rose-500/50 transition-all backdrop-blur-sm"
        >
          Sign Out
        </button>
      </header>

      {/* Resource HUD */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 relative z-10">
        <ResourceCard title="Population" value={res.population} icon="👥" color="text-blue-400" bgGlow="shadow-[0_0_30px_rgba(96,165,250,0.1)]" />
        <ResourceCard title="Gold" value={res.gold} icon="🪙" color="text-amber-400" bgGlow="shadow-[0_0_30px_rgba(251,191,36,0.1)]" />
        <ResourceCard title="Materials" value={res.materials} icon="🪵" color="text-orange-400" bgGlow="shadow-[0_0_30px_rgba(251,146,60,0.1)]" />
        <ResourceCard title="Tech Points" value={res.tech_points} icon="🔬" color="text-cyan-400" bgGlow="shadow-[0_0_30px_rgba(34,211,238,0.1)]" />
        <ResourceCard title="Culture" value={res.culture} icon="🏛️" color="text-fuchsia-400" bgGlow="shadow-[0_0_30px_rgba(232,121,249,0.1)]" />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 relative z-10">
        
        {/* Left Column: Daily Actions & Active Events */}
        <div className="col-span-1 space-y-6">
          <FlagUploader 
            passcode={nationData.passcode} 
            currentFlag={nationData.flag_url} 
            onFlagUpdate={(url) => setNationData({ ...nationData, flag_url: url })} 
          />
          <ExpeditionEngine />
          
          <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-rose-900/50 shadow-[0_0_40px_rgba(225,29,72,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 to-red-500"></div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="animate-pulse">🚨</span> Active Crises
            </h2>
            {activeEvents.map(event => (
              <div key={event.id} className="bg-rose-950/40 border border-rose-800/50 rounded-xl p-5 mb-3">
                <h3 className="font-bold text-rose-400 text-lg">{event.name}</h3>
                <p className="text-sm text-slate-300 mt-2 font-medium bg-rose-950/50 inline-block px-3 py-1 rounded">
                  Effect: {event.effect}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Columns: City Infrastructure & Upgrades */}
        <div className="col-span-2 space-y-6">
          <BuildingStore 
            nationId={nationData.id} 
            currentGold={res.gold} 
            currentMaterials={res.materials} 
            ownedBuildings={nationData.nation_buildings || []} 
            onPurchaseSuccess={() => {
              // Re-fetch data to update HUD after purchase
              loginWithPasscode(nationData.passcode).then(data => setNationData(data));
            }} 
          />
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ title, value, icon, color, bgGlow }: { title: string, value: number, icon: string, color: string, bgGlow: string }) {
  return (
    <div className={`bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 flex items-center space-x-4 transition-transform hover:scale-105 hover:-translate-y-1 ${bgGlow}`}>
      <div className="text-4xl drop-shadow-md filter">{icon}</div>
      <div>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{title}</p>
        <p className={`text-3xl font-black ${color} drop-shadow-[0_0_10px_currentColor]`}>{value}</p>
      </div>
    </div>
  );
}