import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ── Slideshow data ──────────────────────────────────────────────────────────
const SLIDES = [
    {
        image:   'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80',
        badge:   'World-Class Universities',
        label:   'Stanford University, USA',
        tagline: 'Research fellowships, exchange programs & summer schools at Stanford, MIT & Caltech.',
    },
    {
        image:   'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1920&q=80',
        badge:   'University of Oxford',
        label:   'Oxford · Cambridge · TU Munich',
        tagline: 'Fully-funded scholarships at the world\'s top-ranked universities — exclusively for Pakistan\'s brightest.',
    },
    {
        image:   'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',
        badge:   'Ivy League Opportunities',
        label:   'Harvard University, USA',
        tagline: 'Harvard summer schools, research attachments & Ivy League leadership programs.',
    },
    {
        image:   'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
        badge:   'Internships at Tech Giants',
        label:   'Google · Microsoft · Meta · Apple',
        tagline: 'World-leading tech companies actively recruiting NUST students right now.',
    },
    {
        image:   'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80',
        badge:   'Corporate & Industry Exposure',
        label:   'Amazon · McKinsey · Goldman Sachs',
        tagline: 'Fortune 500 companies & top employers recruiting NUST talent — all in one verified listing.',
    },
    {
        image:   'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80',
        badge:   'Hackathons & Competitions',
        label:   'Build · Compete · Win',
        tagline: 'Win up to PKR 500,000 in prizes — and the portfolio, network, and career momentum to match.',
    },
];

const SLIDE_DURATION = 4500; // ms

// ── Scroll-visibility hook ──────────────────────────────────────────────────
function useVisible(threshold = 0.15) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
}

// ── Animated counter ────────────────────────────────────────────────────────
function Counter({ target, suffix = '', visible }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!visible) return;
        const steps = 60;
        const inc   = target / steps;
        let cur     = 0;
        const timer = setInterval(() => {
            cur += inc;
            if (cur >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(cur));
        }, 1800 / steps);
        return () => clearInterval(timer);
    }, [visible, target]);
    return <>{count}{suffix}</>;
}

// ── Static data ─────────────────────────────────────────────────────────────
// IDs match backend/config/constants.js exactly
const CATEGORIES = [
    { id: 1, icon: '💼', name: 'Internships',       desc: 'Top companies, paid roles, real experience',     color: '#4f46e5', bg: '#eef2ff' },
    { id: 2, icon: '🎓', name: 'Scholarships',      desc: 'Fully-funded awards & merit fellowships',         color: '#059669', bg: '#ecfdf5' },
    { id: 3, icon: '💡', name: 'Hackathons',        desc: 'Build, compete & win in 24–48 hours',             color: '#d97706', bg: '#fffbeb' },
    { id: 4, icon: '🔬', name: 'Research',          desc: 'Publish with faculty on live projects',           color: '#7c3aed', bg: '#f5f3ff' },
    { id: 5, icon: '📚', name: 'Courses',           desc: 'Free certifications from MIT, Google & more',     color: '#dc2626', bg: '#fef2f2' },
    { id: 6, icon: '🌐', name: 'Exchange Programs', desc: 'Semesters abroad at world-class universities',    color: '#0891b2', bg: '#f0f9ff' },
    { id: 7, icon: '🏆', name: 'Competitions',      desc: 'Prize money, prestige & global recognition',      color: '#b45309', bg: '#fef3c7' },
    { id: 8, icon: '🛠️', name: 'Workshops',        desc: 'Hands-on skills from industry experts',           color: '#0f766e', bg: '#f0fdfa' },
];

const STATS = [
    { value: 246, suffix: '+', label: 'Active Opportunities' },
    { value: 10,  suffix: '',  label: 'Departments' },
    { value: 8,   suffix: '',  label: 'Opportunity Types' },
    { value: 500, suffix: '+', label: 'Students Enrolled' },
];

const STEPS = [
    { num: '01', icon: '🔍', title: 'Browse & Filter',  desc: 'Filter by department, category, and mode to find what fits you.' },
    { num: '02', icon: '🔖', title: 'Save & Track',     desc: 'Bookmark opportunities and get notified before deadlines.' },
    { num: '03', icon: '✉️', title: 'Apply',            desc: 'Apply directly and track everything in one place.' },
];

// ── HeroBtn — animated CTA button ───────────────────────────────────────────
function HeroBtn({ to, primary, fullWidth, children }) {
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);

    const scale = pressed ? 0.96 : hovered ? 1.05 : 1;
    const shadow = primary
        ? hovered
            ? '0 10px 36px rgba(124,58,237,0.72), 0 0 0 3px rgba(167,139,250,0.28)'
            : '0 4px 20px rgba(124,58,237,0.50)'
        : hovered
            ? '0 8px 28px rgba(0,0,0,0.32), 0 0 0 2px rgba(167,139,250,0.40)'
            : 'none';

    return (
        <Link
            to={to}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setPressed(false); }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            style={{
                display: 'inline-block',
                padding: '13px 36px',
                borderRadius: 12,
                fontWeight: primary ? 700 : 600,
                fontSize: '0.95rem',
                width: fullWidth ? 280 : 'auto',
                minWidth: fullWidth ? 'unset' : 220,
                textAlign: 'center',
                boxSizing: 'border-box',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease',
                transform: `scale(${scale})`,
                boxShadow: shadow,
                ...(primary ? {
                    background: hovered
                        ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                        : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    color: '#fff',
                    border: 'none',
                } : {
                    background: hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.09)',
                    color: '#fff',
                    border: `1px solid ${hovered ? 'rgba(167,139,250,0.60)' : 'rgba(167,139,250,0.30)'}`,
                    backdropFilter: 'blur(10px)',
                }),
            }}
        >
            {children}
        </Link>
    );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function LandingPage() {
    // Slideshow state
    const [slide, setSlide]           = useState(0);
    const [textVisible, setTextVisible] = useState(true);
    const timerRef = useRef(null);

    function resetTimer() {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(
            () => setSlide(s => (s + 1) % SLIDES.length),
            SLIDE_DURATION
        );
    }

    useEffect(() => {
        resetTimer();
        return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Briefly hide text so it fades in with each slide change
    useEffect(() => {
        setTextVisible(false);
        const t = setTimeout(() => setTextVisible(true), 500);
        return () => clearTimeout(t);
    }, [slide]);

    function goTo(i)  { setSlide(i); resetTimer(); }

    // Scroll-section hooks
    const [statsRef,  statsVisible]  = useVisible(0.2);
    const [catRef,    catVisible]    = useVisible(0.1);
    const [stepsRef,  stepsVisible]  = useVisible(0.1);
    const [ctaRef,    ctaVisible]    = useVisible(0.2);

    return (
        <div style={{ overflowX: 'hidden' }}>

            {/* ═══════════════════════════ HERO SLIDESHOW ═══════════════════════════ */}
            <section style={{
                position: 'relative',
                minHeight: 'calc(100vh - 64px)',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
            }}>
                {/* ── Background image layers (cross-fade) ── */}
                {SLIDES.map((s, i) => (
                    <div key={i} style={{
                        position: 'absolute', inset: 0,
                        backgroundImage:    `url(${s.image})`,
                        backgroundSize:     'cover',
                        backgroundPosition: 'center',
                        opacity:    i === slide ? 1 : 0,
                        transition: 'opacity 1.3s ease-in-out',
                        zIndex: 0,
                    }} />
                ))}

                {/* ── Dark gradient overlay ── */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(105deg, rgba(15,14,43,0.96) 0%, rgba(30,27,75,0.86) 55%, rgba(49,46,129,0.60) 100%)',
                    zIndex: 1,
                }} />

                {/* ── Subtle grid overlay ── */}
                <div className="hero-grid" style={{ zIndex: 2 }} />

                {/* ── Floating ambient shapes ── */}
                <div className="hero-shape hero-shape-1" style={{ zIndex: 2 }} />
                <div className="hero-shape hero-shape-2" style={{ zIndex: 2 }} />
                <div className="hero-orb-1" style={{ zIndex: 2 }} />
                <div className="hero-orb-2" style={{ zIndex: 2 }} />
                <div className="hero-orb-3" style={{ zIndex: 2 }} />
                {/* Glowing floating balls */}
                <div className="lp-ball lp-ball-1" style={{ zIndex: 3 }} />
                <div className="lp-ball lp-ball-2" style={{ zIndex: 3 }} />
                <div className="lp-ball lp-ball-3" style={{ zIndex: 3 }} />
                <div className="lp-ball lp-ball-4" style={{ zIndex: 3 }} />
                <div className="lp-ball lp-ball-5" style={{ zIndex: 3 }} />
                <div className="lp-ball lp-ball-6" style={{ zIndex: 3 }} />

                {/* ── HERO CONTENT ── */}
                <div className="max-w-7xl mx-auto px-6 w-full" style={{
                    position: 'relative', zIndex: 3,
                    paddingTop: 56, paddingBottom: 100,
                }}>
                    <div style={{ maxWidth: 680 }}>

                        {/* Animated badge — changes per slide */}
                        <div style={{
                            opacity: textVisible ? 1 : 0,
                            transform: textVisible ? 'translateY(0)' : 'translateY(10px)',
                            transition: 'opacity 0.55s ease, transform 0.55s ease',
                            marginBottom: 18,
                        }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                background: 'rgba(167,139,250,0.15)',
                                border: '1px solid rgba(167,139,250,0.32)',
                                borderRadius: 100, padding: '5px 16px',
                            }}>
                                <span className="pulse-dot" style={{
                                    width: 6, height: 6, borderRadius: '50%',
                                    background: '#a78bfa', display: 'block', flexShrink: 0,
                                }} />
                                <span style={{
                                    fontSize: '0.70rem', color: '#a78bfa',
                                    fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
                                }}>
                                    {SLIDES[slide].badge}
                                </span>
                            </div>
                        </div>

                        {/* Static headline */}
                        <h1 className="fade-up fade-up-delay-1" style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
                            fontWeight: 800,
                            color: '#ffffff',
                            lineHeight: 1.12,
                            marginBottom: 18,
                            letterSpacing: '-0.02em',
                        }}>
                            Your All-in-One Hub<br />
                            <span className="grad-text">for Campus Opportunities</span>
                        </h1>

                        {/* Dynamic tagline — changes per slide */}
                        <p style={{
                            color: 'rgba(196,181,253,0.75)',
                            fontSize: '1rem', fontWeight: 400,
                            marginBottom: 34, lineHeight: 1.6,
                            maxWidth: 480,
                            opacity: textVisible ? 1 : 0,
                            transition: 'opacity 0.55s ease 0.1s',
                        }}>
                            {SLIDES[slide].tagline}
                        </p>

                        {/* CTAs */}
                        <div className="fade-up fade-up-delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 44, alignItems: 'flex-start' }}>
                            <HeroBtn to="/opportunities" primary fullWidth>
                                Explore Opportunities →
                            </HeroBtn>
                            <HeroBtn to="/register" fullWidth>
                                Create Free Account
                            </HeroBtn>
                        </div>

                        {/* Trust badges */}
                        <div className="fade-up fade-up-delay-4" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                            {['246+ Opportunities', 'Free', 'NUST Verified'].map(badge => (
                                <div key={badge} style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    color: 'rgba(255,255,255,0.40)', fontSize: '0.78rem',
                                }}>
                                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                                        <circle cx="7" cy="7" r="7" fill="rgba(167,139,250,0.18)" />
                                        <path d="M4 7l2 2 4-4" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {badge}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── NAVIGATION DOTS ── */}
                <div style={{
                    position: 'absolute', bottom: 44,
                    left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', alignItems: 'center', gap: 8,
                    zIndex: 10,
                }}>
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            style={{
                                width:  i === slide ? 32 : 8,
                                height: 8,
                                borderRadius: 4,
                                background: i === slide
                                    ? 'linear-gradient(90deg, #a78bfa, #7c3aed)'
                                    : 'rgba(255,255,255,0.28)',
                                border: 'none', cursor: 'pointer', padding: 0,
                                transition: 'all 0.35s ease',
                                flexShrink: 0,
                                boxShadow: i === slide ? '0 0 10px rgba(167,139,250,0.5)' : 'none',
                            }}
                        />
                    ))}
                </div>


                {/* ── SLIDE COUNTER (top-right) ── */}
                <div style={{
                    position: 'absolute', top: 24, right: 24,
                    zIndex: 10, color: 'rgba(255,255,255,0.35)',
                    fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em',
                }}>
                    {String(slide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                </div>

                {/* ── PROGRESS BAR ── */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 2, background: 'rgba(255,255,255,0.10)', zIndex: 10,
                }}>
                    <div
                        key={slide}
                        style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #fbbf24)',
                            animation: `slideProgress ${SLIDE_DURATION}ms linear forwards`,
                        }}
                    />
                </div>
            </section>

            {/* ═══════════════════════════ STATS ═══════════════════════════ */}
            <section ref={statsRef} style={{
                background: 'linear-gradient(135deg, #0f0e2b 0%, #1e1b4b 100%)',
                borderBottom: '1px solid rgba(167,139,250,0.15)',
            }}>
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 32 }}>
                        {STATS.map((stat, i) => (
                            <div key={stat.label} style={{
                                textAlign: 'center',
                                opacity:   statsVisible ? 1 : 0,
                                transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
                                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                            }}>
                                <div className="grad-text" style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '2.9rem', fontWeight: 800,
                                    lineHeight: 1,
                                }}>
                                    <Counter target={stat.value} suffix={stat.suffix} visible={statsVisible} />
                                </div>
                                <div style={{ color: 'rgba(196,181,253,0.70)', fontSize: '0.83rem', marginTop: 10, fontWeight: 500 }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ CATEGORIES ═══════════════════════════ */}
            <section ref={catRef} style={{ background: '#f5f3ff', padding: '72px 0' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <SectionHeader
                        eyebrow="What We Offer"
                        title="Opportunities Across All Fields"
                        body=""
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
                        {CATEGORIES.map((cat, i) => (
                            <CategoryCard key={cat.name} cat={cat} visible={catVisible} delay={i * 0.08} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ HOW IT WORKS ═══════════════════════════ */}
            <section ref={stepsRef} style={{ background: '#ffffff', padding: '72px 0' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <SectionHeader
                        eyebrow="Simple Process"
                        title="How It Works"
                        body=""
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 36 }}>
                        {STEPS.map((step, i) => (
                            <div key={step.num} style={{
                                opacity:   stepsVisible ? 1 : 0,
                                transform: stepsVisible ? 'translateY(0)' : 'translateY(28px)',
                                transition: `opacity 0.55s ease ${i * 0.15}s, transform 0.55s ease ${i * 0.15}s`,
                            }}>
                                <div style={{
                                    fontSize: '0.7rem', fontWeight: 700, color: '#7c3aed',
                                    letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase',
                                }}>
                                    Step {step.num}
                                </div>
                                <div style={{
                                    width: 62, height: 62, borderRadius: 16,
                                    background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 28, marginBottom: 20,
                                    boxShadow: '0 8px 24px rgba(109,40,217,0.30)',
                                }}>
                                    {step.icon}
                                </div>
                                <h3 style={{ fontWeight: 700, fontSize: '1.07rem', color: '#1a1035', marginBottom: 9 }}>
                                    {step.title}
                                </h3>
                                <p style={{ fontSize: '0.87rem', color: '#6b7280', lineHeight: 1.68 }}>
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ CTA BANNER ═══════════════════════════ */}
            <section ref={ctaRef} style={{
                background: 'linear-gradient(135deg, #0f0e2b 0%, #1e1b4b 50%, #312e81 100%)',
                padding: '90px 24px', position: 'relative', overflow: 'hidden',
            }}>
                <div className="cta-orb-1" />
                <div className="cta-orb-2" />
                <div className="cta-orb-3" />
                <div className="cta-orb-4" />
                <div className="cta-orb-5" />
                <div className="cta-orb-6" />
                <div className="cta-ball cta-ball-1" />
                <div className="cta-ball cta-ball-2" />
                <div className="cta-ball cta-ball-3" />
                <div className="cta-ball cta-ball-4" />
                <div className="max-w-3xl mx-auto text-center" style={{
                    position: 'relative', zIndex: 1,
                    opacity: ctaVisible ? 1 : 0,
                    transform: ctaVisible ? 'translateY(0)' : 'translateY(22px)',
                    transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}>
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                        fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: 32,
                    }}>
                        Start Discovering<br />
                        <span className="grad-text">Your Next Opportunity</span>
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                        <HeroBtn to="/register" primary fullWidth>
                            Create Free Account
                        </HeroBtn>
                        <HeroBtn to="/opportunities" fullWidth>
                            Browse Without Signing Up
                        </HeroBtn>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
            <footer style={{
                background: '#09091f',
                padding: '28px 24px', textAlign: 'center',
                borderTop: '1px solid rgba(167,139,250,0.10)',
            }}>
                <p style={{ color: 'rgba(196,181,253,0.30)', fontSize: '0.8rem', margin: 0 }}>
                    © 2025 Campus Opportunity Aggregator &nbsp;·&nbsp; NUST &nbsp;·&nbsp; All rights reserved
                </p>
            </footer>
        </div>
    );
}

function SectionHeader({ eyebrow, title, body }) {
    return (
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{
                fontSize: '0.68rem', letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#7c3aed',
                fontWeight: 700, marginBottom: 10,
            }}>{eyebrow}</p>
            <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 800, color: '#1a1035', marginBottom: body ? 12 : 0,
            }}>{title}</h2>
            {body && (
                <p style={{
                    color: '#9ca3af', fontSize: '0.88rem',
                    maxWidth: 420, margin: '0 auto', lineHeight: 1.6,
                }}>{body}</p>
            )}
        </div>
    );
}

function CategoryCard({ cat, visible, delay }) {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/opportunities?category_id=${cat.id}`)}
            onKeyDown={e => e.key === 'Enter' && navigate(`/opportunities?category_id=${cat.id}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#ffffff',
                border: `1px solid ${hovered ? cat.color : '#e5e7eb'}`,
                borderRadius: 16, padding: '28px 24px', cursor: 'pointer',
                opacity:   visible ? 1 : 0,
                transform: visible ? (hovered ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(26px)',
                transition: `opacity 0.5s ease ${delay}s, transform 0.25s ease, border-color 0.2s, box-shadow 0.25s`,
                boxShadow: hovered ? `0 12px 36px rgba(0,0,0,0.12), 0 0 0 1px ${cat.color}22` : '0 1px 4px rgba(0,0,0,0.04)',
                textDecoration: 'none',
                userSelect: 'none',
            }}
        >
            <div style={{
                width: 50, height: 50, borderRadius: 12,
                background: hovered ? cat.bg : '#f9fafb',
                border: `1px solid ${hovered ? cat.color + '40' : '#e5e7eb'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, marginBottom: 16, transition: 'background 0.2s, border-color 0.2s',
            }}>
                {cat.icon}
            </div>
            <h3 style={{
                fontWeight: 700, fontSize: '0.97rem',
                color: hovered ? cat.color : '#1a1f36',
                marginBottom: 7, transition: 'color 0.2s',
            }}>
                {cat.name}
                <span style={{
                    marginLeft: 6, fontSize: '0.75rem', opacity: hovered ? 0.7 : 0,
                    transition: 'opacity 0.2s',
                }}>→</span>
            </h3>
            <p style={{ fontSize: '0.80rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
                {cat.desc}
            </p>
        </div>
    );
}
