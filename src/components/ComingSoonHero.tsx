import React, { useEffect, useState, Children } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, CheckCircle2 } from 'lucide-react';
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
// Floating particle component
const FloatingParticle = ({ delay }: {delay: number;}) => {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-gold rounded-full opacity-40"
      initial={{
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 20,
        scale: Math.random() * 0.5 + 0.5
      }}
      animate={{
        y: -20,
        x: Math.random() * window.innerWidth
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

export function ComingSoonHero() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  // Countdown logic
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    const targetTime = targetDate.getTime();
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)
          ),
          minutes: Math.floor(difference % (1000 * 60 * 60) / (1000 * 60)),
          seconds: Math.floor(difference % (1000 * 60) / 1000)
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };
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

        {/* Email Signup with enhanced button */}
        <motion.div variants={itemVariants} className="w-full max-w-full sm:max-w-md mb-5 sm:mb-8 px-2 sm:px-0">
          <p className="font-elegant text-cream/80 mb-3 sm:mb-4 text-sm sm:text-lg italic">
            Be the first to know when we launch
          </p>
          {submitted ?
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            className="bg-white/10 backdrop-blur-sm border border-gold/30 rounded-2xl p-3 sm:p-4 text-cream font-elegant text-sm sm:text-lg flex items-center justify-center gap-3">
            
              <motion.div
              initial={{
                scale: 0
              }}
              animate={{
                scale: 1
              }}
              transition={{
                type: 'spring',
                delay: 0.2
              }}>
              
                <CheckCircle2 className="w-6 h-6 text-gold" />
              </motion.div>
              <span>Thank you. You have been added to our exclusive list.</span>
            </motion.div> :

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 sm:flex-row">
            
              <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 px-4 py-2.5 rounded-2xl focus:outline-none focus:border-gold transition-colors font-elegant text-sm sm:text-lg" />
            
              <motion.button
              type="submit"
              className="relative w-full sm:w-auto bg-plum text-white px-8 py-2.5 rounded-2xl font-serif tracking-widest uppercase text-sm transition-colors duration-300 border border-plum overflow-hidden"
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.98
              }}>
              
                <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }} />
              
                <span className="relative z-10">Notify Me</span>
              </motion.button>
            </form>
          }
        </motion.div>

        {/* Brand tagline above social */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-6 px-2 sm:px-0">
          <p className="font-elegant text-cream/60 italic text-[11px] sm:text-xs md:text-base">
            More Than Events. We Curate Experiences.
          </p>
        </motion.div>

        {/* Social Links */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 sm:gap-8">
          <motion.a
            href="#"
            className="text-white/70 hover:text-gold transition-colors duration-300"
            whileHover={{
              scale: 1.1,
              y: -2
            }}
            whileTap={{
              scale: 0.95
            }}>
            
            <Instagram className="w-6 h-6" strokeWidth={1.5} />
            <span className="sr-only">Instagram</span>
          </motion.a>
          <motion.a
            href="#"
            className="text-white/70 hover:text-gold transition-colors duration-300"
            whileHover={{
              scale: 1.1,
              y: -2
            }}
            whileTap={{
              scale: 0.95
            }}>
            
            <Facebook className="w-6 h-6" strokeWidth={1.5} />
            <span className="sr-only">Facebook</span>
          </motion.a>
          <motion.a
            href="#"
            className="text-white/70 hover:text-gold transition-colors duration-300"
            whileHover={{
              scale: 1.1,
              y: -2
            }}
            whileTap={{
              scale: 0.95
            }}>
            
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true">
              
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.435 2.981 7.435 6.953 0 4.156-2.619 7.505-6.257 7.505-1.222 0-2.371-.635-2.763-1.385l-.752 2.868c-.271 1.043-.999 2.348-1.492 3.143 1.131.349 2.317.535 3.541.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.633 0 12.017 0z" />
            </svg>
            <span className="sr-only">Pinterest</span>
          </motion.a>
        </motion.div>
      </motion.div>
    </div>);

}
