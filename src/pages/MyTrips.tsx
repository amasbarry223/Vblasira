import { useState } from 'react';
import { Clock, ArrowRight, Car, Bike, TrendingUp, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchMyBookings } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type Tab = 'upcoming' | 'history';

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

  return (
    <div className="pb-20">
      <div className="container py-4">
        <h1 className="mb-4 text-lg font-bold">📋 Mes trajets</h1>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {[
            { icon: Car, value: `${bookings.length}`, label: 'Trajets' },
            { icon: TrendingUp, value: `${bookings.reduce((s, b) => s + b.total_price, 0)} F`, label: 'Dépensés' },
            { icon: Leaf, value: `${Math.round(bookings.length * 1.5)} kg`, label: 'CO₂ évité' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="rounded-lg border border-border bg-card p-3 text-center">
              <Icon className="mx-auto mb-1 h-4 w-4 text-primary" />
              <div className="text-sm font-bold">{value}</div>
              <div className="text-[10px] text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        <div className="mb-4 flex rounded-xl bg-muted p-1">
          {(['upcoming', 'history'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
              {t === 'upcoming' ? `À venir (${upcoming.length})` : `Historique (${history.length})`}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Chargement...</div>
          ) : (tab === 'upcoming' ? upcoming : history).map((booking, i) => {
            const trip = booking.trip;
            const isMoto = trip.type === 'moto';
            return (
              <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    booking.status === 'confirmed' ? 'bg-success/10 text-success' :
                    booking.status === 'completed' ? 'bg-primary/10 text-primary' :
                    booking.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {booking.status === 'confirmed' ? '✅ Confirmé' : booking.status === 'completed' ? '✅ Terminé' : booking.status === 'cancelled' ? '❌ Annulé' : '⏳ En attente'}
                  </span>
                  <span className="text-xs text-muted-foreground">{trip.departure_date}</span>
                </div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  {isMoto ? <Bike className="h-4 w-4 text-secondary-foreground" /> : <Car className="h-4 w-4 text-primary" />}
                  <span className="truncate">{trip.departure_name}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate">{trip.destination_name}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{trip.departure_time} • {trip.duration_min} min</span>
                  <span className="font-semibold text-foreground">{booking.total_price} FCFA</span>
                </div>
              </motion.div>
            );
          })}

          {!isLoading && (tab === 'upcoming' ? upcoming : history).length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {tab === 'upcoming' ? 'Aucun trajet à venir' : 'Aucun historique'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTrips;
