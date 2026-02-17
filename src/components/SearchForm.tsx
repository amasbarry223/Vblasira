import { useState } from 'react';
import { MapPin, Calendar, Car, Bike, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { quartiers, universities } from '@/lib/api';
import { motion } from 'framer-motion';

interface SearchFormProps {
  compact?: boolean;
}

const SearchForm = ({ compact = false }: SearchFormProps) => {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<'today' | 'tomorrow' | 'other'>('tomorrow');
  const [vehicleType, setVehicleType] = useState<'all' | 'voiture' | 'moto'>('all');
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const filteredDepartures = quartiers.filter((l) => l.toLowerCase().includes(departure.toLowerCase()));
  const filteredDests = universities.filter((l) => l.toLowerCase().includes(destination.toLowerCase()));

  const handleSearch = () => {
    navigate(`/search?from=${encodeURIComponent(departure)}&to=${encodeURIComponent(destination)}&type=${vehicleType}&date=${date}`);
  };

  return (
    <div className={`rounded-2xl bg-card p-4 shadow-lg ${compact ? '' : 'border border-border'}`}>
      {!compact && <h2 className="mb-4 text-lg font-bold">🔍 Où allez-vous ?</h2>}
      <div className="space-y-3">
        {/* Departure */}
        <div className="relative">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <input type="text" placeholder="📍 Départ" value={departure} onChange={(e) => { setDeparture(e.target.value); setShowDepartureSuggestions(e.target.value.length >= 1); }} onFocus={() => setShowDepartureSuggestions(departure.length >= 1)} onBlur={() => setTimeout(() => setShowDepartureSuggestions(false), 200)} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          {showDepartureSuggestions && filteredDepartures.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
              {filteredDepartures.map((loc) => (
                <button key={loc} className="block w-full px-3 py-2 text-left text-sm hover:bg-muted" onMouseDown={() => { setDeparture(loc); setShowDepartureSuggestions(false); }}>{loc}</button>
              ))}
            </div>
          )}
        </div>

        {/* Destination */}
        <div className="relative">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-mali-red" />
            <input type="text" placeholder="📍 Arrivée" value={destination} onChange={(e) => { setDestination(e.target.value); setShowDestSuggestions(e.target.value.length >= 1); }} onFocus={() => setShowDestSuggestions(destination.length >= 1)} onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          {showDestSuggestions && filteredDests.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
              {filteredDests.map((loc) => (
                <button key={loc} className="block w-full px-3 py-2 text-left text-sm hover:bg-muted" onMouseDown={() => { setDestination(loc); setShowDestSuggestions(false); }}>{loc}</button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <div className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Quand ?</div>
          <div className="flex gap-2">
            {(['today', 'tomorrow', 'other'] as const).map((d) => (
              <button key={d} onClick={() => setDate(d)} className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${date === d ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                {d === 'today' ? "Aujourd'hui" : d === 'tomorrow' ? 'Demain' : 'Autre'}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle type */}
        <div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">🚗 Type de véhicule</div>
          <div className="flex gap-2">
            {[
              { value: 'all' as const, label: 'Tous', icon: null },
              { value: 'voiture' as const, label: 'Voiture', icon: Car },
              { value: 'moto' as const, label: 'Moto', icon: Bike },
            ].map(({ value, label, icon: Icon }) => (
              <button key={value} onClick={() => setVehicleType(value)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${vehicleType === value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
              </button>
            ))}
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.97 }} onClick={handleSearch} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-mali py-3 text-sm font-bold text-primary-foreground shadow-mali transition-shadow hover:shadow-lg">
          <Search className="h-4 w-4" />
          Rechercher des trajets
        </motion.button>
      </div>
    </div>
  );
};

export default SearchForm;
