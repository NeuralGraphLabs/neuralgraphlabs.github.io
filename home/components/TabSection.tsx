import React, { useState } from 'react';
import { TabOption } from '../types';
import { TAB_CONTENT } from '../constants';
import { Pill, FadeIn, Card, Button } from './ui/Library';

const TabSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabOption>(TabOption.DOCUMENTATION);

  const content = TAB_CONTENT[activeTab];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
             <h3 className="text-2xl font-light text-gray-900">Explore the Platform</h3>
             <div className="flex flex-wrap gap-2 justify-center">
               {Object.values(TabOption).map((tab) => (
                 <Pill 
                   key={tab}
                   label={tab}
                   isActive={activeTab === tab}
                   onClick={() => setActiveTab(tab)}
                 />
               ))}
             </div>
          </div>
        </FadeIn>

        <div className="relative min-h-[300px]">
          {/* We use key to force re-animation on tab change */}
          <FadeIn key={activeTab} className="w-full">
            <Card className="flex flex-col md:flex-row gap-10 items-center bg-gray-50/50 border-none">
              <div className="flex-1 space-y-6">
                <h4 className="text-3xl font-light text-gray-900">{content.title}</h4>
                <p className="text-gray-500 leading-relaxed text-lg font-light">
                  {content.body}
                </p>
                <Button variant="ghost" className="pl-0 flex items-center gap-2 group">
                  {content.linkText || "Learn More"}
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Button>
              </div>
              <div className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                 {/* Abstract decorative element representing the section */}
                 <div className={`w-1/2 h-1/2 rounded-lg bg-sunflower-500/20 backdrop-blur-xl absolute top-1/4 left-1/4 animate-pulse`} style={{ animationDuration: '3s' }}></div>
                 <div className="w-2/3 h-2/3 rounded-full border border-gray-300/50 absolute"></div>
              </div>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default TabSection;