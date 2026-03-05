import { motion } from 'framer-motion';

const SectionSeparator = ({ className = '' }: { className?: string }) => {
    return (
        <div className={`container relative py-12 md:py-16 overflow-hidden ${className}`}>
            <div className="flex items-center justify-center">
                {/* Leading gradient line */}
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                {/* Decorative center element */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative mx-8"
                >
                    {/* Outer glow */}
                    <div className="absolute -inset-2 bg-primary/20 blur-md rounded-full" />
                    {/* Inner point */}
                    <div className="relative h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </motion.div>

                {/* Trailing gradient line */}
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>
        </div>
    );
};

export default SectionSeparator;
