import { motion } from 'framer-motion';
import { Shield, Users, Bike, ArrowRight, Play, Star, CheckCircle, MapPin, Clock, UserCheck, Car } from 'lucide-react';
import SearchForm from '@/components/SearchForm';
import TripCard from '@/components/TripCard';
import heroImage from '@/assets/hero-blasira.jpg';
import { useQuery } from '@tanstack/react-query';
import { fetchTrips } from '@/lib/api';
import { popularRoutes } from '@/lib/pricing';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Location images
import imgBadalabougou from '@/assets/locations/badalabougou.jpg';
import imgUssgb from '@/assets/locations/universite-ussgb.jpg';
import imgAci from '@/assets/locations/aci-2000.jpg';
import imgKalaban from '@/assets/locations/kalaban-coro.jpg';
import imgHippodrome from '@/assets/locations/hippodrome.jpg';
import imgMagnambougou from '@/assets/locations/magnambougou.jpg';

const locationImages: Record<string, string> = {
  'badalabougou': imgBadalabougou,
  'universite-ussgb': imgUssgb,
  'aci-2000': imgAci,
  'kalaban-coro': imgKalaban,
  'hippodrome': imgHippodrome,
  'magnambougou': imgMagnambougou,
};

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

const steps = [
  { number: '1', icon: UserCheck, title: 'Inscrivez-vous', desc: 'Créez votre compte avec votre numéro de téléphone' },
  { number: '2', icon: MapPin, title: 'Trouvez un trajet', desc: 'Recherchez un trajet selon votre destination' },
  { number: '3', icon: Clock, title: 'Réservez', desc: 'Confirmez votre place en quelques clics' },
  { number: '4', icon: CheckCircle, title: 'Voyagez !', desc: 'Rejoignez votre conducteur et partagez les frais' },
];

const testimonials = [
  {
    name: 'Aminata D.',
    university: 'USSGB',
    avatar: 'https://ui-avatars.com/api/?name=Aminata+D&background=16a34a&color=fff',
    text: "Blasira m'a permis d'économiser sur mes trajets quotidiens. Je recommande à tous les étudiants !",
    rating: 5,
  },
  {
    name: 'Moussa K.',
    university: 'ULSHB',
    avatar: 'https://ui-avatars.com/api/?name=Moussa+K&background=eab308&color=fff',
    text: "Très pratique pour aller à la fac. Les conducteurs sont toujours ponctuels et sympathiques.",
    rating: 5,
  },
  {
    name: 'Fatoumata S.',
    university: 'ENSup',
    avatar: 'https://ui-avatars.com/api/?name=Fatoumata+S&background=16a34a&color=fff',
    text: "En tant que conductrice, je partage mes frais d'essence et je rencontre d'autres étudiants. Top !",
    rating: 4,
  },
];

const Index = () => {
  const { data: trips = [] } = useQuery({
    queryKey: ['trips-popular'],
    queryFn: () => fetchTrips(),
  });
  const [showVideo, setShowVideo] = useState(false);

  const availableTrips = trips.slice(0, 6);

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

      {/* 🔥 Trajets populaires — predefined routes */}
      <section className="container mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold md:text-xl">🔥 Trajets populaires</h2>
          <Link to="/search" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            Voir tout <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {popularRoutes.map((route, i) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/search?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`}
                className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative h-28 md:h-36 overflow-hidden">
                  <img
                    src={locationImages[route.imageKey] || imgBadalabougou}
                    alt={route.from}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xs font-bold text-card truncate">{route.from}</div>
                    <div className="flex items-center gap-1 text-[10px] text-card/80">
                      <ArrowRight className="h-2.5 w-2.5" /> {route.to}
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {route.durationMin} min • {route.distanceKm} km
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-primary">{route.totalPrice} F</span>
                    <span className="rounded-full bg-gradient-mali px-3 py-1 text-[10px] font-bold text-primary-foreground">
                      Réserver
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trajets disponibles — real-time from DB */}
      {availableTrips.length > 0 && (
        <section className="container mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold md:text-xl">🚗 Trajets disponibles</h2>
            <Link to="/search" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {availableTrips.map((trip, i) => (
              <TripCard key={trip.id} trip={trip} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Comment ça marche */}
      <section className="container mt-10">
        <h2 className="mb-5 text-center text-lg font-bold md:text-xl">📋 Comment ça marche ?</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex flex-col items-center rounded-xl bg-card p-4 text-center shadow-sm border border-border"
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-mali text-sm font-bold text-primary-foreground">
                {step.number}
              </div>
              <step.icon className="mb-1 h-5 w-5 text-primary" />
              <h3 className="text-xs font-bold md:text-sm">{step.title}</h3>
              <p className="mt-1 text-[10px] text-muted-foreground md:text-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vidéo explicative */}
      <section className="container mt-10">
        <h2 className="mb-4 text-center text-lg font-bold md:text-xl">🎬 Découvrez Blasira en vidéo</h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mx-auto aspect-video max-w-xl overflow-hidden rounded-2xl bg-foreground/5 border border-border shadow-lg"
        >
          {!showVideo ? (
            <button
              onClick={() => setShowVideo(true)}
              className="group flex h-full w-full flex-col items-center justify-center gap-3"
            >
              <img src={heroImage} alt="Aperçu vidéo Blasira" className="absolute inset-0 h-full w-full object-cover opacity-60" />
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 shadow-mali transition-transform group-hover:scale-110">
                <Play className="h-7 w-7 text-primary-foreground ml-1" />
              </div>
              <span className="relative z-10 text-sm font-semibold text-card">Voir la présentation</span>
            </button>
          ) : (
            <div className="flex h-full items-center justify-center bg-foreground/10 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                🎥 Vidéo bientôt disponible !<br />
                <span className="text-xs">Une courte vidéo expliquant le fonctionnement de Blasira sera ajoutée ici.</span>
              </p>
            </div>
          )}
        </motion.div>
      </section>

      {/* Témoignages */}
      <section className="container mt-10">
        <h2 className="mb-5 text-center text-lg font-bold md:text-xl">💬 Ils nous font confiance</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full ring-2 ring-primary/20" />
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground">{t.university}</div>
                </div>
              </div>
              <p className="mb-2 text-xs leading-relaxed text-muted-foreground">"{t.text}"</p>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-3.5 w-3.5 ${j < t.rating ? 'fill-mali-gold text-mali-gold' : 'text-border'}`} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA sécurité */}
      <section className="container mt-10 mb-4">
        <div className="rounded-xl bg-gradient-mali p-5 text-center shadow-mali">
          <Shield className="mx-auto mb-2 h-8 w-8 text-primary-foreground" />
          <h3 className="mb-1 text-sm font-bold text-primary-foreground">Communauté étudiante sécurisée</h3>
          <p className="mb-3 text-xs text-primary-foreground/80">Chaque membre est vérifié avec sa carte d'étudiant. Voyagez en toute confiance !</p>
          <Link to="/auth" className="inline-block rounded-lg bg-card px-5 py-2 text-xs font-bold text-primary shadow transition-transform hover:scale-105">
            Rejoindre Blasira
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
