'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import './aistyle.css';

export default function AiSolution() {
    const bgRef = useRef(null);
    const glowRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        // --- GSAP Dynamic Canvas Particles ---
        const canvas = bgRef.current;
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            s: Math.random() * 2 + 0.5,
            v: Math.random() * 0.3 + 0.1,
            alpha: Math.random() * 0.5 + 0.2
        }));

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p) => {
                p.y -= p.v;
                if (p.y < 0) p.y = height;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96, 165, 250, ${p.alpha})`;
                ctx.fill();
            });
            requestAnimationFrame(render);
        };
        render();

        // --- GSAP Interactive Mouse-Glow Follow ---
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            gsap.to(glowRef.current, {
                x: clientX - 400, // Centers the 800px glow div
                y: clientY - 400,
                duration: 1.2,
                ease: 'power2.out',
            });
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const features = [
        { title: "Neural Networks", desc: "Deep learning models tailored for complex data processing and pattern recognition." },
        { title: "Predictive Intelligence", desc: "Anticipate user behavior and market shifts before they happen." },
        { title: "Autonomous Agents", desc: "Self-learning chatbots and task-automation systems for 24/7 operations." }
    ];

    // Framer Motion Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
    };

    return (
        <main className="aiMain" ref={containerRef}>
            {/* Background Animations */}
            <canvas ref={bgRef} className="aiCanvas" />
            <div ref={glowRef} className="aiGlow" />
            <div className="bgWatermark">BUZZAP</div>
            
            <motion.div 
                className="aiContainer"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {/* Badge Reveal */}
                <motion.span variants={itemVariants} className="aiBadge">
                    Artificial Intelligence Solutions
                </motion.span>
                
                {/* Title Reveal */}
                <motion.h1 variants={itemVariants} className="aiTitle">
                    Intelligence <span className="textGradient">Defined.</span>
                </motion.h1>
                
                {/* Grid Reveal */}
                <div className="aiGrid">
                    {features.map((f, i) => (
                        <motion.div 
                            key={i} 
                            variants={cardVariants}
                            whileHover={{ 
                                y: -10, 
                                scale: 1.02, 
                                borderColor: "rgba(96, 165, 250, 0.4)",
                                boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.4)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="aiCard"
                        >
                            <div className="cardBorderGlow" />
                            <div className="cardIcon">0{i + 1}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                            <div className="cardArrow">→</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </main>
    );
}