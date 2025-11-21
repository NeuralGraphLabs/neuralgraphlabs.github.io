import React, { useState } from 'react';
import { TIMELINE_EVENTS } from '../constants';
import { FadeIn } from './ui/Library';
import { TimelineEvent } from '../types';

const Timeline: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="timeline" className="py-32 bg-gray-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="text-center mb-20">
            <h2 className="text-3xl font-light text-gray-900">The Journey</h2>
            <p className="text-gray-500 mt-2 font-light">From a basement script to global infrastructure.</p>
          </div>
        </FadeIn>

        <div className="relative border-l border-gray-200 ml-4 md:ml-0 md:pl-8 space-y-16">
          {TIMELINE_EVENTS.map((event: TimelineEvent, index) => (
            <TimelineItem 
              key={index} 
              event={event} 
              index={index}
              isHovered={hoveredId === index}
              onHover={() => setHoveredId(index)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ event, index, isHovered, onHover, onLeave }) => {
  return (
    <FadeIn delay={index * 100} direction="up">
      <div 
        className="relative pl-8 md:pl-0 group cursor-default"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {/* Dot on the line */}
        <div className={`absolute -left-[5px] md:-left-[5px] top-2 w-3 h-3 rounded-full border-2 transition-all duration-500 z-20 ${
          isHovered ? 'bg-white border-sunflower-500 scale-150' : 'bg-gray-200 border-gray-200'
        }`}></div>

        {/* Content */}
        <div className={`transition-all duration-500 ${isHovered ? 'translate-x-2' : ''}`}>
          <span className={`text-sm font-mono mb-1 block transition-colors duration-300 ${isHovered ? 'text-sunflower-500' : 'text-gray-400'}`}>
            {event.year}
          </span>
          <h3 className="text-xl text-gray-900 font-normal mb-2">{event.title}</h3>
          <p className="text-gray-500 font-light max-w-md leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>
    </FadeIn>
  );
};

export default Timeline;