'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { 
  Megaphone, 
  MessageSquare, 
  Search, 
  UserPlus, 
  Layers, 
  Palette, 
  Video, 
  Bot 
} from 'lucide-react';
import './global.css';

export default function Services() {
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // GSAP Mouse Tracking Fluid Glow Effect
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      gsap.to(glowRef.current, {
        x: clientX - 250,
        y: clientY - 250,
        duration: 0.8,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const services = [
    { title: "PAID ADS", icon: Megaphone, desc: "High-converting, hyper-targeted campaigns across premium digital channels designed to capture attention and scale ROI." },
    { title: "AI CUSTOMER SUPPORT", icon: MessageSquare, desc: "Intelligent, conversational automated engines delivering instant resolution to your clients around the clock." },
    { title: "AI-DRIVEN SEO", icon: Search, desc: "Algorithmic search positioning and predictive keyword intent structures engineered to dominate traffic channels." },
    { title: "AI-LEAD GENERATION", icon: UserPlus, desc: "Autonomous prospect sourcing pipelines that automatically track, qualify, and score high-intent buyers." },
    { title: "CRM & SALES SYSTEM", icon: Layers, desc: "Unified internal business architectures designed to streamline operations, track pipelines, and optimize retention." },
    { title: "BRANDING & VISUAL IDENTITY", icon: Palette, desc: "Premium aesthetic footprints, strategic messaging, and world-class designs that separate market leaders from competition." },
    { title: "AI-UGC", icon: Video, desc: "Algorithmically optimized, authentic user-generated short-form video assets engineered explicitly for viral scale." },
    { title: "AI-CHATBOTS", icon: Bot, desc: "Omnichannel deployment (Website, WhatsApp, Lead Qualification) built to capture and convert incoming demand 24/7." }
  ];

  // Framer Motion Container Stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 60, damping: 14 } 
    }
  };

  return (
    <main className="srvMain" ref={containerRef}>
      {/* Background Layer Grid & Glow */}
      <div className="srvGridOverlay" />
      <div ref={glowRef} className="srvInteractiveGlow" />

      <div className="srvContainer">
        
        {/* Header Section */}
        <motion.div 
          className="srvHeader"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={headerVariants} className="srvBadge">
            WHAT WE EXCEL AT
          </motion.span>
          <motion.h1 variants={headerVariants} className="srvTitle">
            Engineered for <span className="srvGradientText">Growth.</span>
          </motion.h1>
          <motion.p variants={headerVariants} className="srvSubtitle">
            We combine premium branding, intelligent marketing systems, automation, CRM solutions, and data-driven growth strategies to help businesses attract attention, streamline operations, and convert more customers.
          </motion.p>
        </motion.div>

        {/* Services Structural Grid */}
        <motion.div 
          className="srvGrid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((srv, index) => {
            const IconComponent = srv.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  borderColor: "rgba(96, 165, 250, 0.35)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
                }}
                className="srvCard"
              >
                <div className="srvCardBorderGlow" />
                
                <div className="srvIconWrapper">
                  <IconComponent className="srvIcon" strokeWidth={1.5} size={28} />
                </div>
                
                <h3 className="srvCardTitle">{srv.title}</h3>
                <p className="srvCardDesc">{srv.desc}</p>
                
                <div className="srvCardFooter">
                  <span className="srvLearnMore">Explore Capability</span>
                  <span className="srvArrow">↗</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </main>
  );
}