'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  name: string;
  location: string;
  flag: string;
  rank: string;
  text: string;
  accentColor: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Ahmed Al-Rashid',
    location: 'Dubai, UAE',
    flag: '🇦🇪',
    rank: 'Champion',
    text: 'Before the Empire, I had the words but not the courage. This community taught me that English is not just a language — it is a weapon. The discipline here transformed my confidence. I walk into boardrooms now and I command the room. That is the Empire difference.',
    accentColor: '#c9a84c',
  },
  {
    name: 'Nour El-Din',
    location: 'Cairo, Egypt',
    flag: '🇪🇬',
    rank: 'Warrior',
    text: 'I tried every app, every course, every YouTube channel. Nothing stuck. But the Empire atmosphere is different — it makes you feel like quitting is not an option. Six months in, my IELTS score jumped from 5.5 to 7.5. This is not a course. It is a transformation.',
    accentColor: '#cd7f32',
  },
  {
    name: 'Lena Müller',
    location: 'Berlin, Germany',
    flag: '🇩🇪',
    text: 'Ich war immer unsicher mit meinem Englisch — sorry, I was always insecure about my English. The Empire gave me structure, accountability, and a community that actually pushes you forward. Now I lead meetings in English without hesitation. The warrior mentality is real.',
    rank: 'Warrior',
    accentColor: '#ff6b35',
  },
  {
    name: 'Rafael Santos',
    location: 'São Paulo, Brazil',
    flag: '🇧🇷',
    rank: 'Initiate',
    text: 'I joined thinking it was just another English platform. I was wrong. The Empire makes you feel part of something bigger. The daily discipline, the rankings, the atmosphere — it feeds your hunger to improve. My vocabulary has doubled, and my pronunciation is finally something I am proud of.',
    accentColor: '#c9a84c',
  },
  {
    name: 'James Whitfield',
    location: 'London, UK',
    flag: '🇬🇧',
    rank: 'Champion',
    text: 'As a native speaker, I thought I had nothing to gain. But the Empire taught me the art of communication — persuasion, precision, and power in language. The grammar trials alone sharpened my writing beyond what any university course achieved. Elite is not a word, it is a standard.',
    accentColor: '#cd7f32',
  },
  {
    name: 'Sarah Mitchell',
    location: 'New York, USA',
    flag: '🇺🇸',
    rank: 'Warrior',
    text: 'The Empire does not teach you English. It forges you into someone who commands English. The speaking trials pushed me out of every comfort zone I had. I went from mumbling presentations to delivering keynotes. This community is a forge, and you come out stronger.',
    accentColor: '#ff6b35',
  },
  {
    name: 'Omar Al-Faisal',
    location: 'Riyadh, Saudi Arabia',
    flag: '🇸🇦',
    rank: 'Champion',
    text: 'In my culture, discipline is everything. The Empire matched that value perfectly. Every trial, every session, every ranking felt purposeful. My English went from functional to fluent, and the confidence it gave me in my career has been invaluable. The Empire respects those who commit.',
    accentColor: '#c9a84c',
  },
  {
    name: 'Elif Yılmaz',
    location: 'Istanbul, Turkey',
    flag: '🇹🇷',
    rank: 'Initiate',
    text: 'I was terrified of speaking English. The Empire did not just teach me words — it gave me a reason to speak. The community made me feel like my voice matters. Three months ago I could not order coffee abroad. Now I debate, I present, I lead. The transformation is emotional, not just academic.',
    accentColor: '#cd7f32',
  },
  {
    name: 'Camille Dubois',
    location: 'Paris, France',
    flag: '🇫🇷',
    rank: 'Warrior',
    text: 'We French are proud of our language, but the world speaks English. The Empire helped me bridge that gap without losing my identity. The cinematic approach, the rankings, the discipline — it made learning feel like an adventure, not a chore. I have never been more consistent with anything in my life.',
    accentColor: '#ff6b35',
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(1);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  const currentTestimonial = testimonials[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.96,
    }),
  };

  return (
    <section className="relative z-10 px-4 py-20 overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.04)_0%,transparent_60%)]" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-[family-name:var(--font-heading)] text-xs sm:text-sm tracking-[0.35em] uppercase text-[#8b7355] mb-3"
          >
            Voices of the Empire
          </motion.p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold text-[#c9a84c] text-glow mb-4">
            A GLOBAL MOVEMENT
          </h2>
          <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-base sm:text-lg italic max-w-xl mx-auto">
            From every corner of the world, warriors share their transformation. These are not reviews — they are battle stories.
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="relative overflow-hidden rounded-xl border border-[rgba(201,168,76,0.2)] bg-gradient-to-br from-[#111118] to-[#1a1a2e] min-h-[340px] sm:min-h-[300px]">
            {/* Top gold shimmer line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.4)] to-transparent" />

            {/* Ambient glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none transition-opacity duration-700"
              style={{
                background: `radial-gradient(circle, ${currentTestimonial.accentColor}20 0%, transparent 70%)`,
              }}
            />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="p-8 sm:p-12"
              >
                {/* Quote mark */}
                <div className="mb-6">
                  <span className="text-5xl sm:text-6xl font-serif leading-none" style={{ color: `${currentTestimonial.accentColor}40` }}>
                    &ldquo;
                  </span>
                </div>

                {/* Testimonial text */}
                <p className="font-[family-name:var(--font-sans)] text-[#e8e0d0] text-base sm:text-lg md:text-xl leading-relaxed mb-8 italic">
                  {currentTestimonial.text}
                </p>

                {/* Author info */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar circle */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl border-2"
                      style={{
                        borderColor: `${currentTestimonial.accentColor}50`,
                        boxShadow: `0 0 15px ${currentTestimonial.accentColor}20`,
                      }}
                    >
                      {currentTestimonial.flag}
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-heading)] text-[#e8e0d0] text-base sm:text-lg font-semibold">
                        {currentTestimonial.name}
                      </p>
                      <p className="font-[family-name:var(--font-sans)] text-[#8b7355] text-sm">
                        {currentTestimonial.location}
                      </p>
                    </div>
                  </div>
                  {/* Rank badge */}
                  <div
                    className="px-4 py-1.5 rounded-full border font-[family-name:var(--font-heading)] text-xs tracking-[0.2em] uppercase"
                    style={{
                      borderColor: `${currentTestimonial.accentColor}40`,
                      color: currentTestimonial.accentColor,
                      boxShadow: `0 0 10px ${currentTestimonial.accentColor}15`,
                    }}
                  >
                    {currentTestimonial.rank}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom gold shimmer line */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.2)] to-transparent" />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center text-[#c9a84c] hover:bg-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.5)] transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className="transition-all duration-300"
                  aria-label={`Go to testimonial ${idx + 1}`}
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-8 h-2 bg-[#c9a84c] shadow-[0_0_8px_rgba(201,168,76,0.4)]'
                        : 'w-2 h-2 bg-[rgba(201,168,76,0.3)] hover:bg-[rgba(201,168,76,0.5)]'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center text-[#c9a84c] hover:bg-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.5)] transition-all duration-300"
              aria-label="Next testimonial"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Country flags row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3 mt-10 flex-wrap"
        >
          {testimonials.map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`text-2xl transition-all duration-300 hover:scale-125 ${
                idx === currentIndex ? 'scale-125 drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]' : 'opacity-40 hover:opacity-70'
              }`}
              aria-label={`View testimonial from ${t.location}`}
            >
              {t.flag}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
