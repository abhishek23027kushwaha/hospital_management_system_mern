import React from 'react';
import HeroSection from './HeroSection';
import Certified from './Certified';
import Doctors from './LatestDoctors';
import VoiceOfTrust from './VoiceOfTrust';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 overflow-x-hidden">
      <HeroSection />
      
      <div className="mt-[-64px] relative z-20">
        <Certified />
      </div>
      
      <Doctors />

      <VoiceOfTrust />
    </div>
  );
};

export default Home;
