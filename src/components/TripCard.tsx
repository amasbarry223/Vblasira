import { Car, Bike, Star, Clock, MapPin, Shield, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TripWithDriver } from '@/lib/api';
import { motion } from 'framer-motion';

interface TripCardProps {
  trip: TripWithDriver;
  index?: number;
}

const TripCard = ({ trip, index = 0 }: TripCardProps) => {
  const isMoto = trip.type === 'moto';
  const VehicleIcon = isMoto ? Bike : Car;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.015, y: -2 }}
      className="h-full"
    >
      <Link
        to={`/trip/${trip.id}`}
        className="group flex flex-col h-full relative overflow-hidden rounded-2xl border border-white/8 bg-card/70 backdrop-blur-sm shadow-card transition-all duration-300 hover:border-primary/25 hover:shadow-glow-sm"
      >
        {/* Top section */}
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            {/* Vehicle badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold tracking-wide ${isMoto
                ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/25'
                : 'bg-primary/15 text-primary ring-1 ring-primary/25'
                }`}
            >
              <VehicleIcon className="h-3.5 w-3.5" />
              {isMoto ? 'MOTO' : 'VOITURE'}
            </span>

            {/* Seats badge */}
            <span className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted-foreground ring-1 ring-white/8">
              <Zap className="h-3 w-3 text-primary" />
              {trip.seats_available} place{trip.seats_available > 1 ? 's' : ''}
            </span>
          </div>

          {/* Route */}
          <div className="mb-3 flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 text-sm font-semibold">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <MapPin className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="truncate text-foreground">{trip.departure_name}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate text-muted-foreground">{trip.destination_name}</span>
            </div>
          </div>

          {/* Meta info */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
              {trip.departure_time}
            </span>
            <span className="flex items-center gap-1">
              ⏱️ {trip.duration_min} min
            </span>
            <span>{trip.distance_km} km</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <div className="flex-grow" />

        {/* Bottom section — Driver + Price */}
        <div className="flex items-center justify-between gap-3 px-4 pb-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index * 0.08) + 0.2 }}
            className="flex min-w-0 items-center gap-2.5"
          >
            <div className="relative shrink-0">
              <img
                src={trip.driver.avatar_url || `https://ui-avatars.com/api/?name=${trip.driver.name}&background=22C55E&color=fff`}
                alt={trip.driver.name}
                className="h-9 w-9 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-primary/40 transition-all duration-500"
              />
              {trip.driver.verification_status === 'verified' && (
                <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary shadow-glow-sm ring-2 ring-card animate-pulse">
                  <Shield className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-foreground truncate">{trip.driver.name.split(' ')[0]}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                <span className="font-medium text-amber-400">{trip.driver.rating}</span>
                <span>· {trip.driver.total_trips} trajets</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index * 0.08) + 0.3 }}
            className="relative shrink-0 text-right group/price"
          >
            <div className="absolute inset-0 -inset-x-2 bg-primary/5 blur-xl opacity-0 group-hover/price:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-xl font-display font-bold text-gradient-mali tabular-nums">{trip.price_per_seat}</div>
              <div className="text-[9px] text-muted-foreground uppercase opacity-70 font-medium tracking-widest">FCFA / PLACE</div>
            </div>
            {/* Shimmer price overlay */}
            <div className="shimmer-price absolute inset-0 rounded-lg pointer-events-none" />
          </motion.div>
        </div>

        {/* Helmet badge */}
        {isMoto && trip.helmet_provided && (
          <div className="flex items-center gap-1.5 border-t border-white/5 px-4 py-2 text-xs text-primary">
            <Shield className="h-3 w-3" />
            <span>Casque fourni</span>
          </div>
        )}

        {/* Hover glow line top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
    </motion.div>
  );
};

export default TripCard;
