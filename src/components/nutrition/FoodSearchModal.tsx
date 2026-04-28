import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Plus, Utensils, Scale } from 'lucide-react';
import { nutritionService } from '../../api/nutritionService';
import { Food } from '../../types/nutrition';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}

const FoodSearchModal: React.FC<FoodSearchModalProps> = ({ isOpen, onClose, date }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState<number>(100);
  const [mealType, setMealType] = useState('Breakfast');
  const [isSearching, setIsSearching] = useState(false);

  const queryClient = useQueryClient();

  const createLogMutation = useMutation({
    mutationFn: (data: { foodId: number; quantity: number; mealType: string; date: string }) =>
      nutritionService.createFoodLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition', date] });
      toast.success('Food logged successfully!');
      onClose();
      resetForm();
    },
    onError: () => {
      toast.error('Failed to log food');
    },
  });

  const resetForm = () => {
    setSearch('');
    setResults([]);
    setSelectedFood(null);
    setQuantity(100);
  };

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await nutritionService.searchFoods(search);
        setResults(data);
      } catch (error) {
        console.error('Search error', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-gray-900 border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-500" />
            Log Food
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!selectedFood ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search for a food (e.g. Chicken Breast)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-800 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  autoFocus
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                {results.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                      {food.imageUrl ? (
                        <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <Utensils className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                        {food.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {food.calories} kcal | P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g (per 100g)
                      </p>
                    </div>
                    <Plus className="w-5 h-5 text-gray-600 group-hover:text-emerald-500 transition-colors" />
                  </button>
                ))}
                {search && results.length === 0 && !isSearching && (
                  <p className="text-center text-gray-500 py-4">No foods found. Try another search.</p>
                )}
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <img src={selectedFood.imageUrl} alt={selectedFood.name} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedFood.name}</h3>
                  <button onClick={() => setSelectedFood(null)} className="text-xs text-emerald-400 hover:underline">
                    Change food
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Scale className="w-3 h-3" /> Quantity (grams)
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Meal Type</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full bg-gray-800 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                  >
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                    <option>Snack</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-2xl border border-white/5">
                <p className="text-sm text-gray-400 mb-2">Estimated Macros ({quantity}g):</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-white font-bold">{Math.round((selectedFood.calories * quantity) / 100)}</p>
                    <p className="text-[10px] text-gray-500 uppercase">kcal</p>
                  </div>
                  <div>
                    <p className="text-white font-bold">{Math.round((selectedFood.protein * quantity) / 100)}g</p>
                    <p className="text-[10px] text-gray-500 uppercase">Prot</p>
                  </div>
                  <div>
                    <p className="text-white font-bold">{Math.round((selectedFood.carbs * quantity) / 100)}g</p>
                    <p className="text-[10px] text-gray-500 uppercase">Carb</p>
                  </div>
                  <div>
                    <p className="text-white font-bold">{Math.round((selectedFood.fats * quantity) / 100)}g</p>
                    <p className="text-[10px] text-gray-500 uppercase">Fat</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => createLogMutation.mutate({ foodId: selectedFood.id, quantity, mealType, date })}
                disabled={createLogMutation.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
              >
                {createLogMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Log this food
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FoodSearchModal;
