'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Maximize2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import './video.css';

export default function VideoDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  return (
    <main className="video-viewport">
      <div className="video-glow-layer"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="video-container"
      >
        <Link href="/demo" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Demo</span>
        </Link>

        <div className="video-wrapper">
          <video
            ref={videoRef}
            className="demo-video"
            poster="/demo-poster.jpg"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src="/services.mp4" type="video/mp4" />
          </video>

          <div className="video-overlay">
            <button className="play-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>

          <button className="fullscreen-btn">
            <Maximize2 size={18} />
          </button>
        </div>

        <div className="video-info">
          <h1>Buzzap AI Demo</h1>
          <p>
            Watch how our intelligent automation pipeline transforms lead generation,
            CRM management, and revenue optimization in real-time.
          </p>
        </div>
      </motion.div>
    </main>
  );
}