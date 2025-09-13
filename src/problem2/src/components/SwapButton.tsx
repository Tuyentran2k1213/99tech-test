import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';

interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const SwapButton: React.FC<SwapButtonProps> = ({ onClick, disabled }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full border-4 border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      whileHover={{ scale: 1.1, rotate: 180 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          '0 0 20px rgba(139, 92, 246, 0.3)',
          '0 0 30px rgba(139, 92, 246, 0.5)',
          '0 0 20px rgba(139, 92, 246, 0.3)',
        ],
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <ArrowUpDown size={20} className="text-white" />
      
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white/20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
};

export default SwapButton;