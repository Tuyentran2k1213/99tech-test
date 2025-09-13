# Problem 1: Three ways to sum to n

Provide 3 unique implementations of the following function in JavaScript.

**Input**: `n` - any integer

_Assuming this input will always produce a result lesser than_ `Number.MAX_SAFE_INTEGER`.

**Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.

## Solutions Overview

### Method 1: Array + Reduce Approach
- **Implementation**: Creates an array and uses JavaScript's reduce method
- **Time Complexity**: O(n) - iterates through n elements
- **Space Complexity**: O(n) - stores array of n elements
- **Use Case**: Functional programming style, good for readability

### Method 2: Recursive Approach
- **Implementation**: Breaks problem into smaller subproblems using recursion
- **Time Complexity**: O(n) - function called n times
- **Space Complexity**: O(n) - call stack depth of n
- **Use Case**: Educational purposes, demonstrates divide-and-conquer thinking
- **Limitation**: Risk of stack overflow for large inputs

### Method 3: Mathematical Formula (Optimal)
- **Implementation**: Uses arithmetic sequence formula: `S = n × (n + 1) ÷ 2`
- **Time Complexity**: O(1) - constant time calculation
- **Space Complexity**: O(1) - no additional memory required
- **Use Case**: Production code, highest performance

### Additional Methods
- **For Loop**: Traditional iterative approach
- **While Loop**: Alternative iterative implementation

## How to Run

### Quick Start
```bash
# Install tsx globally
npm install -g tsx

# Run the test suite
tsx test.ts
```

## Test Features

The test suite includes:
- **Correctness Testing**: Verifies all methods produce identical results
- **Performance Benchmarking**: Measures execution time
- **Edge Case Validation**: Tests boundary conditions
- **Mathematical Proof**: Demonstrates formula derivation

## Mathematical Formula

The arithmetic sequence sum formula:
- Write sum forwards: S = 1 + 2 + 3 + ... + n
- Write sum backwards: S = n + (n-1) + (n-2) + ... + 1  
- Add both: 2S = n(n+1)
- Therefore: S = n(n+1)/2

This is the most efficient approach with O(1) time complexity.