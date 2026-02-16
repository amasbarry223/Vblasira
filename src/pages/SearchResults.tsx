import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Car, Bike, SlidersHorizontal } from 'lucide-react';
import TripCard from '@/components/TripCard';
import { mockTrips } from '@/lib/mock-data';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const type = searchParams.get('type') || 'all';

  const [vehicleFilter, setVehicleFilter] = useState<string>(type);
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'rating'>('time');

  const filtered = useMemo(() => {
    let trips = [...mockTrips];

    if (from) {
      trips = trips.filter((t) =>
        t.departure_name.toLowerCase().includes(from.toLowerCase())
      );
    }
    if (to) {
      trips = trips.filter((t) =>
        t.destination_name.toLowerCase().includes(to.toLowerCase())
      );
    }
    if (vehicleFilter !== 'all') {
      trips = trips.filter((t) => t.type === vehicleFilter);
    }

    // If no filters matched, show all trips
    if (trips.length === 0) trips = [...mockTrips];

    trips.sort((a, b) => {
      if (sortBy === 'price') return a.price_per_seat - b.price_per_seat;
      if (sortBy === 'rating') return b.driver.rating - a.driver.rating;
      return a.departure_time.localeCompare(b.departure_time);
    });

    return trips;
  }, [from, to, vehicleFilter, sortBy]);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="container py-4">
        <h1 className="text-lg font-bold">
          {from && to ? `${from} → ${to}` : 'Tous les trajets'}
        </h1>
        <p className="text-xs text-muted-foreground">{filtered.length} trajet{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
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

      {/* Results */}
      <div className="container space-y-3">
        {filtered.map((trip, i) => (
          <TripCard key={trip.id} trip={trip} index={i} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
