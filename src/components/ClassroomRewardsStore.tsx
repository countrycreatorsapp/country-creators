"use client";
import React, { useState } from 'react';
import { buyClassroomPerk } from '../lib/supabase';

// Classroom Perks Configuration
const CLASSROOM_PERKS = [
  { id: 'hw_pass', name: 'Homework Pass', description: 'Skip one homework assignment entirely.', cost: 500, currency: 'gold', icon: '📝', color: 'amber-400', bg: 'amber-500/20' },
  { id: 'music_pass', name: 'DJ Pass', description: 'Listen to your own music during independent work time.', cost: 200, currency: 'tech_points', icon: '🎧', color: 'cyan-400', bg: 'cyan-500/20' },
  { id: 'seat_pass', name: 'Seat Switch', description: 'Choose any empty seat in the classroom for the day.', cost: 300, currency: 'culture', icon: '🪑', color: 'fuchsia-400', bg: 'fuchsia-500/20' },
  { id: 'snack_pass', name: 'Snack Break', description: 'Eat an approved snack during class time.', cost: 150, currency: 'gold', icon: '🥨', color: 'amber-400', bg: 'amber-500/20' },
];

export default function ClassroomRewardsStore({ 
  nationId, 
  resources, 
  onPurchaseSuccess 
}: { 
  nationId: string, 
  resources: any, 
  onPurchaseSuccess: () => void 
}) {
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const handleBuyPerk = async (perk: typeof CLASSROOM_PERKS[0]) => {
    // Check if they have the specific currency
    const currentFunds = resources[perk.currency] || 0;
    
    if (currentFunds < perk.cost) {
      alert(`You do not have enough ${perk.currency.replace('_', ' ')} for this perk.`);
      return;
    }

    setBuyingId(perk.id);
    try {
      await buyClassroomPerk(nationId, perk.name, perk.cost, perk.currency);
      alert(`Success! You have purchased a ${perk.name}. Tell Mr. Snyder when you want to use it!`);
      onPurchaseSuccess();
    } catch (err) {
      console.error(err);
      alert('Transaction failed. Make sure you have enough resources.');
    }
    setBuyingId(null);
  };

  return (
    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.4)] mt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 flex items-center gap-2">
          <span>🛒</span> Classroom Rewards Store
        </h2>
        <p className="text-sm text-slate-400 mt-1">Spend your hard-earned nation resources on real-world classroom perks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CLASSROOM_PERKS.map((perk) => {
          const currentFunds = resources[perk.currency] || 0;
          const canAfford = currentFunds >= perk.cost;
          
          return (
            <div 
              key={perk.id} 
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                canAfford 
                  ? `bg-slate-800/50 border-slate-700 hover:border-${perk.color.split('-')[0]}-500/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-1` 
                  : 'bg-slate-950/50 border-slate-900 opacity-60 grayscale'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-4xl drop-shadow-md">{perk.icon}</span>
                  <span className={`text-xs font-black px-2 py-1 rounded-md border border-${perk.color.split('-')[0]}-500/30 ${perk.bg} text-${perk.color}`}>
                    {perk.cost} {perk.currency === 'gold' ? '🪙' : perk.currency === 'culture' ? '🏛️' : '🔬'}
                  </span>
                </div>
                <h3 className="font-black text-lg text-white mb-2 leading-tight">{perk.name}</h3>
                <p className="text-xs text-slate-400 mb-4 leading-snug">{perk.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-700/50 mt-auto">
                <button 
                  disabled={!canAfford || buyingId === perk.id}
                  onClick={() => handleBuyPerk(perk)}
                  className={`w-full py-2.5 rounded-lg font-black text-sm flex justify-center items-center transition-all ${
                    canAfford
                      ? `bg-slate-700 text-white hover:bg-${perk.color.split('-')[0]}-600 shadow-md active:scale-95` 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {buyingId === perk.id ? 'Purchasing...' : 'Buy Reward'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}