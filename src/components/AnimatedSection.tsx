'use client';

import { Box, Fade, Slide } from '@mui/material';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  sx?: any;
}


export default function AnimatedSection({
  children,
  direction = 'up',
  delay = 0,
  duration = 800,
  threshold = 0.1,
  triggerOnce = false,
  sx = {},
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce });

  const slideDirection = {
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right',
  }[direction];

  return (
    <Box ref={ref} sx={sx}>
      <Slide
        direction={slideDirection as any}
        in={isVisible}
        timeout={{
          enter: duration,
          exit: duration / 2,
        }}
        style={{
          transitionDelay: isVisible ? `${delay}ms` : '0ms',
        }}
      >
        <Fade
          in={isVisible}
          timeout={{
            enter: duration,
            exit: duration / 2,
          }}
          style={{
            transitionDelay: isVisible ? `${delay}ms` : '0ms',
          }}
        >
          <Box>{children}</Box>
        </Fade>
      </Slide>
    </Box>
  );
}
