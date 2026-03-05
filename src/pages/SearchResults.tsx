import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Car, Bike, SlidersHorizontal, Search, ArrowRight } from 'lucide-react';
import TripCard from '@/components/TripCard';
import { useQuery } from '@tanstack/react-query';
import { fetchTrips } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const type = searchParams.get('type') || 'all';

  const [vehicleFilter, setVehicleFilter] = useState<string>(type);
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'rating'>('time');

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['trips', from, to, vehicleFilter],
    queryFn: () => fetchTrips({ from, to, type: vehicleFilter }),
  });

  const sorted = useMemo(() => {
    const arr = [...trips];
    arr.sort((a, b) => {
      if (sortBy === 'price') return a.price_per_seat - b.price_per_seat;
      if (sortBy === 'rating') return (b.driver?.rating ?? 0) - (a.driver?.rating ?? 0);
      return a.departure_time.localeCompare(b.departure_time);
    });
    return arr;
  }, [trips, sortBy]);

  const vehicleFilters = [
    { value: 'all', label: 'Tous', icon: null },
    { value: 'voiture', label: 'Voiture', icon: Car },
    { value: 'moto', label: 'Moto', icon: Bike },
  ];

  const sortOptions = [
    { value: 'time' as const, label: 'Horaire' },
    { value: 'price' as const, label: 'Prix ↑' },
    { value: 'rating' as const, label: 'Note ★' },
  ];

  return (
    <div className="pb-24 min-h-screen">
      {/* Page header */}
      <div className="border-b border-white/5 bg-card/40 backdrop-blur-sm">
        <div className="container py-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="font-display text-2xl font-bold md:text-3xl tracking-tight">
              {from && to ? (
                <div className="flex flex-wrap items-center gap-x-3">
                  <span className="text-foreground">{from}</span>
                  <span className="text-primary/40">
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
                  </span>
                  <span className="text-gradient-mali">{to}</span>
                </div>
              ) : (
                'Tous les trajets'
              )}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                {sorted.length}
              </span>
              <span>trajet{sorted.length > 1 ? 's' : ''} disponible{sorted.length > 1 ? 's' : ''}</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="sticky top-14 z-30 border-y border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="container py-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Vehicle pills */}
            <div className="flex gap-2">
              {vehicleFilters.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setVehicleFilter(value)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${vehicleFilter === value
                    ? 'bg-gradient-mali text-white shadow-mali'
                    : 'border border-white/10 bg-muted/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {label}
                </button>
              ))}
            </div>

            {/* Sort pills */}
            <div className="ml-auto flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              {sortOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSortBy(value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${sortBy === value
                    ? 'bg-primary/15 text-primary ring-1 ring-primary/25'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container py-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <motion.div
                className="h-10 w-10 rounded-full border-2 border-white/10 border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-sm text-muted-foreground">Recherche en cours...</p>
            </motion.div>
          ) : sorted.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-[32px] bg-muted/40 border border-white/10 backdrop-blur-sm">
                  <Search className="h-10 w-10 text-primary/60" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-mali-gold/20 flex items-center justify-center"
                >
                  <div className="h-3 w-3 rounded-full bg-mali-gold shadow-glow-gold" />
                </motion.div>
              </div>
              <h3 className="font-display text-2xl font-bold">Aucun trajet trouvé</h3>
              <p className="mt-3 max-w-xs mx-auto text-sm text-muted-foreground leading-relaxed">
                Nous n'avons pas trouvé de trajets pour cet itinéraire. Essayez de modifier vos filtres ou de rechercher une autre ville.
              </p>
              <button
                onClick={() => setVehicleFilter('all')}
                className="mt-8 rounded-full bg-primary/10 px-6 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary/20"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="visible"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {sorted.map((trip, i) => (
                <TripCard key={trip.id} trip={trip} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchResults;
