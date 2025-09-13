import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Copy, ExternalLink, Clock, Hash, Zap } from 'lucide-react';
import type { Token } from '../types';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
}) => {
  const transactionHash = '0x' + Math.random().toString(16).substr(2, 40);
  const blockNumber = Math.floor(Math.random() * 1000000) + 18500000;
  const gasUsed = Math.floor(Math.random() * 50000) + 21000;
  const gasFee = (Math.random() * 0.01 + 0.005).toFixed(6);
  const timestamp = new Date().toLocaleString();
  const networkFee = (parseFloat(gasFee) * 2000).toFixed(2);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="p-2 bg-green-500/20 rounded-full"
                >
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white">Swap Successful!</h2>
                  <p className="text-white/70 text-sm">Transaction confirmed</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Transaction Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10"
            >
              <h3 className="text-white font-semibold mb-3">Transaction Summary</h3>
              
              <div className="space-y-3">
                {/* From Token */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src={fromToken.icon} alt={fromToken.name} className="w-6 h-6 rounded-full" />
                    <span className="text-white/70">You paid</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{fromAmount} {fromToken.symbol}</div>
                    <div className="text-white/50 text-xs">${(parseFloat(fromAmount) * fromToken.price).toFixed(2)}</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center"
                  >
                    <Zap className="w-4 h-4 text-white" />
                  </motion.div>
                </div>

                {/* To Token */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src={toToken.icon} alt={toToken.name} className="w-6 h-6 rounded-full" />
                    <span className="text-white/70">You received</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{toAmount} {toToken.symbol}</div>
                    <div className="text-white/50 text-xs">${(parseFloat(toAmount) * toToken.price).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Transaction Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-white font-semibold">Transaction Details</h3>
              
              <div className="space-y-3 text-sm">
                {/* Transaction Hash */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-white/50" />
                    <span className="text-white/70">Transaction Hash</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-mono">{truncateHash(transactionHash)}</span>
                    <button
                      onClick={() => copyToClipboard(transactionHash)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Copy className="w-3 h-3 text-white/50" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <ExternalLink className="w-3 h-3 text-white/50" />
                    </button>
                  </div>
                </div>

                {/* Block Number */}
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Block Number</span>
                  <span className="text-white">{blockNumber.toLocaleString()}</span>
                </div>

                {/* Timestamp */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-white/50" />
                    <span className="text-white/70">Timestamp</span>
                  </div>
                  <span className="text-white">{timestamp}</span>
                </div>

                {/* Gas Used */}
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Gas Used</span>
                  <span className="text-white">{gasUsed.toLocaleString()}</span>
                </div>

                {/* Gas Fee */}
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Gas Fee</span>
                  <div className="text-right">
                    <div className="text-white">{gasFee} ETH</div>
                    <div className="text-white/50 text-xs">${networkFee}</div>
                  </div>
                </div>

                {/* Network */}
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Network</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white">Ethereum Mainnet</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Status</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Confirmed</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex space-x-3 mt-6"
            >
              <button
                onClick={() => copyToClipboard(transactionHash)}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Hash</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>Close</span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;