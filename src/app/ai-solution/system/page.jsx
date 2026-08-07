'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserPlus, Sparkles, Database, Cpu, Trophy, ArrowRight } from 'lucide-react';
import './system.css';

gsap.registerPlugin(ScrollTrigger);

export default function System() {
    const pipelineRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        // 1. GSAP Mouse Tracking Aura
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            gsap.to(glowRef.current, {
                x: clientX - 350,
                y: clientY - 350,
                duration: 1,
                ease: 'power2.out',
            });
        };

        // 2. GSAP Automated Pipeline Sequence Loop (Simulating live data flow)
        const cards = gsap.utils.toArray('.sysCard');
        const arrows = gsap.utils.toArray('.sysStepArrow');
        
        let tl = gsap.timeline({ repeat: -1 });
        
        cards.forEach((card, index) => {
            tl.to(card, {
                borderColor: 'rgba(6, 182, 212, 0.5)',
                backgroundColor: 'rgba(6, 182, 212, 0.04)',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.15)',
                duration: 1.2,
                yoyo: true,
                repeat: 1,
                ease: 'power1.inOut'
            }, index * 1.5);
            
            // Pulse the bottom decorative node if it exists
            const node = card.querySelector('.sysCardNode');
            if (node) {
                tl.to(node, {
                    opacity: 1,
                    scaleX: 1,
                    duration: 1.2,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power1.inOut'
                }, index * 1.5);
            }

            if (arrows[index]) {
                tl.to(arrows[index], {
                    color: '#06b6d4',
                    opacity: 1,
                    x: 4,
                    duration: 0.6,
                    yoyo: true,
                    repeat: 1
                }, index * 1.5 + 0.6);
            }
        });

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            tl.kill();
        };
    }, []);

    const pipelineSteps = [
        { step: "STEP 1", title: "Lead Capture", desc: "Multi-channel lead intake", icon: UserPlus },
        { step: "STEP 2", title: "AI Qualification", desc: "Smart scoring & filtering", icon: Sparkles },
        { step: "STEP 3", title: "CRM Update", desc: "Auto-enrich & route", icon: Database },
        { step: "STEP 4", title: "Automation", desc: "Trigger sequences", icon: Cpu },
        { step: "STEP 5", title: "Conversion", desc: "Close & track ROI", icon: Trophy }
    ];

    // Framer Motion entry configurations
    const splitTextVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } }
    };

    return (
        <main className="sysMain">
            {/* Ambient Lighting Layer */}
            <div ref={glowRef} className="sysInteractiveGlow" />
            <div className="sysGridOverlay" />

            <div className="sysContainer">
                {/* Structural Top Flex Header inspired by menu.png */}
                <div className="sysHeader">
                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true }}
                        className="sysTitleSide"
                    >
                        <motion.h2 variants={splitTextVariants} className="sysTitle">
                            AI Systems That <span className="sysGradientText">Never Sleep</span>
                        </motion.h2>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="sysDescSide"
                    >
                        <p>
                            Our intelligent automation pipeline captures leads, qualifies them with AI, updates your CRM, triggers personalized sequences, and tracks every conversion — all automatically.
                        </p>
                    </motion.div>
                </div>

                {/* Pipeline Enclosure Container block */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ type: 'spring', stiffness: 40, damping: 15 }}
                    className="sysPipelineWrapper"
                    ref={pipelineRef}
                >
                    <div className="sysFlexContainer">
                        {pipelineSteps.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <div key={index} className="sysStepItem">
                                    <motion.div 
                                        whileHover={{ y: -5, borderColor: 'rgba(168, 85, 247, 0.4)' }}
                                        className="sysCard"
                                    >
                                        <div className="sysCardInner">
                                            <div className="sysIconBox">
                                                <IconComponent size={18} strokeWidth={2} />
                                            </div>
                                            <div className="sysTextContent">
                                                <span className="sysStepLabel">{item.step}</span>
                                                <h4 className="sysCardTitle">{item.title}</h4>
                                                <p className="sysCardDesc">{item.desc}</p>
                                            </div>
                                        </div>
                                        {/* Bottom active accent line indicator synced with GSAP */}
                                        <div className="sysCardNode" />
                                    </motion.div>

                                    {/* Connecting element indicator wrapper */}
                                    {index < pipelineSteps.length - 1 && (
                                        <div className="sysStepArrow">
                                            <ArrowRight size={16} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}