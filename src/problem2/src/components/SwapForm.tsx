import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';
import TokenSelect from './TokenSelect';
import AmountInput from './AmountInput';
import SwapButton from './SwapButton';
import type { Token } from '../types';
import useGetTokenData from '../apis/useGetToken';
import useFetch from '../hooks/useFetch';
import { getExchangeRate } from '../utils';
import SuccessModal from './SuccessModal';

const swapVariants = {
  from: {
    initial: { y: 0, scale: 1 },
    swap: { 
      y: 188, 
      scale: [1, 0.95, 0.95, 1],
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  } as Variants,
  to: {
    initial: { y: 0, scale: 1 },
    swap: { 
      y: -188, 
      scale: [1, 0.95, 0.95, 1],
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  } as Variants
};

const SwapForm: React.FC = () => {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const { tokens } = useGetTokenData(setFromToken, setToToken);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const { isLoading, isSuccess, error, setError, setIsLoading, setIsSuccess } = useFetch();
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapKey, setSwapKey] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  

  const calculateToAmount = useCallback(async (amount: string, from: Token | null, to: Token | null) => {
    if (!amount || isNaN(parseFloat(amount))) {
      setToAmount('');
      return;
    }

    const rate = await getExchangeRate(from, to);
    const result = (parseFloat(amount) * rate).toFixed(6);
    setToAmount(result);
  }, []);

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setError('');
    calculateToAmount(value, fromToken, toToken);
  };

  const handleSwapTokens = async () => {
    setIsSwapping(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const tempToken = {
      from: fromToken,
      to: toToken
    };

    const tempAmount = {
      from: fromAmount,
      to: toAmount
    }
    
    
    setTimeout(() => {
      setIsSwapping(false);
      setSwapKey(prev => prev + 1);

      setFromToken(toToken);
      setToToken(tempToken.from);

      setFromAmount(tempAmount.to);
      setToAmount(tempAmount.from);
        }, 500);
  };

  const handleSelectFromToken = (token: Token) => {
    setFromToken(token);
    calculateToAmount(fromAmount, token, toToken)
  }

  const handleSelectToToken = (token: Token) => {
    setToToken(token);
    calculateToAmount(fromAmount, fromToken, token)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsSuccess(true);
    setShowSuccessModal(true);
  };

  const exchangeRate = fromAmount ? (parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6) : '0';

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setFromAmount('');
    setToAmount('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Currency Swap</h1>
          <p className="text-white/70 text-sm">Swap tokens instantly with the best rates</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* From Token Section với Animation */}
          <div
            
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 relative z-20"
          >
            <label className="text-white/70 text-xs font-medium uppercase tracking-wide mb-2 block flex justify-between">
              From
            </label>
              <motion.div
              initial="initial"
              key={`from-${swapKey}`}
              variants={swapVariants.from}
              animate={isSwapping ? "swap" : "initial"}
              className="flex items-center space-x-3 relative"
              >
                <span className='text-[0.7rem] top-[-20px] right-[2px] absolute text-white/70 text-xs font-medium uppercase tracking-wide mb-2'>${fromToken?.price}</span>
<TokenSelect
                tokens={tokens}
                selected={fromToken}
                onSelect={handleSelectFromToken}
                disabled={isLoading}
              />
              <div className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
              <AmountInput
                value={fromAmount}
                onChange={handleFromAmountChange}
                placeholder="0.0"
                disabled={isLoading}
              />
              </div>
              </motion.div>
          </div>

          <motion.div
            className="flex justify-center relative z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: isSwapping ? 180 : 0
            }}
            transition={{ 
              delay: isSwapping ? 0 : 0.4,
              duration: isSwapping ? 0.5 : 0.3,
              ease: "easeInOut"
            }}
          >
            <SwapButton onClick={handleSwapTokens} disabled={isLoading || isSwapping} />
          </motion.div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 relative z-20">
            <label className="text-white/70 text-xs font-medium uppercase tracking-wide mb-2 block">
              To
            </label>
              <motion.div
              key={`to-${swapKey}`}
              variants={swapVariants.to}
              initial="initial"
              animate={isSwapping ? "swap" : "initial"}
              className="flex items-center space-x-3 relative"
              >
                <span className='text-[0.7rem] top-[-20px] right-[2px] absolute text-white/70 text-xs font-medium uppercase tracking-wide mb-2'>${toToken?.price}</span>
<TokenSelect
                tokens={tokens}
                selected={toToken}
                onSelect={handleSelectToToken}
                disabled={isLoading}
              />
              <div className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-white text-lg font-medium text-right">
                  {toAmount || '0.0'}
                </div>
              </div>
              </motion.div> 
          </div>

          <AnimatePresence mode="wait">
            {fromToken && toToken && (
              <motion.div
                key={`${fromToken.symbol}-${toToken.symbol}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-center text-white/70 text-sm"
              >
                1 {fromToken?.symbol} = {exchangeRate} {toToken?.symbol}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-2"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={isLoading || !fromAmount || parseFloat(fromAmount) <= 0 || isSwapping}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle size={20} />
                  <span>Success!</span>
                </motion.div>
              ) : isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-2"
                >
                  <Loader2 size={20} className="animate-spin" />
                  <span>Swapping...</span>
                </motion.div>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  Swap Tokens
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
      </div>
      {fromToken && toToken && <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        fromToken={fromToken}
        toToken={toToken}
        fromAmount={fromAmount}
        toAmount={toAmount}
      />}
    </motion.div>
  );
};

export default SwapForm;