import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Brain, CheckCircle2 } from 'lucide-react';
import { nutritionService } from '../../api/nutritionService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const AIAdjustmentPanel: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [adjustmentNote, setAdjustmentNote] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  const adjustMutation = useMutation({
    mutationFn: () => nutritionService.adjustGoals(),
    onSuccess: (response) => {
      setAdjustmentNote(response.data.adjustmentNote);
      queryClient.invalidateQueries({ queryKey: ['nutrition'] });
      toast.success('Macros adjusted by AI!');
    },
    onError: () => {
      toast.error('Failed to adjust macros');
      setIsAnalyzing(false);
    },
  });

  const handleAdjust = async () => {
    setIsAnalyzing(true);
    // Artificial delay to show "analyzing" feel
    await new Promise(resolve => setTimeout(resolve, 2500));
    adjustMutation.mutate();
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Decorative gradient orb */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-all duration-1000" />
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 font-bold tracking-wider text-xs uppercase">
            <Sparkles className="w-4 h-4" />
            AI Powered Adaptation
          </div>
          <h3 className="text-2xl font-black text-white">Smart Macro Adjustment</h3>
          <p className="text-gray-400 text-sm max-w-sm">
            Our AI analyzes your recent weight progress and training intensity to recalibrate your nutritional targets.
          </p>
        </div>

        <button
          onClick={handleAdjust}
          disabled={isAnalyzing}
          className={`
            relative group px-8 py-4 rounded-2xl font-bold text-white transition-all overflow-hidden
            ${isAnalyzing ? 'bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-900/40'}
          `}
        >
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3"
              >
                <div className="flex gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-1.5 bg-white rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-white rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-white rounded-full"
                  />
                </div>
                <span>Analyzing Progress...</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                <span>Optimize Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Success Result */}
      <AnimatePresence>
        {adjustmentNote && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            className="border-t border-white/10 pt-6"
          >
            <div className="flex items-start gap-4 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="text-emerald-400 font-bold text-sm">System recalibrated!</h4>
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "{adjustmentNote}"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAdjustmentPanel;
