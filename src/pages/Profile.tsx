import { Star, Shield, Car, Calendar, Settings, LogOut, ChevronRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const badges = [
  { icon: '🥉', label: 'Première course', unlocked: true },
  { icon: '🥈', label: 'Régulier', unlocked: false },
  { icon: '🥇', label: 'Expert', unlocked: false },
  { icon: '🌟', label: '5 étoiles', unlocked: false },
  { icon: '🌱', label: 'Eco-responsable', unlocked: true },
];

const Profile = () => {
  return (
    <div className="pb-20">
      <div className="container py-4">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="relative mx-auto mb-3 h-20 w-20">
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="Profil"
              className="h-full w-full rounded-full object-cover ring-4 ring-primary/20"
            />
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Shield className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-lg font-bold">Amadou Traoré</h1>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Shield className="h-3 w-3 text-primary" />
            Étudiant vérifié • USSGB
          </div>

          <div className="mt-3 flex justify-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-0.5 text-sm font-bold">
                <Star className="h-3.5 w-3.5 fill-mali-gold text-mali-gold" />
                4.9
              </div>
              <div className="text-[10px] text-muted-foreground">28 avis</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold">32</div>
              <div className="text-[10px] text-muted-foreground">Trajets</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold">4 mois</div>
              <div className="text-[10px] text-muted-foreground">Membre</div>
            </div>
          </div>
        </motion.div>

        {/* Badges */}
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-semibold">🏆 Badges</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {badges.map((b) => (
              <div
                key={b.label}
                className={`flex shrink-0 flex-col items-center rounded-lg border px-3 py-2 ${
                  b.unlocked ? 'border-primary/30 bg-primary/5' : 'border-border opacity-40'
                }`}
              >
                <span className="text-lg">{b.icon}</span>
                <span className="mt-0.5 text-[10px] font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reviews */}
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-semibold">💬 Avis récents</h2>
          <div className="space-y-2">
            {[
              { name: 'Fatoumata D.', rating: 5, comment: 'Très ponctuel !', date: 'Il y a 3 jours' },
              { name: 'Ibrahim K.', rating: 4, comment: 'Trajet agréable', date: 'Il y a 1 semaine' },
            ].map((review, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="h-3 w-3 fill-mali-gold text-mali-gold" />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{review.date}</span>
                </div>
                <p className="mt-1 text-xs">"{review.comment}"</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-1">
          {[
            { icon: Settings, label: 'Paramètres' },
            { icon: Award, label: 'Modifier le profil' },
            { icon: LogOut, label: 'Se déconnecter', danger: true },
          ].map(({ icon: Icon, label, danger }) => (
            <button
              key={label}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors hover:bg-muted ${
                danger ? 'text-destructive' : ''
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
