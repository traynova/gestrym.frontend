import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface MacroCardProps {
  totals: { calories: number; protein: number; carbs: number; fats: number };
  goals: { calories: number; protein: number; carbs: number; fats: number };
  progress: { caloriesPct: number; proteinPct: number; carbsPct: number; fatsPct: number };
}

const MacroCard: React.FC<MacroCardProps> = ({ totals, goals, progress }) => {
  const data = [
    { name: 'Consumed', value: Math.min(totals.calories, goals.calories) },
    { name: 'Remaining', value: Math.max(0, goals.calories - totals.calories) },
  ];

  const COLORS = ['#10b981', '#1f2937']; // Emerald-500 and Gray-800

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
      <h3 className="text-xl font-bold text-white mb-6">Daily Macros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Donut Chart */}
        <div className="relative h-48 w-48 mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={COLORS[0]} />
                <Cell fill={COLORS[1]} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white">{totals.calories}</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">kcal / {goals.calories}</span>
          </div>
        </div>

        {/* Macro Bars */}
        <div className="space-y-6">
          <MacroBar 
            label="Protein" 
            current={totals.protein} 
            goal={goals.protein} 
            pct={progress.proteinPct} 
            color="bg-blue-500" 
          />
          <MacroBar 
            label="Carbs" 
            current={totals.carbs} 
            goal={goals.carbs} 
            pct={progress.carbsPct} 
            color="bg-yellow-500" 
          />
          <MacroBar 
            label="Fats" 
            current={totals.fats} 
            goal={goals.fats} 
            pct={progress.fatsPct} 
            color="bg-red-500" 
          />
        </div>
      </div>
    </div>
  );
};

interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  pct: number;
  color: string;
}

const MacroBar: React.FC<MacroBarProps> = ({ label, current, goal, pct, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <span className="text-xs text-gray-500">
        <span className="text-white font-bold">{current}g</span> / {goal}g
      </span>
    </div>
    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(pct, 100)}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color} rounded-full`}
      />
    </div>
  </div>
);

export default MacroCard;
