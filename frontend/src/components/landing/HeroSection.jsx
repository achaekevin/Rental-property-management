import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Stack, Chip, useTheme, IconButton } from '@mui/material';
import { ArrowForward as ArrowForwardIcon, Explore as ExploreIcon, VerifiedUserOutlined, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    id: 1,
    category: 'LUXURY HIGH-RISE TOWERS',
    word: 'High-Rise Apartments',
    subtitle: 'High-density commercial & residential towers with floor-to-ceiling glass facades and twilight views.',
    image: '/assets/landing/highrise_luxury_apartments.jpg',
  },
  {
    id: 2,
    category: 'MODULAR TOWNHOUSES',
    word: 'Modular Townhouses',
    subtitle: 'Contemporary multi-level townhouses featuring rich natural timber wood cladding & lush green rooftop gardens.',
    image: '/assets/landing/modular_luxury_townhouses.jpg',
  },
  {
    id: 3,
    category: 'MINIMALIST LUXURY ESTATES',
    word: 'Single-Family Estates',
    subtitle: 'Ultra-modern private rental residences with clean architectural concrete lines & infinity poolside lounges.',
    image: '/assets/landing/luxury_modern_villa.jpg',
  },
];

const HeroSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance full-screen background pictures every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <Box
      id="hero"
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        color: '#ffffff',
        '& .ken-burns': {
          animation: 'kenBurnsZoom 18s ease-in-out infinite alternate',
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' }
        },
        '& .word-anim': {
          animation: 'wordSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        },
        '@keyframes kenBurnsZoom': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '50%': { transform: 'scale(1.06) translate(-10px, -5px)' },
          '100%': { transform: 'scale(1.02) translate(10px, 5px)' },
        },
        '@keyframes wordSlideUp': {
          '0%': { opacity: 0, transform: 'translateY(20px) scale(0.96)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      }}
    >
      {/* FULL SCREEN PHOTOREALISTIC BUILDING BACKGROUND PICTURE SLIDER */}
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <Box
            key={slide.id}
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: isActive ? 'auto' : 'none',
              zIndex: 1,
            }}
          >
            <Box
              className="ken-burns"
              component="img"
              src={slide.image}
              alt={slide.word}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                filter: 'brightness(1.05) contrast(1.05)',
              }}
            />
          </Box>
        );
      })}

      {/* LIGHT VIGNETTE OVERLAY TO KEEP BUILDINGS CRYSTAL CLEAR & HIGHLY VIEWABLE */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: `
            linear-gradient(180deg, rgba(11, 15, 25, 0.55) 0%, rgba(11, 15, 25, 0.2) 45%, rgba(11, 15, 25, 0.65) 100%),
            radial-gradient(ellipse at center, transparent 40%, rgba(11, 15, 25, 0.5) 100%)
          `,
        }}
      />

      {/* HERO CONTENT OVERLAY */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, py: { xs: 12, md: 16 } }}>
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 900,
            mx: 'auto',
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(11, 15, 25, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Animated Category Badge - Pure White */}
          <Chip
            icon={<VerifiedUserOutlined style={{ fontSize: 16, color: '#ffffff' }} />}
            label={slides[activeIndex].category}
            variant="outlined"
            size="medium"
            sx={{
              mb: 3,
              fontWeight: 700,
              letterSpacing: '1.2px',
              px: 1.5,
              py: 0.8,
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(12px)',
              color: '#ffffff',
            }}
          />

          {/* ANIMATED HEADLINE - PURE WHITE TYPOGRAPHY */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.3rem', sm: '3.4rem', md: '4.4rem' },
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              color: '#ffffff',
              mb: 2.5,
              textShadow: '0 4px 18px rgba(0,0,0,0.8)',
            }}
          >
            Everything you need to manage your{' '}
            <Box
              key={activeIndex}
              className="word-anim"
              component="span"
              sx={{
                display: 'inline-block',
                color: '#ffffff',
                borderBottom: '3px solid #ffffff',
                pb: 0.5,
              }}
            >
              {slides[activeIndex].word}
            </Box>{' '}
            and rent in one place.
          </Typography>

          {/* ANIMATED SUBTITLE - PURE WHITE */}
          <Typography
            key={`sub-${activeIndex}`}
            className="word-anim"
            variant="body1"
            sx={{
              fontSize: { xs: '1.05rem', sm: '1.25rem' },
              color: '#ffffff',
              lineHeight: 1.6,
              maxWidth: 760,
              mx: 'auto',
              mb: 4.5,
              textShadow: '0 2px 10px rgba(0,0,0,0.9)',
            }}
          >
            {slides[activeIndex].subtitle}
          </Typography>

          {/* CALL TO ACTIONS */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2.5}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/tenant/register')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                fontWeight: 800,
                fontSize: '1.05rem',
                py: 1.8,
                px: 4.5,
                borderRadius: 3,
                width: { xs: '100%', sm: 'auto' },
                backgroundColor: theme.palette.primary.main,
                boxShadow: `0 8px 25px ${theme.palette.primary.main}60`,
                '&:hover': {
                  backgroundColor: '#1565c0',
                  boxShadow: `0 12px 35px ${theme.palette.primary.main}80`,
                },
              }}
            >
              Sign Up
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                const elem = document.querySelector('#features');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              startIcon={<ExploreIcon />}
              sx={{
                fontWeight: 700,
                fontSize: '1.05rem',
                py: 1.8,
                px: 4.5,
                borderRadius: 3,
                width: { xs: '100%', sm: 'auto' },
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              Explore Features
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* NAVIGATION CHEVRON BUTTONS */}
      <IconButton
        onClick={handlePrev}
        aria-label="Previous property photo"
        sx={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 4,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          color: '#ffffff',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          p: 1.5,
          '&:hover': {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
          },
        }}
      >
        <ChevronLeft fontSize="large" />
      </IconButton>

      <IconButton
        onClick={handleNext}
        aria-label="Next property photo"
        sx={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 4,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          color: '#ffffff',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          p: 1.5,
          '&:hover': {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
          },
        }}
      >
        <ChevronRight fontSize="large" />
      </IconButton>

      {/* BOTTOM SLIDE INDICATORS */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 25,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          px: 2.5,
          py: 1,
          borderRadius: 50,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        {slides.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => setActiveIndex(idx)}
            sx={{
              width: idx === activeIndex ? 32 : 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: idx === activeIndex ? '#ffffff' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#ffffff',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroSection;
