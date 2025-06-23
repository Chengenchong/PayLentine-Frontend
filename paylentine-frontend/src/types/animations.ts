export interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  debounce?: number;
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
  distance?: number;
}

export interface StaggeredAnimationOptions extends ScrollAnimationOptions {
  itemCount: number;
  staggerDelay?: number;
}

export interface StaggeredAnimationReturn {
  ref: React.RefObject<HTMLElement>;
  visibleItems: boolean[];
}
