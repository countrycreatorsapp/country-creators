"use client";
import React, { useState } from 'react';

const mockStudents = [
  { passcode: 'purple-dragon-72', name: 'The Republic of Awesome', level: 2, gold: 320, tech: 40, culture: 10 },
  { passcode: 'crimson-wolf-11', name: 'New Sparta', level: 2, gold: 150, tech: 80, culture: 5 },
  { passcode: 'silver-hawk-99', name: 'Atlantis Reborn', level: 1, gold: 400, tech: 10, culture: 25 },
  { passcode: 'golden-bear-44', name: 'The Trading Empire', level: 3, gold: 850, tech: 60, culture: 50 },
];

export default function TeacherCommandCenter() {
  const [targetPasscode, setTargetPasscode] = useState('');
  const [resourceType, setResourceType] = useState('techPoints');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const handleAward = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Awarded ${amount} ${resourceType} to ${targetPasscode} for: ${reason}`);
  };

  const triggerGlobalEvent = (eventName: string) => {
    alert(`GLOBAL EVENT TRIGGERED: ${eventName}. All student dashboards will update instantly.`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans p-8">
      <header className="flex justify-between items-center mb-8 border-b-2 border-slate-300 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Teacher Command Center</h1>
          <p className="text-slate-500 font-medium">Class: 6th Grade Social Studies (Ohio Standards) • Current Unit: Japan</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold border border-emerald-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Live
          </span>
          <button className="text-sm bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">
            Log Out
          </button>
        </div>
      </header>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>⚡</span> Direct Award System
            </h2>
            <p className="text-sm text-slate-500 mb-6">Instantly transfer resources to a student based on class performance.</p>
            <form onSubmit={handleAward} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Passcode</label>
                <input type="text" placeholder="e.g. purple-dragon-72" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm" value={targetPasscode} onChange={(e) => setTargetPasscode(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Resource</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
                    <option value="techPoints">🔬 Tech Points (Quizzes)</option>
                    <option value="gold">🪙 Gold (Homework)</option>
                    <option value="culture">🏛️ Culture (Behavior)</option>
                    <option value="materials">🪵 Materials (Projects)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount</label>
                  <input type="number" placeholder="e.g. 50" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reason (Audit Log)</label>
                <input type="text" placeholder="e.g. Aced the Japan Vocab Quiz" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" value={reason} onChange={(e) => setReason(e.target.value)} required />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md">
                Transmit Resources
              </button>
            </form>
          </div>
          <div className="bg-rose-50 p-6 rounded-xl shadow-sm border border-rose-200">
            <h2 className="text-xl font-bold text-rose-900 mb-2 flex items-center gap-2">
              <span>🌍</span> Global Classroom Events
            </h2>
            <div className="space-y-3 mt-4">
              <button onClick={() => triggerGlobalEvent('The Archipelago Shift')} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-lg flex justify-between items-center transition-colors shadow-sm">
                <span>Trigger: Archipelago Shift (Japan)</span><span>🌋</span>
              </button>
              <button onClick={() => triggerGlobalEvent('Golden Age')} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg flex justify-between items-center transition-colors shadow-sm">
                <span>Trigger: Golden Age (Double Prod)</span><span>✨</span>
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
              <span>🏆</span> Anonymous Class Leaderboard
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                    <th className="pb-3 font-bold">Nation Name</th>
                    <th className="pb-3 font-bold">Passcode</th>
                    <th className="pb-3 font-bold text-center">Lvl</th>
                    <th className="pb-3 font-bold text-right">Gold 🪙</th>
                    <th className="pb-3 font-bold text-right">Tech 🔬</th>
                    <th className="pb-3 font-bold text-right">Culture 🏛️</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockStudents.map((student, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-bold text-slate-800">{student.name}</td>
                      <td className="py-4 font-mono text-sm text-slate-500">{student.passcode}</td>
                      <td className="py-4 text-center font-black text-indigo-600">{student.level}</td>
                      <td className="py-4 text-right font-medium text-yellow-600">{student.gold}</td>
                      <td className="py-4 text-right font-medium text-cyan-600">{student.tech}</td>
                      <td className="py-4 text-right font-medium text-purple-600">{student.culture}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
