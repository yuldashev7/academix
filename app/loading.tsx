'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Loading = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-[100px] h-[100px]"
        style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      >
        <img
          src="/imgs/no-bg-logo.png"
          alt="Logo"
          className="w-full h-full object-contain"
        />
      </motion.div>
    </div>
  );
};

export default Loading;
