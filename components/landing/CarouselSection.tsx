'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles/carousel.module.css';
import Image from 'next/image';
import { animate, motion, useMotionValue } from 'motion/react';

const items = [
  { index: 0, image: '/new-4.png', alt: 'new-4' },
  { index: 1, image: '/new-3.png', alt: 'new-3' },
  { index: 2, image: '/feedback.png', alt: 'feedback' },
];

const CarouselSection = () => {
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      const targetX = -index * containerWidth;

      animate(x, targetX, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, x]);

  return (
    <section className={styles.cardSection}>
      <div className={styles.contents}>
        <div className={styles.carousel} ref={containerRef}>
          <motion.div className={styles.track} style={{ x }}>
            {items.map((content, i) => (
              <div key={content.image} className={styles.slide}>
                <Image
                  src={content.image}
                  alt={content.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 900px"
                  priority={i === 0}
                />
              </div>
            ))}
          </motion.div>
        </div>
        <button
          onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
        >
          1111111111111111111111111
        </button>
        <button onClick={() => setIndex((i) => Math.max(0, i - 1))}>
          1111111111111111111111111
        </button>
      </div>
    </section>
  );
};

export default CarouselSection;
