import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'signup') {
      const { error } = await signUp(email, password, name);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Compte créé avec succès !');
        navigate('/');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error('Email ou mot de passe incorrect');
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-sm"
      >
        <div className="mb-6 text-center">
          <img src={logo} alt="Blasira" className="mx-auto mb-3 h-20 w-20 object-contain" />
          <h1 className="text-xl font-bold">
            {mode === 'login' ? 'Connexion' : 'Inscription'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {mode === 'login'
              ? 'Connectez-vous à votre compte Blasira'
              : 'Créez votre compte étudiant'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
              <User className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}

          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-mali py-3 text-sm font-bold text-primary-foreground shadow-mali disabled:opacity-50"
          >
            {loading
              ? '...'
              : mode === 'login'
              ? 'Se connecter'
              : "S'inscrire"}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {mode === 'login' ? "Pas encore de compte ?" : 'Déjà un compte ?'}{' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="font-semibold text-primary"
          >
            {mode === 'login' ? "S'inscrire" : 'Se connecter'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
