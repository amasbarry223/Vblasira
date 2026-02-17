import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, User, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPhoneValid = /^\d{8}$/.test(phone.replace(/\s/g, ''));
  const isPasswordValid = password.length >= 6;
  const isFormValid = mode === 'login'
    ? isPhoneValid && isPasswordValid
    : isPhoneValid && isPasswordValid && name.trim().length >= 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);

    if (mode === 'signup') {
      const { error } = await signUp(phone, password, name);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Compte créé avec succès !');
        navigate('/');
      }
    } else {
      const { error } = await signIn(phone, password);
      if (error) {
        toast.error('Numéro ou mot de passe incorrect');
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo & header */}
        <div className="mb-8 text-center">
          <motion.img
            src={logo}
            alt="Blasira"
            className="mx-auto mb-4 h-20 w-20 object-contain"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          />
          <h1 className="text-2xl font-extrabold">
            {mode === 'login' ? 'Bon retour ! 👋' : 'Rejoignez-nous ! 🎓'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === 'login'
              ? 'Connectez-vous avec votre numéro'
              : 'Créez votre compte étudiant en 30 secondes'}
          </p>
        </div>

        {/* Mode toggle tabs */}
        <div className="mb-6 flex rounded-xl bg-muted p-1">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                mode === m
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Nom complet</label>
                <div className={`flex items-center gap-2 rounded-xl border bg-background px-3 py-3 transition-colors ${
                  name.trim().length > 0 && name.trim().length < 2 ? 'border-destructive' : 'border-border focus-within:border-primary'
                }`}>
                  <User className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="ex: Amadou Traoré"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Numéro de téléphone</label>
            <div className={`flex items-center gap-2 rounded-xl border bg-background px-3 py-3 transition-colors ${
              phone.length > 0 && !isPhoneValid ? 'border-destructive' : 'border-border focus-within:border-primary'
            }`}>
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">+223</span>
              <input
                type="tel"
                placeholder="76 12 34 56"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))}
                required
                maxLength={12}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
              {isPhoneValid && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Shield className="h-4 w-4 text-primary" />
                </motion.div>
              )}
            </div>
            {phone.length > 0 && !isPhoneValid && (
              <p className="mt-1 text-[11px] text-destructive">Entrez un numéro à 8 chiffres</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Mot de passe</label>
            <div className={`flex items-center gap-2 rounded-xl border bg-background px-3 py-3 transition-colors ${
              password.length > 0 && !isPasswordValid ? 'border-destructive' : 'border-border focus-within:border-primary'
            }`}>
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password.length > 0 && !isPasswordValid && (
              <p className="mt-1 text-[11px] text-destructive">Le mot de passe doit contenir au moins 6 caractères</p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading || !isFormValid}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-mali py-3.5 text-sm font-bold text-primary-foreground shadow-mali transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <motion.div
                className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <>
                {mode === 'login' ? 'Se connecter' : "Créer mon compte"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </form>

        {mode === 'signup' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-center text-[11px] text-muted-foreground"
          >
            En créant un compte, vous acceptez nos conditions d'utilisation
          </motion.p>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? "Pas encore de compte ?" : 'Déjà un compte ?'}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-bold text-primary hover:underline"
            >
              {mode === 'login' ? "S'inscrire" : 'Se connecter'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
