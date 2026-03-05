import { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Car, Bike, Search, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { quartiers, universities } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFormProps {
  compact?: boolean;
  /** Layout style BlaBlaCar: horizontal row + white card, for hero */
  variant?: 'default' | 'hero';
}

const SearchForm = ({ compact = false, variant = 'default' }: SearchFormProps) => {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<'today' | 'tomorrow' | 'other'>('tomorrow');
  const [vehicleType, setVehicleType] = useState<'all' | 'voiture' | 'moto'>('all');
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredDepartures = quartiers.filter((l) => l.toLowerCase().includes(departure.toLowerCase()));
  const filteredDests = universities.filter((l) => l.toLowerCase().includes(destination.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDepartureSuggestions(false);
        setShowDestSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const finalDate = date === 'other' ? customDate : date;
    navigate(`/search?from=${encodeURIComponent(departure)}&to=${encodeURIComponent(destination)}&type=${vehicleType}&date=${finalDate}`);
  };

  const handleSwap = () => {
    setDeparture(destination);
    setDestination(departure);
  };

  if (variant === 'hero') {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-20 mx-auto w-full max-w-5xl px-4"
          ref={containerRef}
        >
          <div className="group/form relative overflow-hidden rounded-[40px] bg-card p-2 shadow-glow-premium border border-border transition-all duration-500 hover:shadow-xl">
            <div className="flex flex-col gap-2 p-3 md:flex-row md:items-center md:gap-3 lg:p-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="relative flex-[1.5] min-w-0"
              >
                <div className="flex h-14 w-full items-center gap-3 rounded-3xl bg-muted/30 px-5 transition-all focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 border border-border/50">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Départ</span>
                    <input
                      type="text"
                      placeholder="D'où partez-vous ?"
                      value={departure}
                      onChange={(e) => { setDeparture(e.target.value); setShowDepartureSuggestions(e.target.value.length >= 1); }}
                      onFocus={() => setShowDepartureSuggestions(departure.length >= 1)}
                      className="w-full bg-transparent text-sm font-bold text-foreground placeholder:text-muted-foreground/60 focus:outline-none md:text-base"
                    />
                  </div>
                </div>
                <AnimatePresence>
                  {departure && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      type="button"
                      onClick={() => { setDeparture(''); setShowDepartureSuggestions(false); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted/50 transition-colors z-10"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
                {showDepartureSuggestions && filteredDepartures.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 right-0 top-full z-30 mt-3 max-h-60 overflow-y-auto rounded-2xl border border-border bg-card py-2 shadow-2xl ring-1 ring-black/10"
                  >
                    {filteredDepartures.map((loc) => (
                      <button key={loc} type="button" className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted transition-colors group/item" onClick={() => { setDeparture(loc); setShowDepartureSuggestions(false); }}>
                        <MapPin className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                        <span className="font-medium">{loc}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
                type="button"
                onClick={handleSwap}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted/30 border border-border/50 transition-all hover:bg-primary/10 hover:border-primary/30 hover:shadow-glow-sm hover:scale-110 active:scale-90 active:rotate-180 md:-mx-2 group"
              >
                <ArrowUpDown className="h-5 w-5 rotate-90 text-muted-foreground group-hover:text-primary transition-colors md:rotate-0" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="relative flex-[1.5] min-w-0"
              >
                <div className="flex h-14 w-full items-center gap-3 rounded-3xl bg-muted/30 px-5 transition-all focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 border border-border/50">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Arrivée</span>
                    <input
                      type="text"
                      placeholder="Où allez-vous ?"
                      value={destination}
                      onChange={(e) => { setDestination(e.target.value); setShowDestSuggestions(e.target.value.length >= 1); }}
                      onFocus={() => setShowDestSuggestions(destination.length >= 1)}
                      className="w-full bg-transparent text-sm font-bold text-foreground placeholder:text-muted-foreground/60 focus:outline-none md:text-base"
                    />
                  </div>
                </div>
                <AnimatePresence>
                  {destination && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      type="button"
                      onClick={() => { setDestination(''); setShowDestSuggestions(false); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted/50 transition-colors z-10"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
                {showDestSuggestions && filteredDests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 right-0 top-full z-30 mt-3 max-h-60 overflow-y-auto rounded-2xl border border-border bg-card py-2 shadow-2xl ring-1 ring-black/10"
                  >
                    {filteredDests.map((loc) => (
                      <button key={loc} type="button" className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted transition-colors group/item" onClick={() => { setDestination(loc); setShowDestSuggestions(false); }}>
                        <MapPin className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                        <span className="font-medium">{loc}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-col gap-2 rounded-2xl border border-border/50 bg-muted/30 px-4 py-3 md:min-w-[220px] transition-all duration-300 hover:bg-muted/50 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-card"
              >
                <div className="flex h-14 w-full items-center gap-3 rounded-3xl bg-muted/30 px-5 transition-all focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 border border-border/50">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <button
                      className={`rounded-xl px-2.5 py-1 text-[10px] font-black tracking-tighter transition-all ${date === 'today' ? 'bg-primary text-white shadow-sm' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                      onClick={() => setDate('today')}
                    >
                      AUJ.
                    </button>
                    <button
                      className={`rounded-xl px-2.5 py-1 text-[10px] font-black tracking-tighter transition-all ${date === 'tomorrow' ? 'bg-primary text-white shadow-sm' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                      onClick={() => setDate('tomorrow')}
                    >
                      DEMAIN
                    </button>
                    <button
                      className={`rounded-xl px-2.5 py-1 text-[10px] font-black tracking-tighter transition-all ${date === 'other' ? 'bg-primary text-white shadow-sm' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                      onClick={() => setDate('other')}
                    >
                      AUTRE
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {date === 'other' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="date"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-transparent text-sm font-medium outline-none py-1.5 text-primary"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: 'spring' }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px hsla(var(--primary), 0.5)' }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleSearch}
                className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-5 text-base font-extrabold text-white shadow-glow-sm transition-all md:shrink-0"
              >
                <Search className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <div className={compact ? 'space-y-3' : 'rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5'}>
      {!compact && <h2 className="mb-4 text-lg font-bold">Où allez-vous ?</h2>}
      <div className="space-y-3">
        {/* Departure */}
        <div className="relative">
          <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <input type="text" placeholder="Départ" value={departure} onChange={(e) => { setDeparture(e.target.value); setShowDepartureSuggestions(e.target.value.length >= 1); }} onFocus={() => setShowDepartureSuggestions(departure.length >= 1)} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          {showDepartureSuggestions && filteredDepartures.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
              {filteredDepartures.map((loc) => (
                <button key={loc} type="button" className="block w-full px-3 py-2 text-left text-sm hover:bg-muted" onClick={() => { setDeparture(loc); setShowDepartureSuggestions(false); }}>{loc}</button>
              ))}
            </div>
          )}
        </div>

        {/* Destination */}
        <div className="relative">
          <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <MapPin className="h-4 w-4 shrink-0 text-mali-red" />
            <input type="text" placeholder="Arrivée" value={destination} onChange={(e) => { setDestination(e.target.value); setShowDestSuggestions(e.target.value.length >= 1); }} onFocus={() => setShowDestSuggestions(destination.length >= 1)} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          {showDestSuggestions && filteredDests.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
              {filteredDests.map((loc) => (
                <button key={loc} type="button" className="block w-full px-3 py-2 text-left text-sm hover:bg-muted" onClick={() => { setDestination(loc); setShowDestSuggestions(false); }}>{loc}</button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <div className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Quand ?</div>
          <div className="flex gap-2">
            {(['today', 'tomorrow', 'other'] as const).map((d) => (
              <button key={d} type="button" onClick={() => setDate(d)} className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${date === d ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                {d === 'today' ? "Aujourd'hui" : d === 'tomorrow' ? 'Demain' : 'Autre'}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle type */}
        <div>
          <div className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">Type de véhicule</div>
          <div className="flex gap-2">
            {[
              { value: 'all' as const, label: 'Tous', icon: null },
              { value: 'voiture' as const, label: 'Voiture', icon: Car },
              { value: 'moto' as const, label: 'Moto', icon: Bike },
            ].map(({ value, label, icon: Icon }) => (
              <button key={value} type="button" onClick={() => setVehicleType(value)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${vehicleType === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
              </button>
            ))}
          </div>
        </div>

        <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={handleSearch} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-mali py-3 text-sm font-semibold text-primary-foreground shadow-mali transition-all hover:opacity-95 hover:shadow-lg">
          <Search className="h-4 w-4" />
          Rechercher des trajets
        </motion.button>
      </div>
    </div>
  );
};

export default SearchForm;
