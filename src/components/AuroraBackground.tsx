import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AuroraBackgroundProps {
    className?: string;
    intensity?: 'low' | 'medium' | 'high';
    children?: React.ReactNode;
}

const AuroraBackground = ({ className = '', intensity = 'medium', children }: AuroraBackgroundProps) => {
    const opacity = intensity === 'low' ? 0.3 : intensity === 'high' ? 0.7 : 0.5;

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Aurora blobs */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

                {/* Blob 1 — Green */}
                <div
                    className="absolute -top-[20%] -left-[10%] h-[70%] w-[60%] rounded-full transition-transform duration-[10s]"
                    style={{
                        background: `radial-gradient(ellipse at center, hsl(var(--mali-green) / ${opacity}) 0%, transparent 70%)`,
                        filter: 'blur(100px)',
                        animation: 'aurora-1 20s ease-in-out infinite alternate',
                    }}
                />
                {/* Blob 2 — Gold */}
                <div
                    className="absolute -bottom-[15%] -right-[5%] h-[60%] w-[55%] rounded-full"
                    style={{
                        background: `radial-gradient(ellipse at center, hsl(var(--mali-gold) / ${opacity * 0.7}) 0%, transparent 70%)`,
                        filter: 'blur(110px)',
                        animation: 'aurora-2 25s ease-in-out infinite alternate-reverse',
                    }}
                />
                {/* Blob 3 — Red accent */}
                <div
                    className="absolute top-[30%] left-[40%] h-[45%] w-[45%] rounded-full"
                    style={{
                        background: `radial-gradient(ellipse at center, hsl(var(--mali-red) / ${opacity * 0.4}) 0%, transparent 70%)`,
                        filter: 'blur(120px)',
                        animation: 'aurora-3 30s ease-in-out infinite alternate',
                    }}
                />
                {/* Mesh dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export const MiniAurora = ({ className = '' }: { className?: string }) => (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
        <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[70%] w-[80%] rounded-full opacity-20"
            style={{
                background: 'radial-gradient(ellipse at center, hsl(142 71% 45%) 0%, hsl(43 96% 56%) 50%, transparent 70%)',
                filter: 'blur(60px)',
            }}
        />
    </div>
);

export default AuroraBackground;
