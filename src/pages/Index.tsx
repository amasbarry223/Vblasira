import { motion } from 'framer-motion';
import { Shield, Users, Bike, ArrowRight, Star, CheckCircle, MapPin, Clock, UserCheck, Car, Sparkles, ChevronRight, Search } from 'lucide-react';
import SearchForm from '@/components/SearchForm';
import TripCard from '@/components/TripCard';
import SectionSeparator from '@/components/SectionSeparator';
import AuroraBackground from '@/components/AuroraBackground';
import { StatItem } from '@/components/AnimatedCounter';
import heroImage from '@/assets/hero-blasira.jpg';
import { useQuery } from '@tanstack/react-query';
import { fetchTrips } from '@/lib/api';
import { popularRoutes } from '@/lib/pricing';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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
  { icon: Shield, title: 'Étudiants vérifiés', desc: "Carte d'étudiant obligatoire", color: 'text-primary', bg: 'bg-primary/10' },
  { icon: Users, title: 'Frais partagés', desc: 'Dès 300 FCFA/trajet', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { icon: Bike, title: 'Moto & Voiture', desc: 'Choisissez votre mode', color: 'text-sky-400', bg: 'bg-sky-400/10' },
];

const stats = [
  { value: '500+', label: 'Étudiants actifs', numericValue: 500, suffix: '+' },
  { value: '200+', label: 'Trajets / mois', numericValue: 200, suffix: '+' },
  { value: '4.8', label: 'Note moyenne', numericValue: 4, suffix: '.8★' },
];

const steps = [
  { number: '01', icon: UserCheck, title: 'Inscrivez-vous', desc: 'Créez votre compte avec votre numéro de téléphone' },
  { number: '02', icon: MapPin, title: 'Trouvez un trajet', desc: 'Recherchez selon votre destination' },
  { number: '03', icon: Clock, title: 'Réservez', desc: 'Confirmez votre place en quelques clics' },
  { number: '04', icon: CheckCircle, title: 'Voyagez !', desc: 'Rejoignez votre conducteur et partagez les frais' },
];

const testimonials = [
  {
    name: 'Aminata D.', university: 'USSGB',
    avatar: 'https://ui-avatars.com/api/?name=Aminata+D&background=22C55E&color=fff',
    text: "Blasira m'a permis d'économiser sur mes trajets quotidiens. Je recommande à tous les étudiants de Bamako !",
    rating: 5,
  },
  {
    name: 'Moussa K.', university: 'ULSHB',
    avatar: 'https://ui-avatars.com/api/?name=Moussa+K&background=F59E0B&color=fff',
    text: "Très pratique pour aller à la fac. Les conducteurs sont toujours ponctuels et sympathiques.",
    rating: 5,
  },
  {
    name: 'Fatoumata S.', university: 'ENSup',
    avatar: 'https://ui-avatars.com/api/?name=Fatoumata+S&background=22C55E&color=fff',
    text: "En tant que conductrice, je partage mes frais d'essence et je rencontre d'autres étudiants. Top !",
    rating: 4,
  },
  {
    name: 'Ibrahim B.', university: 'FST',
    avatar: 'https://ui-avatars.com/api/?name=Ibrahim+B&background=0284c7&color=fff',
    text: "Plus besoin d'attendre le bus pendant des heures. Je trouve un trajet en 2 minutes sur l'app.",
    rating: 5,
  },
  {
    name: 'Salif T.', university: 'ISA',
    avatar: 'https://ui-avatars.com/api/?name=Salif+T&background=ea580c&color=fff',
    text: "Une solution moderne pour nos problèmes de transport. Sécurisé et vraiment pas cher.",
    rating: 5,
  },
];

const faqItems = [
  {
    question: 'Comment réserver un trajet ?',
    answer: "Recherchez un trajet avec votre lieu de départ et d'arrivée, choisissez une offre qui vous convient, puis cliquez sur Réserver. Confirmez le nombre de places et le mode de paiement (espèces, Orange Money, Moov Money).",
  },
  {
    question: "Quels documents pour s'inscrire ?",
    answer: "Pour rejoindre Blasira, il vous faut un numéro de téléphone valide. La vérification étudiant (carte d'étudiant) peut être demandée pour accéder à certaines fonctionnalités et renforcer la confiance de la communauté.",
  },
  {
    question: 'Comment sont calculés les prix ?',
    answer: "Les prix sont fixés par les conducteurs en fonction de la distance et du type de véhicule. La plateforme suggère des tarifs à partir d'environ 300 FCFA par trajet.",
  },
  {
    question: "Que faire en cas d'incident ?",
    answer: "En cas de problème, vous pouvez signaler l'incident depuis votre compte. Notre équipe traite les signalements et peut suspendre un membre en cas de manquement à la charte de confiance.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as any } },
};

const Index = () => {
  const { data: trips = [] } = useQuery({
    queryKey: ['trips-popular'],
    queryFn: () => fetchTrips(),
  });
  const [showVideo, setShowVideo] = useState(false);
  const availableTrips = trips.slice(0, 6);

  return (
    <div className="pb-24">

      {/* ═══════════════════════════════
          HERO — Aurora + Search
      ═══════════════════════════════ */}
      <AuroraBackground className="relative min-h-[82vh] flex items-center justify-center px-4 py-16 md:min-h-[85vh]">
        {/* Floating decorative elements */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[10%] top-[20%] hidden lg:block"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rotate-12">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="pointer-events-none absolute right-[12%] top-[25%] hidden lg:block"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 backdrop-blur-md border border-white/5 shadow-lg -rotate-6">
            <Users className="h-5 w-5 text-amber-500" />
          </div>
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[20%] bottom-[15%] h-32 w-32 bg-primary/20 blur-3xl rounded-full"
        />

        <div className="flex w-full max-w-3xl flex-col items-center justify-center text-center relative z-10">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur-md shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Covoiturage étudiant au Mali · 2026
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            <span className="text-gradient-mali brightness-110">Blasira</span> vous emmène{' '}
            <br className="hidden sm:block" />
            <span className="relative">
              où vous voulez.
              <svg className="absolute -bottom-2 left-0 w-full text-primary/30 h-3" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground/80 md:text-lg font-medium"
          >
            Moto, voiture ou covoiturage — trouvez un trajet parmi des centaines d'offres d'étudiants vérifiés à Bamako.
          </motion.p>

          {/* Search form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, type: 'spring', damping: 20 }}
            className="mt-10 w-full"
          >
            <SearchForm variant="hero" />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {stats.map((s, i) => (
              <StatItem key={s.label} value={s.value} label={s.label} numericValue={s.numericValue} suffix={s.suffix} delay={0.45 + i * 0.1} />
            ))}
          </motion.div>
        </div>
      </AuroraBackground>

      <SectionSeparator />

      {/* ═══════════════════════════════
          FEATURES — Simple, Sécurisé
      ═══════════════════════════════ */}
      <section className="container section-padding-sm" id="comment-ca-marche">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Pourquoi Blasira ?</span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Simple, sécurisé et transparent</h2>
          <p className="mt-2 text-base text-muted-foreground">Une plateforme pensée pour les étudiants.</p>
        </motion.div>

        <motion.div
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass-card flex flex-col items-center rounded-[32px] p-5 text-center transition-all hover:bg-white/[0.08] md:p-8"
            >
              <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${f.bg} group-hover:scale-110 transition-transform`}>
                <f.icon className={`h-6 w-6 md:h-7 md:w-7 ${f.color}`} />
              </div>
              <div className="text-sm font-extrabold leading-tight md:text-lg mb-2 text-white">{f.title}</div>
              <div className="text-xs text-white/40 md:text-sm">{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <SectionSeparator />

      {/* ═══════════════════════════════
          TRAJETS POPULAIRES
      ═══════════════════════════════ */}
      <section className="container section-padding-sm" id="tarifs">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="mb-2 inline-block rounded-full bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-400">Destinations</span>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Trajets populaires</h2>
          </div>
          <Link to="/search" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 pb-8 items-stretch">
              {popularRoutes.map((route, i) => (
                <CarouselItem key={route.id} className="pl-3 basis-[85%] sm:basis-[45%] lg:basis-1/3 h-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className="h-full"
                  >
                    <Link
                      to={`/search?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`}
                      className="group block h-full overflow-hidden rounded-[40px] border border-white/5 bg-white/5 transition-all hover:border-primary/40 hover:bg-white/[0.08]"
                    >
                      <div className="relative h-44 overflow-hidden md:h-52">
                        <img
                          src={locationImages[route.imageKey] || imgBadalabougou}
                          alt={route.from}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Tags */}
                        <div className="absolute left-4 top-4">
                          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md border border-white/10 uppercase tracking-widest">
                            {route.distanceKm} KM
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-5 right-5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white/90 mb-1">
                            <MapPin className="h-3 w-3 text-primary" /> {route.from}
                          </div>
                          <div className="flex items-center gap-2 text-white font-extrabold text-lg">
                            <ArrowRight className="h-4 w-4 text-primary" /> {route.to}
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <Clock className="h-3.5 w-3.5" /> {route.durationMin} min
                          </div>
                          <div className="font-display text-xl font-black text-primary">
                            {route.totalPrice} F
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="h-px flex-1 bg-white/5" />
                          <span className="flex items-center justify-center rounded-2xl bg-white/5 px-5 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white">
                            Prendre ce trajet
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-4 md:-right-12 md:bottom-auto md:top-1/2 md:flex-col md:-translate-y-1/2">
              <CarouselPrevious className="relative left-0 top-0 translate-y-0 border-white/10 bg-white/5 hover:bg-primary hover:text-white" />
              <CarouselNext className="relative right-0 top-0 translate-y-0 border-white/10 bg-white/5 hover:bg-primary hover:text-white" />
            </div>
          </Carousel>
        </div>
      </section>

      <SectionSeparator />

      {/* ═══════════════════════════════
          TRAJETS DISPONIBLES
      ═══════════════════════════════ */}
      {availableTrips.length > 0 && (
        <section className="container section-padding-sm">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Live</span>
              <h2 className="font-display text-2xl font-bold md:text-3xl">Trajets disponibles</h2>
            </div>
            <Link to="/search" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative">
            <Carousel
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-3 pb-8 items-stretch">
                {availableTrips.map((trip, i) => (
                  <CarouselItem key={trip.id} className="pl-3 basis-[85%] sm:basis-[48%] lg:basis-1/3 h-full">
                    <TripCard trip={trip} index={i} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-4 md:-right-12 md:bottom-auto md:top-1/2 md:flex-col md:-translate-y-1/2">
                <CarouselPrevious className="relative left-0 top-0 translate-y-0 border-white/10 bg-white/5 hover:bg-primary hover:text-white" />
                <CarouselNext className="relative right-0 top-0 translate-y-0 border-white/10 bg-white/5 hover:bg-primary hover:text-white" />
              </div>
            </Carousel>
          </div>
        </section>
      )}

      <SectionSeparator />

      {/* ═══════════════════════════════
          COMMENT ÇA MARCHE — Timeline
      ═══════════════════════════════ */}
      <section className="container section-padding-sm">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">4 étapes</span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Comment ça marche ?</h2>
          <p className="mt-2 text-base text-muted-foreground">Simple comme bonjour.</p>
        </motion.div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 h-0.5 w-[75%] bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden md:block" />

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 md:gap-6 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step circle */}
                <div className="relative mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative z-10 flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-mali text-xl font-display font-extrabold text-white shadow-mali border-4 border-background"
                  >
                    {step.number}
                  </motion.div>
                  {/* Outer glow pulse */}
                  <div className="absolute -inset-1.5 bg-primary/20 blur-lg rounded-[24px] animate-pulse" />
                </div>

                <div className="glossy-card rounded-[40px] p-6 pt-8 mt-[-32px] w-full h-full border-white/5 group-hover:border-primary/20 transition-all duration-500">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform duration-500">
                      <step.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-base font-extrabold mb-2 text-white tracking-tight">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>

                {/* Vertical line for mobile */}
                {i < steps.length - 1 && (
                  <div className="h-12 w-0.5 bg-gradient-to-b from-primary/30 to-transparent md:hidden my-2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionSeparator />

      {/* ═══════════════════════════════
          VIDÉO EXPLICATIVE
      ═══════════════════════════════ */}
      <section className="container section-padding-sm" id="video">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative mx-auto max-w-4xl overflow-hidden glass rounded-[3rem] border-white/10 p-2 group/video"
        >
          <div className="relative aspect-video overflow-hidden rounded-[2.2rem]">
            {!showVideo ? (
              <button
                type="button"
                onClick={() => setShowVideo(true)}
                className="group/btn flex h-full w-full flex-col items-center justify-center gap-4 relative"
              >
                <img src={heroImage} alt="Aperçu Blasira" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/video:scale-105" />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] group-hover/video:bg-black/40 transition-colors" />

                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-xl transition-all duration-500 group-hover/btn:scale-110 group-hover/btn:bg-primary">
                  <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                  <svg className="ml-1 h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                <div className="relative z-10 text-white font-display text-xl font-bold tracking-tight opacity-90 group-hover/btn:opacity-100 transition-opacity">
                  Voir la présentation
                </div>
              </button>
            ) : (
              <div className="h-full w-full bg-black">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Blasira Video Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <SectionSeparator />

      {/* ═══════════════════════════════
          TÉMOIGNAGES — Carousel
      ═══════════════════════════════ */}
      <section className="section-padding-sm overflow-hidden" id="temoignages">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="container mb-12 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-400">Témoignages</span>
          <h2 className="font-display text-3xl font-bold md:text-4xl text-gradient-white">Ils nous font confiance</h2>
          <p className="mt-2 text-base text-muted-foreground">Rejoignez des milliers d'étudiants satisfaits.</p>
        </motion.div>

        <div className="relative mt-8">
          <div className="relative overflow-hidden mask-edges py-4">
            <ul className="flex gap-5 w-[max-content] animate-marquee" aria-label="Témoignages Blasira, défilement continu">
              {[...testimonials, ...testimonials].map((t, i) => (
                <li key={`${t.name}-${i}`} className="w-[360px] md:w-[500px] flex-shrink-0">
                  <div className="glossy-card relative h-full rounded-[48px] border-white/5 p-6 md:p-8 transition-all hover:border-primary/20 group overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute -right-8 -top-8 h-32 w-32 bg-primary/5 blur-3xl rounded-full" />

                    <div className="flex h-full flex-col md:flex-row gap-6">
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-foreground/80 text-sm md:text-base leading-relaxed font-medium italic mb-6">
                            "{t.text}"
                          </p>
                          <div className="flex items-center gap-2">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <div key={j} className="inline-flex items-center rounded-full bg-muted px-2 py-0.5">
                                <span className={`text-[10px] font-bold ${j < t.rating ? 'text-amber-500' : 'text-white/10'}`}>★</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-32 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                        <div className="relative group/avatar">
                          <div className="absolute -inset-1 bg-gradient-mali blur-sm opacity-20 group-hover/avatar:opacity-40 transition-opacity rounded-full" />
                          <div className="relative rounded-full size-16 md:size-20 border-2 border-white shadow-lg overflow-hidden bg-primary/5">
                            <img
                              src={t.avatar}
                              alt={t.name}
                              className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div className="mt-4 text-center">
                          <div className="text-white text-sm font-bold leading-tight truncate w-full">{t.name}</div>
                          <div className="text-muted-foreground text-[10px] md:text-xs mt-1">{t.university}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SectionSeparator />

      {/* ═══════════════════════════════
          FAQ — Accordion premium
      ═══════════════════════════════ */}
      <section className="container section-padding-sm" id="faq">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">FAQ</span>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Vous avez des questions ?</h2>
          <p className="mt-2 text-base text-muted-foreground">On y répond.</p>
        </motion.div>
        <div className="mx-auto max-w-2xl">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="glossy-card rounded-2xl border-white/5 px-5 overflow-hidden transition-all duration-300 hover:border-primary/20"
              >
                <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline py-4 md:text-base group">
                  <span className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-colors">
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-90" />
                    </div>
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 pl-9 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <SectionSeparator />

      {/* ═══════════════════════════════
          CTA FINAL — Aurora gradient
      ═══════════════════════════════ */}
      <section className="container section-padding-sm" id="securite">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-mali p-8 text-center shadow-mali md:p-12"
        >
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
          {/* Blobs */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">
            <div className="relative z-10 mx-auto max-w-2xl px-4">
              <h2 className="font-display text-4xl font-extrabold text-white md:text-5xl tracking-tight leading-[1.1]">
                Prêt pour votre <br className="md:hidden" /> prochain <span className="text-primary-foreground/80">trajet ?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/90 font-medium">
                Rejoignez la plus grande communauté de covoiturage étudiant du Mali. Économisez, partagez, voyagez sereinement.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/publish"
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-8 py-4 text-lg font-black text-primary transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] sm:w-auto active:scale-95"
                >
                  <Car className="h-5 w-5" />
                  Publier un trajet
                </Link>
                <Link
                  to="/search"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-white/20 bg-white/5 px-8 py-4 text-lg font-black text-white backdrop-blur-md transition-all hover:bg-white/10 sm:w-auto active:scale-95"
                >
                  <Search className="h-5 w-5" />
                  Trouver un trajet
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
