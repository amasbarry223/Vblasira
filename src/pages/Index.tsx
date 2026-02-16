import { motion } from 'framer-motion';
import { Shield, Users, Bike, ArrowRight } from 'lucide-react';
import SearchForm from '@/components/SearchForm';
import TripCard from '@/components/TripCard';
import heroImage from '@/assets/hero-blasira.jpg';
import { useQuery } from '@tanstack/react-query';
import { fetchTrips } from '@/lib/api';

const features = [
  { icon: Shield, title: 'Étudiants vérifiés', desc: "Carte d'étudiant obligatoire" },
  { icon: Users, title: 'Frais partagés', desc: 'Dès 300 FCFA/trajet' },
  { icon: Bike, title: 'Moto & Voiture', desc: 'Choisissez votre mode' },
];

const stats = [
  { value: '500+', label: 'Étudiants' },
  { value: '200+', label: 'Trajets/mois' },
  { value: '4.8', label: 'Note moyenne' },
];

const Index = () => {
  const { data: trips = [] } = useQuery({
    queryKey: ['trips-popular'],
    queryFn: () => fetchTrips(),
  });

  const popularTrips = trips.slice(0, 3);

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Étudiants maliens en covoiturage" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />
        </div>
        <div className="relative container py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="mb-2 text-3xl font-extrabold leading-tight text-card md:text-5xl">
              Déplacez-vous <span className="text-gradient-mali">ensemble</span>
            </h1>
            <p className="mb-6 text-sm text-card/80 md:text-base">
              Covoiturage & moto-partage pour étudiants maliens 🇲🇱
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mx-auto mb-6 flex max-w-xs justify-around">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-bold text-mali-gold">{s.value}</div>
                <div className="text-[11px] text-card/70">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="container -mt-4 relative z-10 md:max-w-2xl lg:max-w-3xl md:mx-auto">
        <SearchForm />
      </section>

      <section className="container mt-8">
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex flex-col items-center rounded-xl bg-card p-3 md:p-5 text-center shadow-sm border border-border">
              <div className="mb-2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
                <f.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div className="text-xs md:text-sm font-semibold">{f.title}</div>
              <div className="text-[10px] md:text-xs text-muted-foreground">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {popularTrips.length > 0 && (
        <section className="container mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold">🔥 Trajets populaires</h2>
            <a href="/search" className="flex items-center gap-1 text-xs font-medium text-primary">
              Voir tout <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {popularTrips.map((trip, i) => (
              <TripCard key={trip.id} trip={trip} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="container mt-8">
        <div className="rounded-xl bg-gradient-mali p-4 text-center shadow-mali">
          <Shield className="mx-auto mb-2 h-8 w-8 text-primary-foreground" />
          <h3 className="mb-1 text-sm font-bold text-primary-foreground">Communauté étudiante sécurisée</h3>
          <p className="text-xs text-primary-foreground/80">Chaque membre est vérifié avec sa carte d'étudiant. Voyagez en toute confiance !</p>
        </div>
      </section>
    </div>
  );
};

export default Index;
