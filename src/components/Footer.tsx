import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin, Zap } from 'lucide-react';
import { MiniAurora } from '@/components/AuroraBackground';

const footerSections = [
  {
    title: 'Produit',
    links: [
      { label: 'Chercher un trajet', to: '/search' },
      { label: 'Publier un trajet', to: '/publish' },
      { label: 'Comment ça marche', to: '/#comment-ca-marche' },
      { label: 'Tarifs', to: '/#tarifs' },
    ],
  },
  {
    title: 'Communauté',
    links: [
      { label: 'Charte de confiance', to: '/#charte' },
      { label: 'Sécurité', to: '/#securite' },
      { label: 'Signalement', to: '/#signalement' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos de Blasira', to: '/#a-propos' },
      { label: 'Contact', to: '/#contact' },
      { label: 'FAQ', to: '/#faq' },
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-4 border-t border-white/5 bg-background overflow-hidden">
      <MiniAurora className="opacity-30" />

      <div className="container relative z-10 section-padding">
        {/* Top row */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand block */}
          <div className="lg:col-span-1">
            <Link to="/" className="group inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-mali shadow-mali transition-transform group-hover:scale-105">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-2xl font-bold text-gradient-mali">
                Blasira
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Covoiturage et moto-partage pour étudiants au Mali. Déplacez-vous ensemble, dépensez moins.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <div className="flex h-7 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" />
                Bamako, Mali 🇲🇱
              </div>
            </div>
          </div>

          {/* Nav sections */}
          {footerSections.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: si * 0.08, duration: 0.4 }}
            >
              <h3 className="mb-4 text-sm font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Blasira. Tous droits réservés. Fait avec ❤️ au Mali.
          </p>
          <div className="flex gap-5">
            <Link to="/#mentions" className="text-xs text-muted-foreground transition-colors hover:text-primary">Mentions légales</Link>
            <Link to="/#confidentialite" className="text-xs text-muted-foreground transition-colors hover:text-primary">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
