'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
interface CountdownState {
  launchAt: number;
  serverNow: number;
}
interface CountdownSnapshot extends CountdownState {
  syncedAt: number;
}
interface ComingSoonHeroProps {
  initialCountdownState: CountdownState;
}
const calculateTimeLeft = ({ launchAt, serverNow }: CountdownState) => {
  const remaining = Math.max(launchAt - serverNow, 0);

  return {
    days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
    hours: Math.floor(remaining % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
    minutes: Math.floor(remaining % (1000 * 60 * 60) / (1000 * 60)),
    seconds: Math.floor(remaining % (1000 * 60) / 1000)
  };
};
// Floating particle component
const FloatingParticle = ({ delay }: {delay: number;}) => {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  return (
    <motion.div
      className="absolute w-1 h-1 bg-gold rounded-full opacity-40"
      initial={{
        x: Math.random() * viewport.width,
        y: viewport.height + 20,
        scale: Math.random() * 0.5 + 0.5
      }}
      animate={{
        y: -20,
        x: Math.random() * viewport.width
      }}
      transition={{
        duration: Math.random() * 10 + 15,
        repeat: Infinity,
        delay: delay,
        ease: 'linear'
      }} />);


};
// Ornamental flourish SVG
const OrnamentalFlourish = () =>
<svg
  width="80"
  height="40"
  viewBox="0 0 80 40"
  fill="none"
  className="mx-auto mb-6">
  
    <path
    d="M40 20C35 15 25 10 15 12C10 13 8 16 10 20C12 24 18 25 25 23C30 21.5 35 18 40 20C45 22 50 25 55 23C62 21 68 20 70 20C72 20 75 23 70 28C65 33 55 35 45 32"
    stroke="#C9A96E"
    strokeWidth="0.5"
    fill="none"
    opacity="0.6" />
  
    <circle cx="15" cy="12" r="1" fill="#C9A96E" opacity="0.4" />
    <circle cx="65" cy="28" r="1" fill="#C9A96E" opacity="0.4" />
    <circle cx="40" cy="20" r="1.5" fill="#C9A96E" opacity="0.6" />
  </svg>;

export function ComingSoonHero({ initialCountdownState }: ComingSoonHeroProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(initialCountdownState)
  );
  const [countdownState, setCountdownState] = useState<CountdownSnapshot | null>(
    null
  );

  useEffect(() => {
    setCountdownState({
      ...initialCountdownState,
      syncedAt: Date.now()
    });
  }, [initialCountdownState]);

  useEffect(() => {
    let cancelled = false;

    const syncCountdownState = async () => {
      try {
        const response = await fetch('/api/countdown', {
          method: 'GET',
          cache: 'no-store'
        });
        const data = await response.json() as {
          launchAt: number;
          serverNow: number;
        };

        if (!cancelled) {
          setCountdownState({
            launchAt: data.launchAt,
            serverNow: data.serverNow,
            syncedAt: Date.now()
          });
        }
      } catch {
        if (!cancelled) {
          setCountdownState({
            ...initialCountdownState,
            syncedAt: Date.now()
          });
        }
      }
    };

    syncCountdownState();

    return () => {
      cancelled = true;
    };
  }, [initialCountdownState]);

  useEffect(() => {
    if (countdownState === null) {
      return;
    }

    const updateTimeLeft = () => {
      const elapsedSinceSync = Date.now() - countdownState.syncedAt;
      const estimatedServerNow = countdownState.serverNow + elapsedSinceSync;
      setTimeLeft(calculateTimeLeft({
        launchAt: countdownState.launchAt,
        serverNow: estimatedServerNow
      }));
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [countdownState]);
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  return (
    <div className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Floating Particles */}
      {[...Array(12)].map((_, i) =>
      <FloatingParticle key={i} delay={i * 2} />
      )}

      {/* Background Image with Overlay and Zoom Animation */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{
          scale: 1
        }}
        animate={{
          scale: 1.05
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear'
        }}
        style={{
          backgroundImage:
          'url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80")',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}>
        
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      {/* Content with gradient border frame */}
      <motion.div
        className="relative z-10 flex max-h-[100svh] w-full max-w-4xl scale-[0.9] flex-col items-center overflow-hidden px-4 py-4 text-center sm:scale-100 sm:px-6 sm:py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        
        {/* Subtle gradient border frame */}
        <div
          className="absolute inset-0 rounded-xl opacity-30 pointer-events-none"
          style={{
            background:
            'linear-gradient(135deg, rgba(201,169,110,0.3) 0%, rgba(91,34,69,0.3) 50%, rgba(201,169,110,0.3) 100%)',
            padding: '1px',
            WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }} />
        

        {/* Brand */}
        <motion.div variants={itemVariants} className="mb-5 sm:mb-8">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-wide mb-1 sm:mb-2">
            Dreamscape
          </h1>
          <p className="font-elegant text-lg sm:text-2xl md:text-3xl text-gold italic tracking-wider">
            Curated Events
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="w-20 sm:w-24 h-[1px] bg-gold/50 mb-5 sm:mb-8" />
        

        {/* Ornamental Flourish */}
        <motion.div variants={itemVariants}>
          <OrnamentalFlourish />
        </motion.div>

        {/* Main Copy with shimmer effect */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-6 max-w-2xl">
          <motion.h2
            className="font-serif text-2xl sm:text-3xl md:text-5xl text-white mb-6 uppercase tracking-[0.16em] sm:tracking-[0.2em]"
            animate={{
              textShadow: [
              '0 0 10px rgba(201,169,110,0.3)',
              '0 0 20px rgba(201,169,110,0.6)',
              '0 0 10px rgba(201,169,110,0.3)']

            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}>
            
            Coming Soon
          </motion.h2>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          variants={itemVariants}
          className="mb-4 sm:mb-6 flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6">
          
          {[
          {
            label: 'Days',
            value: timeLeft.days
          },
          {
            label: 'Hours',
            value: timeLeft.hours
          },
          {
            label: 'Minutes',
            value: timeLeft.minutes
          },
          {
            label: 'Seconds',
            value: timeLeft.seconds
          }].
          map((unit) =>
          <div key={unit.label} className="flex w-14 flex-col items-center sm:w-20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-gold/40 bg-black/30 backdrop-blur-sm flex items-center justify-center mb-1.5 sm:mb-2">
                <span className="font-serif text-lg sm:text-2xl md:text-3xl text-gold">
                  {unit.value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="font-elegant text-[10px] sm:text-xs md:text-sm text-cream/70 uppercase tracking-wider text-center">
                {unit.label}
              </span>
            </div>
          )}
        </motion.div>

        {/* Tagline */}
        <motion.div variants={itemVariants} className="mb-5 sm:mb-8 max-w-2xl px-2 sm:px-0">
          <p className="font-elegant text-sm sm:text-base md:text-xl text-cream/90 leading-snug sm:leading-relaxed font-light">
            Luxury weddings, private celebrations, and elevated brand
            experiences — thoughtfully designed, seamlessly coordinated, and
            beautifully executed.
          </p>
          <p className="font-elegant text-[11px] sm:text-xs md:text-base text-gold mt-3 sm:mt-4 uppercase tracking-widest">
            Now booking 2026 & 2027 events
          </p>
        </motion.div>

        {/* Brand tagline above social */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-6 px-2 sm:px-0">
          <p className="font-elegant text-cream/60 italic text-[11px] sm:text-xs md:text-base">
            More Than Events. We Curate Experiences.
          </p>
        </motion.div>
      </motion.div>
    </div>);

}
