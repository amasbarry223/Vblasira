import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Shield, Car, Bike, Users, Phone, MessageCircle, CreditCard, Wallet, Banknote, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { fetchTripById, createBooking } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import AuroraBackground from '@/components/AuroraBackground';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [seats, setSeats] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'orange_money' | 'moov_money'>('cash');
  const [booking, setBooking] = useState(false);

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => fetchTripById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <MapPin className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-xl font-bold">Trajet introuvable</h1>
        <p className="mt-2 text-muted-foreground">Ce trajet a peut-être été annulé ou est complet.</p>
        <button
          onClick={() => navigate('/search')}
          className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90"
        >
          Retourner à la recherche
        </button>
      </div>
    );
  }

  const isMoto = trip.type === 'moto';
  const VehicleIcon = isMoto ? Bike : Car;
  const totalPrice = trip.price_per_seat * seats;

  const handleConfirm = async () => {
    if (!user) {
      navigate('/auth', { state: { from: `/trip/${id}` } });
      return;
    }
    setBooking(true);
    try {
      await createBooking({
        trip_id: trip.id,
        passenger_id: user.id,
        seats_booked: seats,
        total_price: totalPrice,
        payment_method: paymentMethod,
      });
      toast.success('🎉 Réservation confirmée !', {
        description: `De ${trip.departure_name} vers ${trip.destination_name}`,
      });
      setShowConfirm(false);
      navigate('/my-trips');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la réservation');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="pb-32 bg-background min-h-screen">
      {/* Immersive Header Backdrop */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background z-0" />
        <AuroraBackground className="absolute inset-0 opacity-40" intensity="low" />
        <div className="container relative z-10 py-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-black/40"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Retour
          </motion.button>
        </div>
      </div>

      <div className="container relative z-20 -mt-20 max-w-2xl mx-auto px-4 space-y-6">
        {/* Vehicle Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-wrap items-center gap-3"
        >
          <div className="glass-card flex items-center gap-2 rounded-full px-4 py-2 border-primary/20 bg-primary/5">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isMoto ? 'bg-amber-400/20 text-amber-400' : 'bg-primary/20 text-primary'}`}>
              <VehicleIcon className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-foreground">
              {isMoto ? 'MOTO' : 'VOITURE'}
            </span>
            <span className="text-sm text-muted-foreground border-l border-white/10 pl-2">
              {trip.vehicle_info}
            </span>
          </div>

          {isMoto && trip.helmet_provided && (
            <div className="glass-card flex items-center gap-2 rounded-full px-4 py-2 border-emerald-500/20 bg-emerald-500/5">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">Casque fourni</span>
            </div>
          )}
        </motion.div>

        {/* Route Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="glass-premium overflow-hidden rounded-[2rem] p-8 shadow-2xl relative group/route"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-50" />

          <div className="relative flex items-stretch gap-8">
            <div className="flex flex-col items-center justify-between py-2">
              <div className="relative h-5 w-5">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
                <div className="relative h-4 w-4 rounded-full border-2 border-primary bg-background shadow-glow-green" />
              </div>
              <div className="w-0.5 grow bg-gradient-to-b from-primary via-primary/50 to-emerald-500 my-1 rounded-full" />
              <div className="h-4 w-4 rounded-full border-2 border-emerald-500 bg-background shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
            </div>

            <div className="flex-1 space-y-8">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Départ</span>
                  <span className="text-sm font-bold text-primary">{trip.departure_time}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mt-1">{trip.departure_name}</h3>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Arrivée</span>
                  <span className="text-sm font-bold text-emerald-400">Arrivée prévue</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mt-1">{trip.destination_name}</h3>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-4 border-t border-white/5 pt-6 text-center">
            <div className="space-y-1">
              <div className="flex justify-center"><Clock className="h-4 w-4 text-muted-foreground" /></div>
              <div className="text-xs font-bold">{trip.duration_min} min</div>
              <div className="text-[10px] text-muted-foreground uppercase opacity-60">Durée</div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-center text-muted-foreground">📍</div>
              <div className="text-xs font-bold">{trip.distance_km} km</div>
              <div className="text-[10px] text-muted-foreground uppercase opacity-60">Distance</div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-center text-muted-foreground">📅</div>
              <div className="text-xs font-bold">{trip.departure_date}</div>
              <div className="text-[10px] text-muted-foreground uppercase opacity-60">Date</div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-center"><Users className="h-4 w-4 text-muted-foreground" /></div>
              <div className="text-xs font-bold">{trip.seats_available} / {trip.seats_total}</div>
              <div className="text-[10px] text-muted-foreground uppercase opacity-60">Places</div>
            </div>
          </div>
        </motion.div>

        {/* Driver Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-card group rounded-[2rem] p-7 shadow-xl border-white/5 hover:border-primary/20 transition-all duration-500"
        >
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0">
              <img
                src={trip.driver.avatar_url || `https://ui-avatars.com/api/?name=${trip.driver.name}&background=1A1A1A&color=FFF`}
                alt={trip.driver.name}
                className="h-full w-full rounded-2xl object-cover ring-4 ring-white/5 group-hover:ring-primary/20 transition-all duration-700"
              />
              {trip.driver.verification_status === 'verified' && (
                <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-glow-green ring-4 ring-card animate-pulse">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground text-lg">{trip.driver.name}</h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                  Étudiant
                </span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                🎓 {trip.driver.university}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-xs font-bold text-amber-400">
                  <Star className="h-3 w-3 fill-amber-400" />
                  {trip.driver.rating}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">{trip.driver.total_trips}</span> trajets effectués
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/10">
              <Phone className="h-4 w-4" /> Appeler
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 py-3 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </button>
          </div>
        </motion.div>

        {/* Pricing & Seat Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass-premium rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Banknote className="h-24 w-24 -rotate-12" />
          </div>

          <div className="relative flex flex-col items-center mb-10">
            <div className="text-5xl font-extrabold text-foreground font-display tracking-tight">
              {trip.price_per_seat.toLocaleString()}
              <span className="text-xl font-bold text-gradient-mali ml-2">FCFA</span>
            </div>
            <div className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mt-2 opacity-50">par place</div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-sm font-bold text-foreground">Nombre de places</label>
              <span className="text-xs text-muted-foreground">{trip.seats_available} disponibles</span>
            </div>

            <div className="flex gap-2">
              {Array.from({ length: Math.min(trip.seats_available, 4) }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setSeats(n)}
                  className={`flex-1 rounded-2xl border-2 py-3 text-base font-black transition-all ${seats === n
                    ? 'border-primary bg-primary/10 text-primary shadow-glow-green scale-[1.02]'
                    : 'border-white/5 bg-muted/30 text-muted-foreground hover:border-white/10 hover:bg-muted/50'
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {seats > 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 flex items-center justify-between rounded-2xl bg-primary/5 px-4 py-3 border border-primary/10"
              >
                <span className="text-sm font-medium text-muted-foreground">Total à payer</span>
                <span className="text-lg font-black text-foreground">{totalPrice.toLocaleString()} FCFA</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 md:pb-6 pointer-events-none">
        <div className="container max-w-2xl px-0 pointer-events-auto">
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -2 }}
            onClick={() => user ? setShowConfirm(true) : navigate('/auth')}
            className="w-full rounded-2xl bg-gradient-mali py-4 text-base font-bold text-white shadow-mali transition-all hover:shadow-glow-green flex items-center justify-center gap-3"
          >
            {user ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Réserver ({totalPrice.toLocaleString()} FCFA)
              </>
            ) : (
              'Se connecter pour réserver'
            )}
          </motion.button>
        </div>
      </div>

      {/* Advanced Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg rounded-t-3xl bg-card border-x border-t border-white/10 p-6 sm:rounded-3xl sm:border"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted-foreground/20 sm:hidden" />

              <h2 className="text-2xl font-display font-bold text-foreground">Finaliser la réservation</h2>
              <p className="text-sm text-muted-foreground mt-1">Vérifiez les détails avant de confirmer</p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-muted/30 p-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Itinéraire</span>
                    <span className="font-bold text-foreground truncate ml-4">
                      {trip.departure_name} → {trip.destination_name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Places</span>
                    <span className="font-bold text-foreground">{seats} place{seats > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5">
                    <span className="font-bold text-foreground">Total à payer</span>
                    <span className="text-lg font-black text-primary">{totalPrice.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Mode de paiement</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'cash', label: 'Espèces au conducteur', icon: Banknote, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                      { id: 'orange_money', label: 'Orange Money', icon: Wallet, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                      { id: 'moov_money', label: 'Moov Money', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`flex items-center gap-3 rounded-2xl border-2 p-4 transition-all ${paymentMethod === pm.id
                          ? 'border-primary bg-primary/5'
                          : 'border-white/5 bg-muted/20 hover:border-white/10'
                          }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${pm.bg}`}>
                          <pm.icon className={`h-5 w-5 ${pm.color}`} />
                        </div>
                        <span className={`text-sm font-bold flex-1 text-left ${paymentMethod === pm.id ? 'text-primary' : 'text-foreground'}`}>
                          {pm.label}
                        </span>
                        {paymentMethod === pm.id && (
                          <div className="h-2 w-2 rounded-full bg-primary shadow-glow-green" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  disabled={booking}
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-2xl border border-white/10 bg-muted/40 py-4 text-sm font-bold text-foreground transition-all hover:bg-muted/60"
                >
                  Annuler
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={booking}
                  onClick={handleConfirm}
                  className="flex-[2] rounded-2xl bg-gradient-mali py-4 text-sm font-black text-white shadow-mali shadow-mali transition-all hover:shadow-glow-green disabled:opacity-50 flex items-center justify-center"
                >
                  {booking ? (
                    <motion.div
                      className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    "Confirmer la réservation"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripDetail;
