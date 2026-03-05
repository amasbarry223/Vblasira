import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, User, Eye, EyeOff, Shield, ArrowRight, Sparkles } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AuroraBackground from '@/components/AuroraBackground';

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

  const formatPhone = (val: string) => {
    // Remove non-digits
    const digits = val.replace(/\D/g, '');
    // Take only first 8 digits
    const limited = digits.slice(0, 8);
    // Format as XX XX XX XX
    const parts = [];
    for (let i = 0; i < limited.length; i += 2) {
      parts.push(limited.slice(i, i + 2));
    }
    return parts.join(' ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);

    if (mode === 'signup') {
      const { error } = await signUp(phone, password, name);
      if (error) toast.error(error.message);
      else { toast.success('Compte créé avec succès !'); navigate('/'); }
    } else {
      const { error } = await signIn(phone, password);
      if (error) toast.error('Numéro ou mot de passe incorrect');
      else navigate('/');
    }
    setLoading(false);
  };

  return (
    <AuroraBackground className="flex min-h-[88vh] items-center justify-center pb-24 px-4 py-10" intensity="low">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md relative"
      >
        <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10" />
        <div className="bg-glass-premium backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-card md:p-10">

          {/* Logo & Header */}
          <div className="mb-8 text-center">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-mali shadow-mali ring-4 ring-white/5"
            >
              <img src={logo} alt="Blasira" className="h-14 w-14 object-contain" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold md:text-4xl tracking-tight">
              {mode === 'login' ? 'Bon retour 👋' : 'Rejoignez-nous ✨'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === 'login'
                ? 'Connectez-vous avec votre numéro'
                : 'Créez votre compte étudiant en quelques secondes'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="mb-6 flex rounded-2xl border border-white/8 bg-muted/30 p-1">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`relative flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${mode === m ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {mode === m && (
                  <motion.div
                    layoutId="auth-tab"
                    className="absolute inset-0 rounded-xl bg-card shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10">
                  {m === 'login' ? 'Connexion' : 'Inscription'}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Nom complet
                  </label>
                  <div className={`flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3.5 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 ${name.trim().length > 0 && name.trim().length < 2 ? 'border-destructive/50' : 'border-white/8'
                    }`}>
                    <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="ex: Amadou Traoré"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Numéro de téléphone
              </label>
              <div className={`flex items-center gap-3 rounded-2xl border bg-muted/20 px-4 py-4 transition-all duration-300 focus-within:border-primary/50 focus-within:bg-primary/5 focus-within:ring-4 focus-within:ring-primary/10 ${phone.length > 0 && !isPhoneValid ? 'border-destructive/30 bg-destructive/5' : 'border-white/5'
                }`}>
                <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="text-sm font-bold text-primary tracking-tighter self-center">+223</span>
                <input
                  type="tel"
                  placeholder="76 12 34 56"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  required
                  maxLength={11} // 8 digits + 3 spaces
                  className="flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-muted-foreground/30"
                />
                {isPhoneValid && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Shield className="h-4 w-4 text-primary" />
                  </motion.div>
                )}
              </div>
              {phone.length > 0 && !isPhoneValid && (
                <p className="mt-1.5 text-[11px] text-destructive">Entrez un numéro à 8 chiffres</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Mot de passe
              </label>
              <div className={`flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3.5 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 ${password.length > 0 && !isPasswordValid ? 'border-destructive/50' : 'border-white/8'
                }`}>
                <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !isFormValid}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-mali py-4 text-sm font-bold text-white shadow-mali transition-all hover:opacity-90 hover:shadow-glow-green disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <motion.div
                  className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {mode === 'signup' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-[11px] text-muted-foreground">
              En créant un compte, vous acceptez nos conditions d'utilisation
            </motion.p>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ? "Pas encore de compte ?" : 'Déjà un compte ?'}{' '}
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="font-semibold text-primary hover:underline"
              >
                {mode === 'login' ? "S'inscrire" : 'Se connecter'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
};

export default Auth;
