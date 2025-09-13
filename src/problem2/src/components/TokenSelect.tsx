import React, { useState, useMemo } from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Token } from '../types';

interface TokenSelectProps {
  tokens: Token[];
  selected: Token | null;
  onSelect: (token: Token) => void;
  disabled?: boolean;
}

const TokenSelect: React.FC<TokenSelectProps> = ({ tokens, selected, onSelect, disabled }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) return tokens;
    
    const query = searchQuery.toLowerCase();
    return tokens.filter(token => 
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query)
    );
  }, [tokens, searchQuery]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchQuery('');
    }
  };

  const handleSelect = (value: string) => {
    const token = tokens.find(t => t.symbol === value);
    if (token) {
      onSelect(token);
      setSearchQuery(''); // Reset search after selection
    }
  };
  
  return (
    <Select.Root
      value={selected?.symbol}
      onValueChange={handleSelect}
      disabled={disabled}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <Select.Trigger
        className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg px-3 py-2 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
        aria-label="Select token"
      >
        <img
          src={selected?.icon}
          alt={selected?.name}
          className="w-6 h-6 rounded-full"
        />
        <span className="font-medium">{selected?.symbol}</span>
        <Select.Icon className="ml-auto">
          <ChevronDown size={16} className="text-white/70" />
        </Select.Icon>
      </Select.Trigger>

      <AnimatePresence>
        <Select.Portal>
          <Select.Content
            className="bg-gray-900/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl z-50 max-h-[360px] overflow-hidden"
            position="popper"
            sideOffset={8}
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              {/* Search Input */}
              <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-lg border-b border-white/10 p-3">
                <div className="relative">
                  <Search 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search token..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all duration-200"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        if (searchQuery) {
                          e.stopPropagation();
                          setSearchQuery('');
                        }
                      }
                    }}
                  />
                  {/* Clear button */}
                  {searchQuery && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery('');
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <Select.Viewport className="p-2 max-h-[280px]">
                {filteredTokens.length > 0 ? (
                  filteredTokens.map((token) => (
                    <Select.Item
                      key={token.id}
                      value={token.symbol}
                      className="flex items-center space-x-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors duration-150 outline-none data-[highlighted]:bg-white/10 data-[state=checked]:bg-white/5"
                    >
                      <img
                        src={token.icon}
                        alt={token.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {/* Highlight matching text */}
                          {searchQuery ? (
                            <HighlightText text={token.symbol} query={searchQuery} />
                          ) : (
                            token.symbol
                          )}
                        </div>
                        <div className="text-xs text-white/70">
                          {searchQuery ? (
                            <HighlightText text={token.name} query={searchQuery} />
                          ) : (
                            token.name
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-white/50">
                        ${token.price}
                      </div>
                      <Select.ItemIndicator>
                        <Check size={16} className="text-green-400" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/50">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Search size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tokens found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </motion.div>
                  </div>
                )}
              </Select.Viewport>

              {/* Optional: Show count */}
              {searchQuery && filteredTokens.length > 0 && (
                <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-lg border-t border-white/10 px-3 py-2">
                  <p className="text-xs text-white/50">
                    Showing {filteredTokens.length} of {tokens.length} tokens
                  </p>
                </div>
              )}
            </motion.div>
          </Select.Content>
        </Select.Portal>
      </AnimatePresence>
    </Select.Root>
  );
};

// Component to highlight matching text
const HighlightText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <span key={index} className="text-purple-400 font-semibold">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export default TokenSelect;