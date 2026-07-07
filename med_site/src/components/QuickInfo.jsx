import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Users, HeartHandshake, PhoneCall } from 'lucide-react';

const stats = [
  {
    icon: Award,
    targetNum: 25,
    suffix: '+',
    label: 'Years of Excellence',
  },
  {
    icon: Users,
    targetNum: 40,
    suffix: '+',
    label: 'Specialist Doctors',
  },
  {
    icon: HeartHandshake,
    targetNum: 150,
    suffix: 'k+',
    label: 'Patients Served',
  },
  {
    icon: PhoneCall,
    targetNum: 24,
    suffix: '/7',
    label: 'Emergency Response',
  },
];

function AnimatedNumber({ value, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function QuickInfo() {
  return (
    <section className="bg-brand-700 py-10 text-white relative overflow-hidden mt-12 md:mt-16">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600 rounded-full filter blur-3xl opacity-30 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-600 rounded-full filter blur-3xl opacity-10 -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 p-4 border-r last:border-r-0 border-white/10 last:border-0"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent-500 shrink-0 shadow-inner">
                  <Icon size={24} className="stroke-[2]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-bold tracking-tight font-serif text-white">
                    <AnimatedNumber value={stat.targetNum} />
                    <span className="text-accent-500">{stat.suffix}</span>
                  </span>
                  <span className="text-xs md:text-sm text-brand-100 font-medium tracking-wide uppercase mt-1">
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
