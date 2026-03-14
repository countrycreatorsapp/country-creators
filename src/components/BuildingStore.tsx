"use client";
import React, { useState } from 'react';
import { buyBuilding } from '../lib/supabase';

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
    unlocked: false, 
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

export default function BuildingStore({ 
  nationId, 
  currentGold, 
  currentMaterials, 
  ownedBuildings, 
  onPurchaseSuccess 
}: { 
  nationId: string, 
  currentGold: number, 
  currentMaterials: number, 
  ownedBuildings: any[], 
  onPurchaseSuccess: () => void 
}) {
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const handleBuy = async (b: any) => {
    if (currentGold < b.cost.gold || currentMaterials < b.cost.materials) {
      alert("You don't have enough resources for this.");
      return;
    }
    setBuyingId(b.id);
    try {
      await buyBuilding(nationId, b.id, b.cost.gold, b.cost.materials);
      onPurchaseSuccess(); // Triggers a re-fetch of the dashboard data
    } catch (err) {
      console.error(err);
      alert('Transaction failed.');
    }
    setBuyingId(null);
  };

  const ownedSet = new Set(ownedBuildings?.map(ob => ob.building_id) || []);

  return (
    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-2">
          <span>🏗️</span> City Infrastructure
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/30 font-black shadow-inner">
            {currentGold} 🪙
          </span>
          <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg border border-orange-500/30 font-black shadow-inner">
            {currentMaterials} 🪵
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BUILDINGS.map((b) => {
          const isOwned = ownedSet.has(b.id);
          const canAfford = currentGold >= b.cost.gold && currentMaterials >= b.cost.materials;
          const isLocked = !b.unlocked || isOwned;
          
          return (
            <div 
              key={b.id} 
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                isOwned ? 'bg-emerald-900/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' :
                b.unlocked 
                  ? 'bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:-translate-y-1' 
                  : 'bg-slate-950/50 border-slate-900 opacity-60 grayscale'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl drop-shadow-md">{b.icon}</span>
                    <h3 className="font-black text-lg text-white">{b.name}</h3>
                  </div>
                  {isOwned && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-bold border border-emerald-500/50">OWNED</span>}
                </div>
                <p className="text-sm text-slate-400 mb-4 h-12 leading-snug">{b.description}</p>
              </div>

              <div className="border-t border-slate-700/50 pt-4 mt-2">
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-cyan-400 font-bold bg-cyan-950/30 px-2 py-1 rounded-md">{b.benefit}</span>
                  {!b.unlocked && (
                    <span className="text-rose-400 text-[10px] uppercase font-black tracking-widest">{b.requirement}</span>
                  )}
                </div>
                
                {!isOwned && (
                  <button 
                    disabled={isLocked || !canAfford || buyingId === b.id}
                    onClick={() => handleBuy(b)}
                    className={`w-full py-3 rounded-lg font-black text-sm flex justify-center items-center space-x-3 transition-all ${
                      b.unlocked && canAfford
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 shadow-md active:scale-95' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{buyingId === b.id ? 'Constructing...' : 'Build:'}</span>
                    {b.cost.gold > 0 && <span className={!canAfford && currentGold < b.cost.gold ? 'text-rose-400 line-through' : ''}>{b.cost.gold} 🪙</span>}
                    {b.cost.materials > 0 && <span className={!canAfford && currentMaterials < b.cost.materials ? 'text-rose-400 line-through' : ''}>{b.cost.materials} 🪵</span>}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}