'use client';

import { Box } from '@mui/material';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { SxProps, Theme } from '@mui/material/styles';

interface AnimatedSectionProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  sx?: SxProps<Theme>;
  distance?: number;
}

export default function AnimatedSection({
  children,
  direction = 'up',
  delay = 0,
  duration = 1000,
  threshold = 0.15,
  triggerOnce = true,
  sx = {},
  distance = 50,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce,
    rootMargin: '0px 0px -50px 0px',
  });

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `translate3d(0, ${distance}px, 0)`;
        case 'down':
          return `translate3d(0, -${distance}px, 0)`;
        case 'left':
          return `translate3d(${distance}px, 0, 0)`;
        case 'right':
          return `translate3d(-${distance}px, 0, 0)`;
        default:
          return `translate3d(0, ${distance}px, 0)`;
      }
    }
    return 'translate3d(0, 0, 0)';
  };

  return (
    <Box
      ref={ref}
      sx={{
        willChange: 'transform, opacity',
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        transitionDelay: `${delay}ms`,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
