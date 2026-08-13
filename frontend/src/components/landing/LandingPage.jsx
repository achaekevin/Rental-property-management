import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorks from './HowItWorks';
import CTASection from './CTASection';
import Footer from './Footer';

const LandingPage = () => {
  useEffect(() => {
    // Document Title & SEO meta tag configuration
    document.title = 'Renta Property Management | Manage Properties, Tenants & Rent';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      'Renta is an enterprise property management platform for property managers, landlords, and tenants. Track properties, automate rent invoicing, and manage maintenance seamlessly.';
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#090d16' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <CTASection />
      </Box>
      <Footer />
    </Box>
  );
};

export default LandingPage;
