import React from 'react';
import { FadeIn, Button } from './ui/Library';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto text-center min-h-[60vh] flex flex-col justify-center items-center z-10">
      <FadeIn>
        <div className="mb-6 inline-block">
          <span className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-500 tracking-wider uppercase">
            v1.4 Stable Release
          </span>
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <h1 className="text-5xl md:text-7xl font-light text-gray-900 tracking-tight mb-8 leading-tight">
          Deep learning, <br />
          <span className="text-gray-400">distilled to perfection.</span>
        </h1>
      </FadeIn>

      <FadeIn delay={400}>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-light mb-10 leading-relaxed">
          A lightweight, purely functional framework designed for researchers who demand clarity and speed. No bloat, just gradients.
        </p>
      </FadeIn>

      <FadeIn delay={600}>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button variant="primary" className="h-12 px-8 text-base">Get Started</Button>
          <Button variant="outline" className="h-12 px-8 text-base">Read the Manifest</Button>
        </div>
      </FadeIn>
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-gray-50 to-white rounded-full blur-3xl -z-10 opacity-80 pointer-events-none"></div>
    </section>
  );
};

export default Hero;