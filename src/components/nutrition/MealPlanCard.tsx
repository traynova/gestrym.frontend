import React from 'react';
import { Calendar, ChevronRight, Download } from 'lucide-react';

interface MealPlanCardProps {
  title: string;
  duration: string;
  assignedBy: string;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ title, duration, assignedBy }) => {
  return (
    <div className="group relative bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-emerald-500/50 transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-emerald-500/10 rounded-xl">
          <Calendar className="w-6 h-6 text-emerald-500" />
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Download className="w-5 h-5 text-gray-500 group-hover:text-white" />
        </button>
      </div>
      
      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{title}</h4>
      <p className="text-sm text-gray-400 mb-4">{duration} • Assigned by {assignedBy}</p>
      
      <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest">
        View Details
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};

export default MealPlanCard;
