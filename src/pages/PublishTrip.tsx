import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Car, Bike, ArrowLeft, Check, Calendar, Clock, DollarSign, ListChecks, GraduationCap, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { quartiers, universities } from '@/lib/api';
import { vehicleModels, calculateBasePrice, calculateTotalPrice, getDriverBreakdown } from '@/lib/pricing';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createTrip } from '@/lib/api';
import AuroraBackground from '@/components/AuroraBackground';

const steps = [
  { label: 'Itinéraire', icon: MapPin },
  { label: 'Horaire', icon: Calendar },
  { label: 'Véhicule', icon: Car },
  { label: 'Prix', icon: DollarSign },
  { label: 'Récap', icon: ListChecks },
];

const PublishTrip = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [form, setForm] = useState({
    university: '',
    departure: '',
    destination: '',
    date: '',
    time: '07:30',
    recurrent: false,
    days: [] as string[],
    type: '' as 'voiture' | 'moto' | '',
    vehicle_info: '',
    seats: 2,
    helmet: false,
    price: 0,
  });

  const STORAGE_KEY = 'blasira_publish_draft';

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setForm(prev => ({ ...prev, ...parsed.form }));
        setStep(parsed.step || 0);
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, step }));
  }, [form, step]);

  const getDistance = (from: string, to: string) => {
    if (!from || !to) return 0;
    // Deterministic mock distance based on string lengths
    const sum = from.length + to.length;
    return (sum % 15) + 5; // Distance between 5 and 20 km
  };

  const distance = getDistance(form.departure, form.destination);

  // Auto-calculate price based on distance and vehicle type
  const autoBasePrice = form.type && distance > 0 ? calculateBasePrice(distance, form.type) : 0;
  const autoTotalPrice = autoBasePrice > 0 ? calculateTotalPrice(autoBasePrice) : 0;
  const driverBreakdown = form.price > 0 ? getDriverBreakdown(form.price) : null;

  const canNext = () => {
    if (step === 0) return form.departure && form.destination;
    if (step === 1) return form.date && form.time;
    if (step === 2) return form.type && form.vehicle_info;
    if (step === 3) return form.price >= 100 && form.price <= 2000;
    return true;
  };

  const handlePublish = async () => {
    if (!user || !form.type) return;
    setPublishing(true);
    try {
      await createTrip({
        driver_id: user.id,
        type: form.type,
        departure_name: form.departure,
        destination_name: form.destination,
        departure_date: form.date,
        departure_time: form.time,
        seats_available: form.seats,
        seats_total: form.seats,
        price_per_seat: form.price,
        duration_min: Math.round(distance * 2.5),
        distance_km: distance,
        recurrent: form.recurrent ? 'weekly' : null,
        status: 'published',
        helmet_provided: form.helmet,
        vehicle_info: form.vehicle_info,
      });
      toast.success('✅ Trajet publié avec succès !', {
        description: `De ${form.departure} vers ${form.destination}`,
      });
      localStorage.removeItem(STORAGE_KEY);
      navigate('/my-trips');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la publication');
    } finally {
      setPublishing(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">Itinéraire</h2>
                <p className="text-sm text-muted-foreground">Définissez vos points de départ et d'arrivée</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Départ (Quartier)</label>
                <div className="relative group">
                  <select
                    value={form.departure}
                    onChange={(e) => setForm({ ...form, departure: e.target.value })}
                    className="w-full appearance-none rounded-2xl border-2 border-white/5 bg-muted/30 px-4 py-4 text-base font-medium outline-none transition-all group-hover:border-white/10 focus:border-primary/50 focus:bg-muted/50 focus:shadow-glow-sm"
                  >
                    <option value="" className="bg-card">Sélectionner un quartier</option>
                    {quartiers.map((q) => (
                      <option key={q} value={q} className="bg-card">{q}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <ChevronRight className="h-4 w-4 rotate-90 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Destination (Université)</label>
                <div className="relative group">
                  <select
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value, university: e.target.value })}
                    className="w-full appearance-none rounded-2xl border-2 border-white/5 bg-muted/30 px-4 py-4 text-base font-medium outline-none transition-all group-hover:border-white/10 focus:border-primary/50 focus:bg-muted/50 focus:shadow-glow-sm"
                  >
                    <option value="" className="bg-card">Sélectionner une université</option>
                    {universities.map((uni) => (
                      <option key={uni} value={uni} className="bg-card">🎓 {uni}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <ChevronRight className="h-4 w-4 rotate-90 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {distance > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-4"
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <span className="font-bold text-foreground">~{distance} km</span> détectés.
                    Estimation : <span className="font-bold text-foreground">~{Math.round(distance * 2.5)} min</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-400/10 p-3">
                <Calendar className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">Horaire</h2>
                <p className="text-sm text-muted-foreground">Quand partez-vous ?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-2xl border-2 border-white/5 bg-muted/30 px-4 py-4 text-base font-medium outline-none transition-all focus:border-amber-400/50 focus:shadow-glow-sm"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Heure</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full rounded-2xl border-2 border-white/5 bg-muted/30 px-4 py-4 text-base font-medium outline-none transition-all focus:border-amber-400/50 focus:shadow-glow-sm"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded border-2 transition-all ${form.recurrent ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-white/40'}`}>
                    {form.recurrent && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <span className="text-sm font-bold text-foreground">Trajet récurrent</span>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={form.recurrent}
                  onChange={(e) => setForm({ ...form, recurrent: e.target.checked })}
                />
                <div className={`h-6 w-11 rounded-full p-1 transition-all ${form.recurrent ? 'bg-primary' : 'bg-muted'}`}>
                  <motion.div
                    animate={{ x: form.recurrent ? 20 : 0 }}
                    className="h-4 w-4 rounded-full bg-white shadow-sm"
                  />
                </div>
              </label>

              <AnimatePresence>
                {form.recurrent && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 flex flex-wrap gap-2">
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setForm({ ...form, days: form.days.includes(d) ? form.days.filter((x) => x !== d) : [...form.days, d] })}
                          className={`flex-1 min-w-[60px] rounded-xl border-2 py-2 text-xs font-bold transition-all ${form.days.includes(d)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-white/5 bg-muted/20 text-muted-foreground'
                            }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-500/10 p-3">
                <Car className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">Véhicule</h2>
                <p className="text-sm text-muted-foreground">Quel mode de transport utilisez-vous ?</p>
              </div>
            </div>

            <div className="flex gap-4">
              {[
                { value: 'voiture' as const, label: 'Voiture', icon: Car, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                { value: 'moto' as const, label: 'Moto', icon: Bike, color: 'text-amber-400', bg: 'bg-amber-400/10' },
              ].map((v) => (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: v.value, seats: v.value === 'moto' ? 1 : 3, vehicle_info: '' })}
                  className={`flex flex-1 flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all ${form.type === v.value
                    ? `border-${v.value === 'moto' ? 'amber-400' : 'indigo-500'} ${v.bg} scale-[1.02] shadow-lg`
                    : 'border-white/5 bg-muted/20 hover:border-white/10'
                    }`}
                >
                  <v.icon className={`h-10 w-10 ${form.type === v.value ? v.color : 'text-muted-foreground opacity-40'}`} />
                  <span className={`text-base font-bold ${form.type === v.value ? v.color : 'text-muted-foreground'}`}>{v.label}</span>
                </button>
              ))}
            </div>

            {form.type && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Modèle</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vehicleModels[form.type].map((model) => (
                      <button
                        key={model.value}
                        type="button"
                        onClick={() => setForm({ ...form, vehicle_info: model.value })}
                        className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-sm font-bold transition-all ${form.vehicle_info === model.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/5 bg-muted/20 hover:border-white/10 text-muted-foreground'
                          }`}
                      >
                        <span className="text-xl">{form.type === 'moto' ? '🏍️' : '🚗'}</span>
                        {model.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Places offertes</label>
                  <div className="flex gap-2">
                    {(form.type === 'moto' ? [1, 2] : [1, 2, 3, 4]).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm({ ...form, seats: n })}
                        className={`flex-1 rounded-2xl border-2 py-3 text-base font-black transition-all ${form.seats === n
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/5 bg-muted/20 text-muted-foreground'
                          }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {form.type === 'moto' && (
                  <div className="glass-card rounded-2xl p-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className={`h-6 w-6 ${form.helmet ? 'text-emerald-400' : 'text-muted-foreground/40'}`} />
                        <span className="text-sm font-bold text-foreground">Fournir un casque</span>
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={form.helmet}
                        onChange={(e) => setForm({ ...form, helmet: e.target.checked })}
                      />
                      <div className={`h-6 w-11 rounded-full p-1 transition-all ${form.helmet ? 'bg-emerald-500' : 'bg-muted'}`}>
                        <motion.div
                          animate={{ x: form.helmet ? 20 : 0 }}
                          className="h-4 w-4 rounded-full bg-white shadow-sm"
                        />
                      </div>
                    </label>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-3">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">Prix par place</h2>
                <p className="text-sm text-muted-foreground">Fixez votre tarif (FCFA)</p>
              </div>
            </div>

            {autoTotalPrice > 0 && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                type="button"
                onClick={() => setForm({ ...form, price: autoTotalPrice })}
                className="group relative w-full overflow-hidden rounded-3xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 transition-all hover:bg-primary/10"
              >
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Prix recommandé</div>
                <div className="mt-1 text-3xl font-black text-primary font-display">{autoTotalPrice.toLocaleString()} FCFA</div>
                <div className="mt-2 text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors">
                  Basé sur la distance ({distance}km) • Cliquez pour appliquer
                </div>
              </motion.button>
            )}

            <div className="space-y-3">
              <div className="relative group">
                <input
                  type="number"
                  min={100}
                  max={2000}
                  step={50}
                  value={form.price || ''}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  placeholder="Ex: 500"
                  className="w-full rounded-3xl border-2 border-white/5 bg-muted/30 px-6 py-6 text-center text-4xl font-black text-foreground outline-none transition-all focus:border-emerald-500/50 focus:bg-muted/50 font-display"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-black text-muted-foreground/30 font-display">FCFA</div>
              </div>
              <div className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                Min: 100 FCFA — Max: 2 000 FCFA
              </div>
            </div>

            <AnimatePresence>
              {driverBreakdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-premium rounded-3xl p-6 shadow-card space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Détails de vos gains</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payé par le passager</span>
                      <span className="font-bold">{driverBreakdown.totalPrice} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        Frais Blasira <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full font-bold">15%</span>
                      </div>
                      <span className="font-bold text-destructive">-{driverBreakdown.commission} FCFA</span>
                    </div>
                    <div className="border-t border-white/5 pt-3 flex justify-between items-end">
                      <span className="text-sm font-bold text-foreground">Gain net / place</span>
                      <span className="text-2xl font-black text-primary font-display">{driverBreakdown.driverNet} FCFA</span>
                    </div>
                  </div>

                  {form.seats > 1 && (
                    <div className="rounded-2xl bg-primary/10 p-3 text-center border border-primary/10">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase mr-2 tracking-wide">Total estimé</span>
                      <span className="text-lg font-black text-primary font-display">{(driverBreakdown.driverNet * form.seats).toLocaleString()} FCFA</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3">
                <ListChecks className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">Récapitulatif</h2>
                <p className="text-sm text-muted-foreground">Vérifiez vos informations avant de publier</p>
              </div>
            </div>

            <div className="glass-premium rounded-3xl overflow-hidden shadow-card border-white/10">
              <div className="bg-muted/40 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{form.type === 'moto' ? '🏍️' : '🚗'}</span>
                  <span className="text-sm font-black uppercase tracking-widest text-foreground">{form.vehicle_info}</span>
                </div>
                <div className="text-lg font-black text-primary font-display">{form.price} FCFA</div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <div className="h-3 w-3 rounded-full border-2 border-primary bg-background shadow-glow-green" />
                    <div className="h-8 w-0.5 bg-white/10" />
                    <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-background shadow-glow-sm" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Départ</div>
                      <div className="text-base font-bold text-foreground leading-tight">{form.departure}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Arrivée</div>
                      <div className="text-base font-bold text-foreground leading-tight truncate">🎓 {form.destination}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">📅 Date & Heure</div>
                    <div className="text-sm font-bold">{form.date} à {form.time}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">👥 Capacités</div>
                    <div className="text-sm font-bold">{form.seats} places offertes</div>
                  </div>
                </div>

                {form.recurrent && (
                  <div className="rounded-2xl bg-amber-400/5 p-3 flex items-center gap-3 border border-amber-400/10">
                    <Calendar className="h-4 w-4 text-amber-400" />
                    <div className="text-xs">
                      <span className="font-bold text-amber-400">Récurrent : </span>
                      {form.days.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border-2 border-dashed border-white/10 p-6 text-center">
              <div className="text-xs font-bold text-muted-foreground leading-relaxed">
                En publiant ce trajet, vous vous engagez à respecter la charte de confiance Blasira et à être ponctuel.
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-32 bg-background min-h-screen">
      <AuroraBackground className="fixed inset-0 opacity-20" intensity="low" />

      <div className="container relative z-10 max-w-2xl mx-auto pt-6 px-4">
        {/* Header with Back */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (step > 0) {
                setStep(step - 1);
              } else {
                if (form.departure || form.destination) {
                  if (window.confirm("Voulez-vous vraiment quitter ? Votre brouillon sera conservé.")) {
                    navigate(-1);
                  }
                } else {
                  navigate(-1);
                }
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-foreground transition-all hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <div className="text-center">
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60">Étape {step + 1} de 5</h1>
          </div>
          <div className="w-10" />
        </div>

        {/* Dynamic Stepper */}
        <div className="mb-10 relative px-2">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
          <motion.div
            className="absolute top-1/2 left-0 h-0.5 bg-primary shadow-glow-green -translate-y-1/2 z-1"
            animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          />
          <div className="relative z-10 flex justify-between">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: i === step ? 1.2 : 1,
                    backgroundColor: i <= step ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background transition-colors"
                >
                  <s.icon className={`h-4 w-4 ${i <= step ? 'text-white' : 'text-muted-foreground'}`} />
                </motion.div>
                <span className={`hidden sm:block absolute mt-10 text-[10px] font-black uppercase tracking-widest ${i === step ? 'text-primary' : 'text-muted-foreground/40'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Actions */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 md:pb-6 pointer-events-none">
          <div className="container max-w-2xl px-0 pointer-events-auto">
            {step < 4 ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -2 }}
                disabled={!canNext()}
                onClick={() => setStep(step + 1)}
                className="w-full rounded-2xl bg-gradient-mali py-4 text-base font-bold text-white shadow-mali transition-all hover:shadow-glow-green disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                Suivant
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -2 }}
                disabled={publishing}
                onClick={handlePublish}
                className="w-full rounded-2xl bg-gradient-mali py-4 text-base font-bold text-white shadow-mali transition-all hover:shadow-glow-green flex items-center justify-center gap-2"
              >
                {publishing ? (
                  <motion.div
                    className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Publier le trajet
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishTrip;
