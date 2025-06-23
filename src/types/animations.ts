export interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export interface AnimationState {
  isVisible: boolean;
  hasAnimated: boolean;
}

export type AnimationDirection = 'up' | 'down' | 'left' | 'right';

export interface AnimatedSectionProps {
  children: React.ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  sx?: any;
}
