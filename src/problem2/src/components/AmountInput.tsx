import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const AmountInput: React.FC<AmountInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "0.0", 
  disabled 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string, numbers, and single decimal point
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  return (
    <motion.div
      className="flex-1 relative"
      animate={{
        scale: isFocused ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full bg-transparent border-none outline-none text-white text-lg font-medium placeholder-white/40
          disabled:opacity-50 disabled:cursor-not-allowed text-right
        `}
      />
      
      {/* Animated underline */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400"
        initial={{ width: 0 }}
        animate={{ width: isFocused ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default AmountInput;