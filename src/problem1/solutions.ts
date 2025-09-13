// Start: 18:40 - 13 Sep
// End: 19:00 - 13 Sep

/**
 * METHOD 1: Using loop with reduce method of javascript
 * - Create an array containing numbers from 1 to n
 * - Use reduce to sum all elements
 * Time Complexity: O(n) - must iterate through n elements
 * Space Complexity: O(n) - creates array with n elements
 */
export const calculateSumWithLoop = function (maxNumber: number): number {
  // Create an array [1, 2, 3, ..., maxNumber]
  const numbersArray = Array.from({ length: maxNumber }, (_, index) => index + 1);
  
  // Sum all numbers in the array using reduce
  const totalSum = numbersArray.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  
  return totalSum;
};

/**
 * METHOD 2: Using recursion
 * - Break the problem into smaller subproblems
 * - sum(n) = n + sum(n-1)
 * Time Complexity: O(n) - function called n times
 * Space Complexity: O(n) - call stack depth of n
 */
export const calculateSumWithRecursion = function (maxNumber: number): number {
  // Base case: when n = 1, return 1
  if (maxNumber === 1) {
    return 1;
  }
  
  // Recursive case: n + sum from 1 to (n-1)
  return maxNumber + calculateSumWithRecursion(maxNumber - 1);
};

/**
 * METHOD 3: Using mathematical formula
 * - Formula: S = n × (n + 1) ÷ 2
 * - This is the arithmetic sequence sum formula
 * Time Complexity: O(1) - only performs simple calculation
 * Space Complexity: O(1) - no additional memory needed
 * ⭐ THIS IS THE MOST OPTIMAL SOLUTION
 */
export const calculateSumWithFormula = function (maxNumber: number): number {
  // Apply formula: n × (n + 1) ÷ 2
  const result = (maxNumber * (maxNumber + 1)) / 2;
  return result;
};

/**
 * Alternative implementations with different approaches
 */

// Method 1 alternative: Using for loop
export const calculateSumWithForLoop = function (maxNumber: number): number {
  let totalSum = 0;
  for (let currentNumber = 1; currentNumber <= maxNumber; currentNumber++) {
    totalSum += currentNumber;
  }
  return totalSum;
};

// Method 1 alternative: Using while loop
export const calculateSumWithWhileLoop = function (maxNumber: number): number {
  let totalSum = 0;
  let currentNumber = 1;
  
  while (currentNumber <= maxNumber) {
    totalSum += currentNumber;
    currentNumber++;
  }
  
  return totalSum;
};