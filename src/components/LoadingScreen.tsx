import React from 'react';
import { motion } from 'motion/react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-4 border-violet-500/20 border-t-violet-500 rounded-full"
        />
        
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
        />

        {/* Pulsing Center */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-8 bg-white/10 rounded-full backdrop-blur-sm"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute mt-40 text-zinc-500 font-medium tracking-widest text-xs uppercase"
      >
        Loading Ehtisham
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
