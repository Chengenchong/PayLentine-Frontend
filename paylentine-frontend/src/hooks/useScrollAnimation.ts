'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  debounce?: number;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    debounce = 50,
  } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSetVisible = useCallback(
    (visible: boolean) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsVisible(visible);
        if (visible && triggerOnce) {
          setHasAnimated(true);
        }
      }, debounce);
    },
    [debounce, triggerOnce]
  );

  useEffect(() => {
    // Only run on client side after component has mounted
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          debouncedSetVisible(true);
        } else {
          if (!triggerOnce || !hasAnimated) {
            debouncedSetVisible(false);
          }
        }
      },
      {
        threshold: Array.isArray(threshold) ? threshold : [threshold],
        rootMargin,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasAnimated, debouncedSetVisible]);

  return { ref, isVisible };
};

export const useFadeInOnMount = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

// New hook for staggered animations
export const useStaggeredAnimation = (
  itemCount: number,
  options: UseScrollAnimationOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
  } = options;
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );
  const ref = useRef<HTMLElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Clear any existing timeouts
          timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
          timeoutsRef.current = [];

          // Stagger the animation of items
          for (let i = 0; i < itemCount; i++) {
            const timeout = setTimeout(() => {
              setVisibleItems((prev) => {
                const newState = [...prev];
                newState[i] = true;
                return newState;
              });
            }, i * 100); // 100ms delay between each item

            timeoutsRef.current.push(timeout);
          }
        } else if (!triggerOnce) {
          // Clear timeouts and reset visibility
          timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
          timeoutsRef.current = [];
          setVisibleItems(new Array(itemCount).fill(false));
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      // Clean up all timeouts
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, [threshold, rootMargin, triggerOnce, itemCount]);

  return {
    ref,
    visibleItems,
  };
};
