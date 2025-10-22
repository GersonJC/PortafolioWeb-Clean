'use client';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ZoomableImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function ZoomableImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
}: ZoomableImageProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Zoom>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover cursor-zoom-in"
          priority={priority}
        />
      </Zoom>
    </motion.div>
  );
}