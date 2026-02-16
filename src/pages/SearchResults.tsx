import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Car, Bike } from 'lucide-react';
import TripCard from '@/components/TripCard';
import { useQuery } from '@tanstack/react-query';
import { fetchTrips } from '@/lib/api';

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

  return (
    <div className="pb-20">
      <div className="container py-4">
        <h1 className="text-lg font-bold">
          {from && to ? `${from} → ${to}` : 'Tous les trajets'}
        </h1>
        <p className="text-xs text-muted-foreground">
          {sorted.length} trajet{sorted.length > 1 ? 's' : ''} disponible{sorted.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="container mb-4 space-y-3">
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tous', icon: null },
            { value: 'voiture', label: 'Voiture', icon: Car },
            { value: 'moto', label: 'Moto', icon: Bike },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setVehicleFilter(value)}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                vehicleFilter === value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {label}
            </button>
          ))}

          <div className="ml-auto flex gap-2">
            {(['time', 'price', 'rating'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                  sortBy === s ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {s === 'time' ? '🕐' : s === 'price' ? '💰' : '⭐'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Chargement...</div>
        ) : sorted.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Aucun trajet trouvé</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((trip, i) => (
              <TripCard key={trip.id} trip={trip} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
