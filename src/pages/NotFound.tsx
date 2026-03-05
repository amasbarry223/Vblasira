import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowRight } from 'lucide-react';
import AuroraBackground from '@/components/AuroraBackground';

const NotFound = () => (
  <AuroraBackground className="flex min-h-screen items-center justify-center px-4 text-center" intensity="low">
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Big 404 */}
        <div className="font-display font-bold leading-none text-gradient-mali"
          style={{ fontSize: 'clamp(6rem, 20vw, 14rem)' }}
        >
          404
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">Page introuvable</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
          La page que vous cherchez n'existe pas ou a été déplacée. Revenons sur la bonne route !
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-mali px-6 py-3 text-sm font-bold text-white shadow-mali transition-all hover:scale-105 hover:shadow-glow-green active:scale-95"
        >
          <Home className="h-4 w-4" />
          Retour à l'accueil
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  </AuroraBackground>
);

export default NotFound;
