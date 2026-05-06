"use client";

export default function AmbientParticles() {
    // Reduced to 7 particles for a subtler effect
    const particles = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        left: `${(i * 14 + 5) % 100}%`,
        size: 1.5 + (i % 3) * 0.6,
        delay: `${(i * 2.5) % 15}s`,
        duration: `${16 + (i % 4) * 4}s`,
        opacity: 0.1 + (i % 3) * 0.06,
        alt: i % 2 === 0,
    }));

    return (
        <div className="fixed inset-0 z-[3] pointer-events-none overflow-hidden" aria-hidden="true">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: p.left,
                        bottom: `-${p.size * 4}px`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        opacity: p.opacity,
                        animation: `${p.alt ? 'float-up-alt' : 'float-up'} ${p.duration} ${p.delay} linear infinite`,
                    }}
                />
            ))}
        </div>
    );
}
