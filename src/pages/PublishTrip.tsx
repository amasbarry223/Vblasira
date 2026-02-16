import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Car, Bike, ArrowLeft, Check } from 'lucide-react';
import { locations } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const steps = ['Itinéraire', 'Horaire', 'Véhicule', 'Prix', 'Récap'];

const PublishTrip = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
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

  const distance = form.departure && form.destination ? Math.floor(Math.random() * 10 + 5) : 0;
  const suggestedPrice = distance * 50;

  const canNext = () => {
    if (step === 0) return form.departure && form.destination && form.departure !== form.destination;
    if (step === 1) return form.date && form.time;
    if (step === 2) return form.type && form.vehicle_info;
    if (step === 3) return form.price >= 100 && form.price <= 2000;
    return true;
  };

  const handlePublish = () => {
    toast.success('✅ Trajet publié avec succès !', {
      description: `${form.departure} → ${form.destination}`,
    });
    navigate('/my-trips');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">📍 Itinéraire</h2>
            <LocationInput label="Départ" value={form.departure} onChange={(v) => setForm({ ...form, departure: v })} />
            <LocationInput label="Arrivée" value={form.destination} onChange={(v) => setForm({ ...form, destination: v })} />
            {distance > 0 && (
              <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                📏 ~{distance} km • ⏱️ ~{Math.round(distance * 2.5)} min estimé
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">📅 Horaire</h2>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Heure de départ</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.recurrent}
                onChange={(e) => setForm({ ...form, recurrent: e.target.checked })}
                className="h-4 w-4 rounded accent-primary"
              />
              Trajet récurrent
            </label>
            {form.recurrent && (
              <div className="flex flex-wrap gap-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((d) => (
                  <button
                    key={d}
                    onClick={() =>
                      setForm({
                        ...form,
                        days: form.days.includes(d) ? form.days.filter((x) => x !== d) : [...form.days, d],
                      })
                    }
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      form.days.includes(d) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">🚗 Véhicule</h2>
            <div className="flex gap-3">
              {[
                { value: 'voiture' as const, label: 'Voiture', icon: Car },
                { value: 'moto' as const, label: 'Moto', icon: Bike },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setForm({ ...form, type: value, seats: value === 'moto' ? 1 : 3 })}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
                    form.type === value ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <Icon className={`h-8 w-8 ${form.type === value ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Marque / Modèle</label>
              <input
                type="text"
                placeholder={form.type === 'moto' ? 'Ex: Honda 125cc' : 'Ex: Toyota Corolla'}
                value={form.vehicle_info}
                onChange={(e) => setForm({ ...form, vehicle_info: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Places disponibles</label>
              <div className="flex gap-2">
                {(form.type === 'moto' ? [1, 2] : [1, 2, 3, 4]).map((n) => (
                  <button
                    key={n}
                    onClick={() => setForm({ ...form, seats: n })}
                    className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                      form.seats === n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            {form.type === 'moto' && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.helmet}
                  onChange={(e) => setForm({ ...form, helmet: e.target.checked })}
                  className="h-4 w-4 rounded accent-primary"
                />
                🪖 Casque fourni
              </label>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">💰 Prix par place</h2>
            <div>
              <input
                type="number"
                min={100}
                max={2000}
                step={50}
                value={form.price || ''}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                placeholder="Prix en FCFA"
                className="w-full rounded-xl border border-border bg-background px-3 py-3 text-center text-2xl font-bold"
              />
              <div className="mt-2 text-center text-xs text-muted-foreground">
                Min: 100 FCFA — Max: 2 000 FCFA
              </div>
            </div>
            {suggestedPrice > 0 && (
              <button
                onClick={() => setForm({ ...form, price: suggestedPrice })}
                className="w-full rounded-lg bg-secondary/20 py-2 text-xs font-medium text-secondary-foreground"
              >
                💡 Prix suggéré: {suggestedPrice} FCFA ({distance} km × 50 FCFA)
              </button>
            )}
            {form.price > 0 && form.seats > 0 && (
              <div className="rounded-lg bg-primary/5 p-3 text-center text-sm">
                Gains estimés: <span className="font-bold text-primary">{form.price * form.seats} FCFA</span>
                <div className="text-[11px] text-muted-foreground">si {form.seats} places réservées</div>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-3">
            <h2 className="text-lg font-bold">📋 Récapitulatif</h2>
            <div className="space-y-2 rounded-xl border border-border bg-card p-4 text-sm">
              <Row label="Trajet" value={`${form.departure} → ${form.destination}`} />
              <Row label="Date" value={`${form.date} à ${form.time}`} />
              {form.recurrent && <Row label="Récurrence" value={form.days.join(', ')} />}
              <Row label="Véhicule" value={`${form.type === 'moto' ? '🏍️' : '🚗'} ${form.vehicle_info}`} />
              <Row label="Places" value={`${form.seats}`} />
              <Row label="Prix/place" value={`${form.price} FCFA`} />
              {form.type === 'moto' && <Row label="Casque" value={form.helmet ? '✅ Fourni' : '❌ Non'} />}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="pb-20">
      <div className="container py-4">
        <button onClick={() => (step > 0 ? setStep(step - 1) : navigate(-1))} className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          {step > 0 ? 'Étape précédente' : 'Retour'}
        </button>

        {/* Progress */}
        <div className="mb-6 flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6">
          {step < 4 ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="w-full rounded-xl bg-gradient-mali py-3 text-sm font-bold text-primary-foreground shadow-mali disabled:opacity-50"
            >
              Suivant ({step + 1}/5)
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePublish}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-mali py-3 text-sm font-bold text-primary-foreground shadow-mali"
            >
              <Check className="h-4 w-4" />
              Publier le trajet
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

const LocationInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => {
  const [show, setShow] = useState(false);
  const filtered = locations.filter((l) => l.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="relative">
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
        <MapPin className="h-4 w-4 shrink-0 text-primary" />
        <input
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); setShow(e.target.value.length >= 1); }}
          onFocus={() => setShow(value.length >= 1)}
          onBlur={() => setTimeout(() => setShow(false), 200)}
          placeholder={`Ex: ${label === 'Départ' ? 'Badalabougou' : 'Université USSGB'}`}
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>
      {show && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-36 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          {filtered.map((loc) => (
            <button key={loc} className="block w-full px-3 py-2 text-left text-sm hover:bg-muted" onMouseDown={() => { onChange(loc); setShow(false); }}>
              {loc}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default PublishTrip;
