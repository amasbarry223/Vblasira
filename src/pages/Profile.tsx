import { Star, Shield, Settings, LogOut, ChevronRight, Award, User, Check, X, Camera, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '@/lib/api';
import { toast } from 'sonner';

const Profile = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile?.name || '',
    university: profile?.university || ''
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSave = async () => {
    if (!profile?.id) return;
    try {
      await updateProfile(profile.id, {
        name: editForm.name,
        university: editForm.university
      });
      toast.success('Profil mis à jour !');
      setIsEditing(false);
      // Refresh logic would go here, for now it's just a UI state
    } catch (e) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const menuItems = [
    { icon: Award, label: 'Modifier le profil', action: () => setIsEditing(true), danger: false },
    { icon: Settings, label: 'Paramètres', action: () => { }, danger: false },
    { icon: LogOut, label: 'Se déconnecter', action: handleSignOut, danger: true },
  ];

  return (
    <div className="pb-24 min-h-screen">
      <div className="container max-w-lg mx-auto section-padding-sm">

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-6 bg-glass-premium backdrop-blur-xl border border-white/5 rounded-[32px] p-8 text-center shadow-card relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10" />
          {/* Avatar with animated gradient ring */}
          <div className="relative mx-auto mb-4 h-24 w-24">
            <div className="absolute inset-0 rounded-full bg-gradient-mali p-[2.5px] shadow-mali">
              <div className="h-full w-full rounded-full overflow-hidden bg-card relative">
                <img
                  src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.name || 'U'}&background=22C55E&color=fff&size=200`}
                  alt="Profil"
                  className="h-full w-full object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
            </div>
            {profile?.verification_status === 'verified' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-glow-green ring-2 ring-background"
              >
                <Shield className="h-3.5 w-3.5 text-white" />
              </motion.div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3 px-4"
              >
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-muted/30 px-3 py-2 text-center text-sm font-bold outline-none focus:border-primary/50"
                    placeholder="Nom complet"
                  />
                  <input
                    type="text"
                    value={editForm.university}
                    onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-muted/30 px-3 py-2 text-center text-xs outline-none focus:border-primary/50"
                    placeholder="Université"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 rounded-xl bg-muted py-2 text-xs font-bold transition-all hover:bg-muted/80"
                  >
                    <X className="mr-1 inline h-3 w-3" /> Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 rounded-xl bg-primary py-2 text-xs font-bold text-white transition-all hover:bg-primary/90"
                  >
                    <Check className="mr-1 inline h-3 w-3" /> Enregistrer
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h1 className="font-display text-xl font-bold">{profile?.name || 'Utilisateur'}</h1>
                <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  {profile?.role === 'student' ? 'Étudiant' : 'Conducteur'}
                  {profile?.university && (
                    <>
                      <span className="text-border">·</span>
                      <span>{profile.university}</span>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats row */}
          <div className="mt-8 flex justify-center gap-12 border-t border-white/5 pt-6">
            {[
              { label: 'Note globale', value: profile?.rating ?? 0, icon: Star, iconClass: 'fill-amber-400 text-amber-400' },
              { label: 'Trajets publiés', value: profile?.total_trips ?? 0, icon: Car, iconClass: 'text-primary' },
            ].map(({ label, value, icon: Icon, iconClass }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-2xl font-display font-bold tracking-tight">
                  {Icon && <Icon className={`h-5 w-5 ${iconClass}`} />}
                  {value}
                </div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Menu items */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-glass-premium backdrop-blur-xl border border-white/5 rounded-[28px] overflow-hidden shadow-card"
        >
          {menuItems.map(({ icon: Icon, label, danger, action }, i) => (
            <button
              key={label}
              type="button"
              onClick={action}
              className={`group flex w-full items-center gap-4 border-b border-white/5 px-6 py-5 text-sm transition-all last:border-b-0 hover:bg-white/5 active:bg-white/8 ${danger ? 'text-destructive hover:bg-destructive/5' : 'text-foreground hover:text-primary'}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-[14px] transition-transform group-hover:scale-110 ${danger ? 'bg-destructive/10' : 'bg-muted/50 group-hover:bg-primary/10'}`}>
                <Icon className={`h-5 w-5 ${danger ? 'text-destructive' : 'text-muted-foreground group-hover:text-primary'}`} />
              </div>
              <span className="flex-1 text-left font-bold tracking-tight">{label}</span>
              <ChevronRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${danger ? 'text-destructive/50' : 'text-muted-foreground group-hover:text-primary'}`} />
            </button>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          Blasira · Covoiturage étudiant au Mali 🇲🇱
        </motion.p>
      </div>
    </div>
  );
};

export default Profile;
