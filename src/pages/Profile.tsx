import { Star, Shield, Settings, LogOut, ChevronRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="pb-20">
      <div className="container py-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <div className="relative mx-auto mb-3 h-20 w-20">
            <img
              src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.name || 'U'}&background=2D6A4F&color=fff`}
              alt="Profil"
              className="h-full w-full rounded-full object-cover ring-4 ring-primary/20"
            />
            {profile?.verification_status === 'verified' && (
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Shield className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </div>
          <h1 className="text-lg font-bold">{profile?.name || 'Utilisateur'}</h1>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Shield className="h-3 w-3 text-primary" />
            {profile?.role === 'student' ? 'Étudiant' : 'Conducteur'} • {profile?.university || 'Non renseigné'}
          </div>

          <div className="mt-3 flex justify-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-0.5 text-sm font-bold">
                <Star className="h-3.5 w-3.5 fill-mali-gold text-mali-gold" />
                {profile?.rating || 0}
              </div>
              <div className="text-[10px] text-muted-foreground">Note</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold">{profile?.total_trips || 0}</div>
              <div className="text-[10px] text-muted-foreground">Trajets</div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-1">
          {[
            { icon: Settings, label: 'Paramètres', action: () => {} },
            { icon: Award, label: 'Modifier le profil', action: () => {} },
            { icon: LogOut, label: 'Se déconnecter', danger: true, action: handleSignOut },
          ].map(({ icon: Icon, label, danger, action }) => (
            <button
              key={label}
              onClick={action}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors hover:bg-muted ${danger ? 'text-destructive' : ''}`}
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
