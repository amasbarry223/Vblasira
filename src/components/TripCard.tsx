import { Car, Bike, Star, Clock, MapPin, Shield, ArrowRight } from 'lucide-react';
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
    >
      <Link
        to={`/trip/${trip.id}`}
        className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isMoto ? 'bg-secondary/30 text-secondary-foreground' : 'bg-primary/10 text-primary'
          }`}>
            <VehicleIcon className="h-3.5 w-3.5" />
            {isMoto ? 'MOTO' : 'VOITURE'}
          </span>
          <span className="text-xs text-muted-foreground">
            {trip.seats_available} place{trip.seats_available > 1 ? 's' : ''} dispo
          </span>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{trip.departure_name}</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{trip.destination_name}</span>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {trip.departure_time}
          </span>
          <span>⏱️ {trip.duration_min} min</span>
          <span>{trip.distance_km} km</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={trip.driver.avatar_url || `https://ui-avatars.com/api/?name=${trip.driver.name}`}
              alt={trip.driver.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-border"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{trip.driver.name.split(' ')[0]}</span>
                {trip.driver.verification_status === 'verified' && (
                  <Shield className="h-3.5 w-3.5 text-primary" />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-mali-gold text-mali-gold" />
                <span>{trip.driver.rating}</span>
                <span>• {trip.driver.total_trips} trajets</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-primary">{trip.price_per_seat} FCFA</div>
          </div>
        </div>

        {isMoto && trip.helmet_provided && (
          <div className="mt-2 flex items-center gap-1 text-[11px] text-success">
            <Shield className="h-3 w-3" />
            Casque fourni
          </div>
        )}
      </Link>
    </motion.div>
  );
};

export default TripCard;
