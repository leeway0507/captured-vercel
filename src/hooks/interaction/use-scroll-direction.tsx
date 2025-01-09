import { useState, useEffect } from 'react';

export type ScrollDirectionProps = "up" | "down" | undefined


const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirectionProps>();

  useEffect(() => {
    let lastScrollY = window.scrollY


    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;
      const direction = lastScrollY > currentScrollY ? 'up' : 'down'
      setScrollDirection(direction)
      lastScrollY = currentScrollY;
    };


    const onScroll = () => {
      window.requestAnimationFrame(updateScrollDir);
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [scrollDirection]);

  return scrollDirection;
};

export default useScrollDirection;

// https://stackoverflow.com/questions/62497110/detect-scroll-direction-in-react-js
