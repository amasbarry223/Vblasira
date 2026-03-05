import { useState } from 'react';
import { Clock, ArrowRight, Car, Bike, TrendingUp, Leaf, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchMyBookings } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type Tab = 'upcoming' | 'history';

const statusConfig = {
  confirmed: { label: 'Confirmé', className: 'bg-primary/15 text-primary ring-1 ring-primary/25' },
  completed: { label: 'Terminé', className: 'bg-primary/10 text-primary/70 ring-1 ring-primary/15' },
  cancelled: { label: 'Annulé', className: 'bg-destructive/10 text-destructive ring-1 ring-destructive/20' },
  pending: { label: 'En attente', className: 'bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/25' },
};

const MyTrips = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('upcoming');

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['my-bookings', user?.id],
    queryFn: () => fetchMyBookings(user!.id),
    enabled: !!user,
  });

  const upcoming = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');
  const history = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');
  const displayed = tab === 'upcoming' ? upcoming : history;

  const totalSpent = bookings.reduce((s, b) => s + b.total_price, 0);
  const co2Saved = Math.round(bookings.length * 1.5);

  return (
    <div className="pb-24 min-h-screen">
      <div className="container max-w-2xl mx-auto section-padding-sm">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Mes trajets</h1>
          <p className="mt-1 text-sm text-muted-foreground">Suivez vos réservations</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mt-5 grid grid-cols-3 gap-3"
        >
          {[
            { icon: Car, value: `${bookings.length}`, label: 'Trajets', color: 'text-primary', bg: 'bg-primary/10' },
            { icon: TrendingUp, value: `${totalSpent} F`, label: 'Dépensés', color: 'text-amber-400', bg: 'bg-amber-400/10' },
            { icon: Leaf, value: `${co2Saved} kg`, label: 'CO₂ évité', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          ].map(({ icon: Icon, value, label, color, bg }) => (
            <div key={label} className="glass-card flex flex-col items-center rounded-2xl p-4 text-center">
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="text-sm font-bold md:text-base">{value}</div>
              <div className="text-[10px] text-muted-foreground">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="mt-6 flex rounded-2xl border border-white/8 bg-muted/30 p-1">
          {(['upcoming', 'history'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="relative flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200"
            >
              {tab === t && (
                <motion.div
                  layoutId="trips-tab"
                  className="absolute inset-0 rounded-xl bg-card shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <span className={`relative z-10 transition-colors ${tab === t ? 'text-foreground' : 'text-muted-foreground'}`}>
                {t === 'upcoming' ? `À venir (${upcoming.length})` : `Historique (${history.length})`}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <motion.div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-primary"
                animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} />
            </motion.div>
          ) : displayed.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40">
                <MapPin className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <h3 className="font-display font-bold">
                {tab === 'upcoming' ? 'Aucun trajet à venir' : 'Historique vide'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {tab === 'upcoming' ? 'Réservez votre prochain trajet !' : 'Vous n\'avez pas encore voyagé'}
              </p>
            </motion.div>
          ) : (
            <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mt-4 space-y-3"
            >
              {displayed.map((booking, i) => {
                const trip = booking.trip;
                const isMoto = trip.type === 'moto';
                const VehicleIcon = isMoto ? Bike : Car;
                const status = statusConfig[booking.status as keyof typeof statusConfig] ?? statusConfig.pending;

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="glass-card rounded-2xl p-4 transition-all hover:border-primary/20"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{trip.departure_date}</span>
                    </div>

                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${isMoto ? 'bg-amber-400/15' : 'bg-primary/15'}`}>
                        <VehicleIcon className={`h-3.5 w-3.5 ${isMoto ? 'text-amber-400' : 'text-primary'}`} />
                      </div>
                      <span className="truncate text-foreground">{trip.departure_name}</span>
                      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                      <span className="truncate text-muted-foreground">{trip.destination_name}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {trip.departure_time} · {trip.duration_min} min
                      </span>
                      <span className="font-display font-bold text-sm text-gradient-mali">{booking.total_price} FCFA</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyTrips;
