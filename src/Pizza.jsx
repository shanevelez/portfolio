import React, { useState } from 'react';

const PizzaCalculator = () => {
  const [ballWeight, setBallWeight] = useState(280);
  const [ballCount, setBallCount] = useState(6);
  const [hydration, setHydration] = useState(64.5); // Dynamic Hydration State

  // Baker's Percentages Constants
  const poolishFlourPct = 0.193; 
  const poolishWaterPct = 0.193; 
  const mainFlourPct = 0.807;    
  const saltPct = 0.0257;        
  const yeastPct = 0.002;        
  const honeyPct = 0.002;        

  // Convert the 0-100 UI value to a decimal multiplier
  const currentHydrationPct = hydration / 100;

  // Recalculate the main dough water percentage dynamically
  const mainWaterPct = currentHydrationPct - poolishWaterPct;

  // Recalculate total sum based on the dynamic hydration choice
  const totalPercentageSum = 1 + currentHydrationPct + saltPct + yeastPct + honeyPct; 

  // Calculate targets with your 2% buffer for bowl loss
  const targetDoughWeight = ballWeight * ballCount * 1.02;
  const totalFlour = targetDoughWeight / totalPercentageSum;

  return (
    <div className="min-h-screen w-screen bg-slate-900 text-white font-sans flex flex-col items-center py-12 px-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
        <h2 className="text-3xl font-bold text-sky-300 mb-2 text-center">Poolish Pizza Calculator</h2>
        <p className="text-slate-400 text-sm text-center mb-6">Customizable Hydration | 2.5% Salt Poolish Base</p>
        
        {/* Row 1: Weight and Count */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ball Weight (g)</label>
            <input 
              type="number" 
              value={ballWeight} 
              onChange={(e) => setBallWeight(Number(e.target.value))} 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Number of Balls</label>
            <input 
              type="number" 
              value={ballCount} 
              onChange={(e) => setBallCount(Number(e.target.value))} 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {/* Row 2: Dynamic Hydration Control */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Hydration</label>
            <span className="font-mono text-sky-400 font-bold text-sm">{hydration}%</span>
          </div>
          <div className="flex items-center space-x-4">
            <input 
              type="range" 
              min="60" 
              max="75" 
              step="0.5"
              value={hydration} 
              onChange={(e) => setHydration(Number(e.target.value))} 
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-400 border border-slate-700"
            />
          </div>
        </div>

        <hr className="border-slate-700 mb-6" />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-sky-400 mb-2">Day 1: The Poolish</h3>
            <ul className="bg-slate-900 border border-slate-700/50 rounded-lg p-3 space-y-2 text-slate-300">
              <li className="flex justify-between"><span>Tipo 00 Flour:</span> <span className="font-mono text-white">{Math.round(totalFlour * poolishFlourPct)}g</span></li>
              <li className="flex justify-between"><span>Water:</span> <span className="font-mono text-white">{Math.round(totalFlour * poolishWaterPct)}g</span></li>
              <li className="flex justify-between"><span>Yeast (Instant/ADY):</span> <span className="font-mono text-white">{(totalFlour * yeastPct).toFixed(1)}g</span></li>
              <li className="flex justify-between"><span>Honey:</span> <span className="font-mono text-white">{(totalFlour * honeyPct).toFixed(1)}g</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-sky-400 mb-2">Day 2: Main Dough</h3>
            <ul className="bg-slate-900 border border-slate-700/50 rounded-lg p-3 space-y-2 text-slate-300">
              <li className="flex justify-between"><span>Flour Remainder:</span> <span className="font-mono text-white">{Math.round(totalFlour * mainFlourPct)}g</span></li>
              <li className="flex justify-between"><span>Water Remainder:</span> <span className="font-mono text-white">{Math.max(0, Math.round(totalFlour * mainWaterPct))}g</span></li>
              <li className="flex justify-between"><span>Fine Sea Salt:</span> <span className="font-mono text-white">{Math.round(totalFlour * saltPct)}g</span></li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500 text-center italic">
          Target Yield: {Math.round(targetDoughWeight)}g (includes a 2% bowl loss buffer)
        </p>
      </div>
      
      <a href="/" className="mt-6 text-sm text-slate-400 hover:text-sky-300 transition">
        ← Back to Portfolio
      </a>
    </div>
  );
};

export default PizzaCalculator;