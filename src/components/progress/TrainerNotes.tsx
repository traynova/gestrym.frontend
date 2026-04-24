import React, { useState, useEffect } from 'react';
import { progressService } from '@/api/progressService';
import { TrainerNote } from '@/types/progress';
import { motion } from 'framer-motion';
import { MessageSquarePlus, Send, Activity, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface TrainerNotesProps {
  userId: number | string;
}

export const TrainerNotes: React.FC<TrainerNotesProps> = ({ userId }) => {
  const { user: currentUser } = useAuthStore();
  const [notes, setNotes] = useState<TrainerNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await progressService.getUserTrainerNotes(userId);
      setNotes(res.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchNotes();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setIsSubmitting(true);
      await progressService.createTrainerNote({
        userId: Number(userId),
        message: message.trim(),
      });
      setMessage('');
      await fetchNotes(); // Refrescar notas
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Solo Entrenadores y Gyms pueden añadir notas. (Roles 2 y 3)
  const canAddNote = currentUser?.role_id === 2 || currentUser?.role_id === 3;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden flex flex-col h-[500px]">
      <div className="p-5 border-b border-gray-800 bg-gray-800/30 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquarePlus className="w-5 h-5 text-primary" />
          Notas del Entrenador
        </h3>
        <span className="text-xs font-bold text-gray-500 bg-gray-950 px-3 py-1 rounded-full">
          {notes.length} Notas
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Activity className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-50">
            <MessageSquarePlus className="w-12 h-12 text-gray-500" />
            <p className="text-gray-400 font-medium">Aún no hay notas registradas.</p>
          </div>
        ) : (
          notes.map((note, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={note.id || index}
              className="bg-gray-950 border border-gray-800 rounded-2xl p-4 shadow-sm"
            >
              <p className="text-gray-300 text-sm leading-relaxed">{note.message}</p>
              {note.date && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(note.date).toLocaleDateString('es-ES', { 
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {canAddNote && (
        <div className="p-4 bg-gray-950 border-t border-gray-800">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un consejo o indicación..."
              className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="px-4 py-3 bg-primary text-white rounded-xl font-bold transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center min-w-[56px]"
            >
              {isSubmitting ? <Activity className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
