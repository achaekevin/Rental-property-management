import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const slides = [
  {
    id: 1,
    title: 'PORTFOLIO 01 • Luxury High-Rise Glass Complex',
    subtitle: 'High-density commercial & residential towers with floor-to-ceiling glass facades',
    image: '/assets/landing/highrise_luxury_apartments.jpg',
  },
  {
    id: 2,
    title: 'PORTFOLIO 02 • Modular Townhouses with Green Roofs',
    subtitle: 'Contemporary multi-level townhouses featuring rich timber wood accents & lush planters',
    image: '/assets/landing/modular_luxury_townhouses.jpg',
  },
  {
    id: 3,
    title: 'PORTFOLIO 03 • Minimalist Luxury Single-Family Estate',
    subtitle: 'Ultra-modern private rental residence with clean concrete lines & infinity pool deck',
    image: '/assets/landing/luxury_modern_villa.jpg',
  },
];

const BuildingScene = () => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance slide every 6 seconds
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
      sx={{
        width: '100%',
        height: { xs: 320, sm: 420, md: 520 },
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        boxShadow: theme.palette.mode === 'dark'
          ? '0 24px 50px -10px rgba(0, 0, 0, 0.85)'
          : '0 24px 50px -10px rgba(15, 23, 42, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backgroundColor: '#0b0f19',
        userSelect: 'none',
        '& .ken-burns': {
          animation: 'kenBurnsZoom 18s ease-in-out infinite alternate',
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' }
        },
        '@keyframes kenBurnsZoom': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '50%': { transform: 'scale(1.08) translate(-10px, -5px)' },
          '100%': { transform: 'scale(1.04) translate(10px, 5px)' },
        }
      }}
    >
      {/* BACKGROUND IMAGE SLIDES WITH KEN BURNS EFFECT & DISSOLVE TRANSITIONS */}
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <Box
            key={slide.id}
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            <Box
              className="ken-burns"
              component="img"
              src={slide.image}
              alt={slide.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
          </Box>
        );
      })}

      {/* CINEMATIC TWILIGHT VIGNETTE & LIGHTING OVERLAYS */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(180deg, rgba(9, 13, 22, 0.5) 0%, rgba(9, 13, 22, 0.15) 40%, rgba(9, 13, 22, 0.75) 100%),
            radial-gradient(ellipse at center, transparent 40%, rgba(9, 13, 22, 0.65) 100%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* TOP LEFT GLASS BADGE */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
          maxWidth: { xs: 'calc(100% - 40px)', sm: '80%' },
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 1.2,
            borderRadius: 3,
            backdropFilter: 'blur(16px)',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#38bdf8',
                boxShadow: '0 0 12px #38bdf8',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: '#38bdf8',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
              }}
            >
              {slides[activeIndex].title}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: { xs: '0.8rem', sm: '0.88rem' },
              fontWeight: 500,
            }}
          >
            {slides[activeIndex].subtitle}
          </Typography>
        </Box>
      </Box>

      {/* NAV CHEVRON BUTTONS */}
      <IconButton
        onClick={handlePrev}
        aria-label="Previous property"
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          color: '#fff',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          '&:hover': {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
          },
        }}
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        onClick={handleNext}
        aria-label="Next property"
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          color: '#fff',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          '&:hover': {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
          },
        }}
      >
        <ChevronRight />
      </IconButton>

      {/* BOTTOM SLIDE INDICATOR DOTS */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          px: 2,
          py: 0.8,
          borderRadius: 50,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {slides.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => setActiveIndex(idx)}
            sx={{
              width: idx === activeIndex ? 28 : 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: idx === activeIndex ? theme.palette.primary.main : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />
        ))}
      </Box>

      {/* CYAN BOTTOM HIGHLIGHT BAR */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, #38bdf8 50%, ${theme.palette.primary.main} 100%)`,
          zIndex: 10,
        }}
      />
    </Box>
  );
};

export default BuildingScene;
