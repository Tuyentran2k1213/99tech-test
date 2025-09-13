import {
    calculateSumWithLoop,
    calculateSumWithRecursion,
    calculateSumWithFormula,
    calculateSumWithForLoop,
    calculateSumWithWhileLoop
  } from './solutions';
  
  /**
   * Test suite for sum calculation functions
   */
  class SumFunctionTester {
    
    /**
     * Test correctness of all functions
     */
    static testCorrectness(): void {
      console.log('=== CORRECTNESS TESTS ===\n');
      
      const testCases = [1, 5, 15, 100];
      
      testCases.forEach(testNumber => {
        console.log(`Testing with n = ${testNumber}:`);
        console.log(`=== Loop + Reduce:    ${calculateSumWithLoop(testNumber)}`);
        console.log(`=== Recursion:        ${calculateSumWithRecursion(testNumber)}`);
        console.log(`=== Formula:          ${calculateSumWithFormula(testNumber)}`);
        console.log(`=== For Loop:         ${calculateSumWithForLoop(testNumber)}`);
        console.log(`=== While Loop:       ${calculateSumWithWhileLoop(testNumber)}`);
        console.log(`=== Expected:         ${(testNumber * (testNumber + 1)) / 2}\n`);
      });
    }
  
    /**
     * Test performance comparison
     */
    static testPerformance(): void {
      console.log('=== PERFORMANCE TESTS ===\n');
      
      const performanceTestNumbers = [1000, 5000, 10000];
      
      performanceTestNumbers.forEach(testNumber => {
        console.log(`Performance test with n = ${testNumber}:`);
        
        // Test Loop + Reduce
        console.time('  Loop + Reduce');
        calculateSumWithLoop(testNumber);
        console.timeEnd('  Loop + Reduce');
        
        // Test For Loop
        console.time('  For Loop');
        calculateSumWithForLoop(testNumber);
        console.timeEnd('  For Loop');
        
        // Test While Loop
        console.time('  While Loop');
        calculateSumWithWhileLoop(testNumber);
        console.timeEnd('  While Loop');
        
        // Test Recursion (be careful with large numbers - stack overflow risk)
        if (testNumber <= 5000) {
          console.time('  Recursion');
          calculateSumWithRecursion(testNumber);
          console.timeEnd('  Recursion');
        } else {
          console.log('  Recursion: Skipped (risk of stack overflow)');
        }
        
        // Test Formula
        console.time('  Formula');
        calculateSumWithFormula(testNumber);
        console.timeEnd('  Formula');
        
        console.log('');
      });
    }
  
    /**
     * Test edge cases
     */
    static testEdgeCases(): void {
      console.log('=== EDGE CASE TESTS ===\n');
      
      // Test with n = 1
      console.log('Testing edge case n = 1:');
      console.log(`  All methods should return: 1`);
      console.log(`  Formula result: ${calculateSumWithFormula(1)}`);
      console.log(`  Loop result: ${calculateSumWithLoop(1)}`);
      console.log(`  Recursion result: ${calculateSumWithRecursion(1)}`);
      console.log('');
      
      // Test with larger numbers
      console.log('Testing with large number n = 1000000:');
      console.log('  Formula (O(1)) - should be instant:');
      console.time('  Formula Large Test');
      const result = calculateSumWithFormula(1000000);
      console.timeEnd('  Formula Large Test');
      console.log(`  Result: ${result}`);
      console.log('');
    }
  
    /**
     * Demonstrate mathematical formula derivation
     */
    static demonstrateFormula(): void {
      console.log('=== FORMULA EXPLANATION ===\n');
      console.log('Sum from 1 to n: 1 + 2 + 3 + ... + n');
      console.log('Mathematical derivation:');
      console.log('  S = 1 + 2 + 3 + ... + n');
      console.log('  S = n + (n-1) + (n-2) + ... + 1  (reverse order)');
      console.log('  2S = (n+1) + (n+1) + (n+1) + ... + (n+1)  (add both)');
      console.log('  2S = n × (n+1)');
      console.log('  S = n × (n+1) ÷ 2');
      console.log('');
      console.log('Example with n = 5:');
      console.log('  S = 5 × (5+1) ÷ 2 = 5 × 6 ÷ 2 = 30 ÷ 2 = 15');
      console.log('  Verification: 1 + 2 + 3 + 4 + 5 = 15 ✓');
      console.log('');
    }
  
    /**
     * Run all tests
     */
    static runAllTests(): void {
      this.demonstrateFormula();
      this.testCorrectness();
      this.testEdgeCases();
      this.testPerformance();
      
    console.log('=== SUMMARY ===');
    console.log('📊 Performance Analysis Complete');
    }
  }
  
  // Run all tests
  SumFunctionTester.runAllTests();