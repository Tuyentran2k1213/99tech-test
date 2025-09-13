import React, { useMemo } from 'react';

// ISSUE 1:
// BEFORE: getPriority = (blockchain: any): number => {...}
// PROBLEM: shouldn't using 'any' type, because it might loses all type safety, allows invalid values 
// SOLUTION: should define strict union type for all valid blockchain values
// ===========================================================================
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

// ISSUE 2:
// BEFORE: interface WalletBalance {
//   currency: string;
//   amount: number;
//   // Missing blockchain property!
// }
// PROBLEM: code accesses balance.blockchain but property doesn't exist in interface this make typeScript compilation errors and runtime failures can make crash the app and shouldn't using interface can replace by type
// SOLUTION: add blockchain property with proper type
// ===========================================================================
type WalletBalance = {
  currency: string;
  amount: number;
  blockchain: Blockchain; // FIXED: Added missing property with strict type
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {
  children?: React.ReactNode;
}

// ISSUE 3:
// BEFORE: this function was defined inside component:
// const WalletPage = () => {
//   const getPriority = (blockchain: any): number => {
//     switch (blockchain) { ... }
//   }
// }
// PROBLEM: function recreated every render, breaks referential equality so we should mocve the function outside
// SOLUTION: move outside component + use constant mapping
// ===========================================================================
const BLOCKCHAIN_PRIORITIES: Record<Blockchain, number> = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20,
} as const;

// function now stable across renders + type-safe parameter
const getPriority = (blockchain: Blockchain): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
};

const WalletPage: React.FC<Props> = (props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedAndFormattedBalances = useMemo<FormattedWalletBalance[]>(() => {
        // ISSUE 4 + 5:
    // BEFORE:
    // return balances.filter((balance: WalletBalance) => {
    //   const balancePriority = getPriority(balance.blockchain);
    //   if (lhsPriority > -99) {  // <- ISSUE #1: lhsPriority is undefined!
    //     if (balance.amount <= 0) {
    //       return true;  // <- ISSUE #2: INVERTED - keeps zero/negative!
    //     }
    //   }
    //   return false
    // })
    // 
    // PROBLEMS:
    // 4. lhsPriority doesn't exist - should be balancePriority can make app crash
    // 5. logic inverted: returns true for invalid amounts <= 0
    // 
    // CORRECT LOGIC: keep balances where:
    // - Priority > -99 (valid blockchain) AND
    // - Amount > 0 (has positive value)
    // =========================================================================
    const validBalances = balances.filter((balance: WalletBalance) => {
      const priority = getPriority(balance.blockchain); // FIXED: Correct variable name
      return priority > -99 && balance.amount > 0; // FIXED: Correct filter logic
    });

    // ISSUE 6:
    // BEFORE: getPriority was called multiple times per item during sort:
    // .sort((lhs, rhs) => {
    //   const leftPriority = getPriority(lhs.blockchain);  // Called for every comparison
    //   const rightPriority = getPriority(rhs.blockchain); // Called for every comparison
    //   ...
    // })
    // 
    // PROBLEM: for n items, sort makes O(n log n) comparisons
    // Each comparison calls getPriority twice = O(2n log n) calls total
    // 
    // SOLUTION: pre-calculate priorities once = O(n) calls only
    // =========================================================================
    const balancesWithPriority = validBalances.map(balance => ({
      balance,
      priority: getPriority(balance.blockchain), // Cache priority - calculated once per item
    }));

    // ISSUE 7:
    // BEFORE:
    // .sort((lhs, rhs) => {
    //   const leftPriority = getPriority(lhs.blockchain);
    //   const rightPriority = getPriority(rhs.blockchain);
    //   if (leftPriority > rightPriority) {
    //     return -1;
    //   } else if (rightPriority > leftPriority) {
    //     return 1;
    //   }
    //   // ERROR: missing return for equal case!
    // })
    // 
    // PROBLEM: undefined behavior when priorities equal (no return = undefined)
    // SOLUTION: return a value (0 for equal)
    // =========================================================================
    balancesWithPriority.sort((lhs, rhs) => {
      if (lhs.priority > rhs.priority) return -1;
      if (lhs.priority < rhs.priority) return 1;
      return 0; // FIXED: Explicit return for equal priorities
    });

    // ISSUE 8:
    // BEFORE:
    // const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    //   return {
    //     ...balance,
    //     formatted: balance.amount.toFixed()  // Also missing decimal places!
    //   }
    // })
    // 
    // PROBLEM: recalculated on every render even when data unchanged
    // SOLUTION: include in useMemo + fix toFixed() to specify decimals
    // =========================================================================
    return balancesWithPriority.map(({ balance }): FormattedWalletBalance => ({
      ...balance,
      formatted: balance.amount.toFixed(2), // FIXED: Specify 2 decimal places
    }));
    
  // ISSUE 9:
  // BEFORE: }, [balances, prices]);
  // PROBLEM: prices included in dependencies array but it not used in this useMemo computation can make unnecessary recalculation when prices change
  // SOLUTION: Only include actual dependencies
  // =========================================================================
  }, [balances]); // FIXED: Removed 'prices' - not used in this computation

  // ISSUE 10:
  // BEFORE:
  // const rows = sortedBalances.map((balance: FormattedWalletBalance, index) => {
  //   ...
  // })
  // PROBLEM: sortedBalances is WalletBalance[] but parameter typed as FormattedWalletBalance
  // balance.formatted would be undefined!
  // SOLUTION: use sortedAndFormattedBalances which has correct type
  // =========================================================================
  const rows = useMemo(() => {
    // now using sortedAndFormattedBalances (correct type with formatted property)
    return sortedAndFormattedBalances.map((balance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      
      return (
        <WalletRow
          // ISSUE 11:
          // BEFORE: className={classes.row}
          // PROBLEM: 'classes' object not defined this can causes runtime error
          // SOLUTION: use string literal or proper CSS module import
          // =================================================================
          className="wallet-row" // FIXED: Direct string instead of undefined variable
          
          // =================================================================
          // ISSUE 12:
          // BEFORE: key={index}
          // PROBLEM: using index causes React to incorrectly associate component instances and state after reordering
          // ex: If item at index 0 is deleted, item previously at index 1
          //          moves to index 0 but keeps the state of old index 0
          // SOLUTION: use stable, unique identifier combining like blockchain+currency
          // =================================================================
          key={`${balance.blockchain}-${balance.currency}`} // FIXED: Stable unique key
          
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted} // Now properly exists due to fix ISSUE 10
        />
      );
    });
  }, [sortedAndFormattedBalances, prices]); // correct dependencies - prices used here

  return (
    <div {...rest}>
      {rows}
      {children}
    </div>
  );
};

export default WalletPage;


  // PERFORMANCE IMPROVEMENTS SUMMARY:
  // =================================
  // BEFORE: 
  // - Filter: O(n) with undefined variable crash
  // - Sort: O(n log n) with 2n log n getPriority calls  
  // - Format: O(n) on every render
  // - Rows: O(n) on every render
  // - Total: Crash or ~O(n log n) operations per render
  
  // AFTER:
  // - Combined operations in single pass: O(n)
  // - Priority calculations reduced from O(n log n) to O(n)
  // - Proper memoization prevents recalculation
  // - Total: O(n log n) only when balances change, O(n) when only prices change
  
  // RESULT: improvement performance + no runtime errors
