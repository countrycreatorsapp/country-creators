"use client";
import React, { useEffect, useState } from 'react';
import { teacherAwardPoints, getClassroomLeaderboard, recoverPasscode } from '../../lib/supabase';

export default function TeacherCommandCenter() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Award State
  const [quickAmount, setQuickAmount] = useState<number>(10);
  const [quickReason, setQuickReason] = useState('Great Participation');

  // Search/Recovery State
  const [searchQuery, setSearchQuery] = useState('');
  const [recoveryResult, setRecoveryResult] = useState<any[] | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await getClassroomLeaderboard();
      // Format data
      const formatted = data.map((n: any) => ({
        passcode: n.passcode,
        name: n.nation_name,
        level: n.level,
        flag_url: n.flag_url,
        gold: n.resources?.[0]?.gold || 0,
        tech: n.resources?.[0]?.tech_points || 0,
        culture: n.resources?.[0]?.culture || 0,
        materials: n.resources?.[0]?.materials || 0,
      }));
      // Default sort by Culture (Participation)
      formatted.sort((a, b) => b.culture - a.culture);
      setStudents(formatted);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleQuickAward = async (passcode: string, resource: string, amount: number) => {
    try {
      await teacherAwardPoints(passcode, resource, amount, quickReason);
      // Optimistically update UI
      setStudents(students.map(s => {
        if (s.passcode === passcode) {
          return { ...s, [resource]: s[resource as keyof typeof s] + amount };
        }
        return s;
      }));
    } catch (err) {
      alert('Failed to award points.');
    }
  };

  const handleRecoverySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const result = await recoverPasscode(searchQuery);
      setRecoveryResult(result);
    } catch (err) {
      alert('Search failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-8">
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Teacher Command Center
          </h1>
          <p className="text-slate-400 font-medium mt-1">Live Classroom Analytics & Economy Engine</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-emerald-900/30 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM ONLINE
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Column: Quick Controls */}
        <div className="col-span-1 space-y-6">
          
          {/* Quick Settings Panel */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>⚙️</span> Fast Action Settings
            </h2>
            <p className="text-xs text-slate-400 mb-4">Set your default award amount for the buttons on the leaderboard.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Default Award Amount</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Audit Log Reason</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 text-sm"
                  value={quickReason}
                  onChange={(e) => setQuickReason(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Passcode Recovery Tool */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🔍</span> Passcode Recovery
            </h2>
            <p className="text-xs text-slate-400 mb-4">A student lost their slip? Search by their Nation's Name.</p>
            <form onSubmit={handleRecoverySearch} className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Republic of Awesome"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg font-bold">Find</button>
            </form>
            
            {recoveryResult && recoveryResult.length > 0 && (
              <div className="mt-4 space-y-2">
                {recoveryResult.map((r, idx) => (
                  <div key={idx} className="bg-indigo-950/30 border border-indigo-800 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-sm font-bold truncate pr-2">{r.nation_name}</span>
                    <span className="text-xs font-mono bg-slate-950 px-2 py-1 rounded text-slate-300 border border-slate-700">{r.passcode}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: The Live Fast-Action Leaderboard */}
        <div className="col-span-3">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md shadow-lg min-h-full">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🏆</span> Live Classroom Economy (Sorted by Culture)
              </h2>
              <button onClick={loadLeaderboard} className="text-sm text-emerald-400 font-bold hover:text-emerald-300">Refresh Data 🔄</button>
            </div>

            {loading ? (
              <div className="text-center py-20 text-slate-500">Loading Live Database...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                      <th className="pb-3 pl-4 font-bold w-12">Flag</th>
                      <th className="pb-3 font-bold">Nation Name</th>
                      <th className="pb-3 font-bold text-center">Gold 🪙</th>
                      <th className="pb-3 font-bold text-center">Tech 🔬</th>
                      <th className="pb-3 font-bold text-center">Culture 🏛️</th>
                      <th className="pb-3 font-bold text-center">Materials 🪵</th>
                      <th className="pb-3 font-bold text-right pr-4">Fast Actions (Give +{quickAmount})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {students.map((student, index) => (
                      <tr key={index} className="hover:bg-slate-800/50 transition-colors group">
                        <td className="py-3 pl-4">
                           <div className="w-8 h-6 bg-slate-800 rounded border border-slate-700 overflow-hidden flex items-center justify-center text-xs">
                             {student.flag_url ? <img src={student.flag_url} className="w-full h-full object-cover" /> : '🏴'}
                           </div>
                        </td>
                        <td className="py-3 font-bold text-slate-200">
                          {student.name}
                          <div className="text-[10px] text-slate-500 font-mono font-normal opacity-0 group-hover:opacity-100 transition-opacity">Passcode: {student.passcode}</div>
                        </td>
                        <td className="py-3 text-center font-medium text-amber-400">{student.gold}</td>
                        <td className="py-3 text-center font-medium text-cyan-400">{student.tech}</td>
                        <td className="py-3 text-center font-medium text-fuchsia-400">{student.culture}</td>
                        <td className="py-3 text-center font-medium text-orange-400">{student.materials}</td>
                        
                        {/* Fast Action Buttons */}
                        <td className="py-3 text-right pr-4">
                          <div className="flex justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleQuickAward(student.passcode, 'gold', quickAmount)} className="bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 border border-amber-500/30 px-2 py-1 rounded text-xs font-bold transition-colors" title="Give Gold">🪙</button>
                            <button onClick={() => handleQuickAward(student.passcode, 'tech_points', quickAmount)} className="bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded text-xs font-bold transition-colors" title="Give Tech">🔬</button>
                            <button onClick={() => handleQuickAward(student.passcode, 'culture', quickAmount)} className="bg-fuchsia-500/20 hover:bg-fuchsia-500/40 text-fuchsia-400 border border-fuchsia-500/30 px-2 py-1 rounded text-xs font-bold transition-colors" title="Give Culture">🏛️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}