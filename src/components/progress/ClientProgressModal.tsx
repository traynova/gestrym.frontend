import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import { ProgressDashboard } from './ProgressDashboard';
import { TrainerNotes } from './TrainerNotes';

interface ClientProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: { id: number; name: string } | null;
}

export const ClientProgressModal: React.FC<ClientProgressModalProps> = ({ isOpen, onClose, client }) => {
  if (!client) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-7xl h-[90vh] bg-gray-950 rounded-3xl border border-gray-800 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800 bg-gray-900 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Progreso de Cliente</h2>
                  <p className="text-gray-400 text-sm font-bold">{client.name}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-2xl transition-colors border border-transparent hover:border-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Side: Progress & Comparisons (Takes 8 columns) */}
                <div className="xl:col-span-8">
                  <ProgressDashboard userId={client.id} />
                </div>

                {/* Right Side: Trainer Notes (Takes 4 columns) */}
                <div className="xl:col-span-4">
                  <div className="sticky top-0">
                    <TrainerNotes userId={client.id} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
