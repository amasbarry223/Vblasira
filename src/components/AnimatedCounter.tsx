import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    className?: string;
}

const AnimatedCounter = ({ value, suffix = '', prefix = '', duration = 2, className = '' }: AnimatedCounterProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const motionValue = useMotionValue(0);
    const spring = useSpring(motionValue, { damping: 40, stiffness: 90 });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, motionValue, value]);

    useEffect(() => {
        return spring.on('change', (v) => {
            if (ref.current) {
                ref.current.textContent = prefix + Math.round(v).toLocaleString() + suffix;
            }
        });
    }, [spring, prefix, suffix]);

    return (
        <span ref={ref} className={className}>
            {prefix}0{suffix}
        </span>
    );
};

interface StatItemProps {
    value: string;
    label: string;
    numericValue: number;
    suffix?: string;
    delay?: number;
}

export const StatItem = ({ value, label, numericValue, suffix = '', delay = 0 }: StatItemProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="flex flex-col items-center"
    >
        <div className="text-3xl font-display font-bold md:text-4xl lg:text-5xl text-gradient-mali">
            <AnimatedCounter value={numericValue} suffix={suffix} />
        </div>
        <div className="mt-1 text-xs text-muted-foreground md:text-sm font-medium">{label}</div>
    </motion.div>
);

export default AnimatedCounter;
