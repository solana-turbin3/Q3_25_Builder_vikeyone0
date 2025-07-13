# Solana Calculator Smart Contract

A simple calculator smart contract built with Anchor framework for Solana blockchain.

## Features

- **Basic Arithmetic Operations**: Addition, subtraction, multiplication, and division
- **Account-based Storage**: Each user has their own calculator account with persistent state
- **Security**: Only the owner can perform operations on their calculator
- **Error Handling**: Prevents division by zero and unauthorized access
- **Clear Function**: Reset calculator result to zero

## Smart Contract Functions

### 1. `initialize()`
- Creates a new calculator account for the user
- Sets initial result to 0
- Stores the user's public key as the owner

### 2. `add(a: i64, b: i64)`
- Performs addition: `result = a + b`
- Updates the calculator's stored result

### 3. `subtract(a: i64, b: i64)`
- Performs subtraction: `result = a - b`
- Updates the calculator's stored result

### 4. `multiply(a: i64, b: i64)`
- Performs multiplication: `result = a * b`
- Updates the calculator's stored result

### 5. `divide(a: i64, b: i64)`
- Performs division: `result = a / b`
- Includes safety check to prevent division by zero
- Updates the calculator's stored result

### 6. `clear()`
- Resets the calculator result to 0

### 7. `get_result()`
- Retrieves and logs the current result (read-only operation)

## Account Structure

```rust
pub struct Calculator {
    pub result: i64,    // Current calculation result
    pub owner: Pubkey,  // Owner's public key
}
```

## Error Handling

The contract includes custom error types:
- `DivisionByZero`: Prevents division by zero operations
- `Unauthorized`: Ensures only the owner can perform operations

## Building and Testing

### Prerequisites
- Rust and Cargo
- Node.js and npm/yarn
- Anchor CLI
- Solana CLI

### Setup
1. Install dependencies:
```bash
yarn install
```

2. Build the program:
```bash
anchor build
```

3. Run tests:
```bash
anchor test
```

### Testing the Calculator

The test suite includes comprehensive tests for all operations:

1. **Initialization Test**: Verifies calculator account creation
2. **Arithmetic Tests**: Tests addition, subtraction, multiplication, and division
3. **Error Handling Tests**: Verifies division by zero prevention
4. **Security Tests**: Ensures only owners can access their calculator
5. **Utility Tests**: Tests clear and get_result functions

## Usage Example

```typescript
// Initialize calculator
await program.methods.initialize()
  .accounts({
    calculator: calculatorPda,
    user: user.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([user])
  .rpc();

// Perform addition
await program.methods.add(new anchor.BN(10), new anchor.BN(5))
  .accounts({
    calculator: calculatorPda,
    user: user.publicKey,
  })
  .signers([user])
  .rpc();

// Get result
const calculatorAccount = await program.account.calculator.fetch(calculatorPda);
console.log("Result:", calculatorAccount.result);
```

## Program ID

The program ID is: `7FszeYqKQWzkJuLB5zU2auPtGZQN6faJ33jzYspaC3d5`

## Security Features

1. **PDA (Program Derived Address)**: Each calculator account is created using a PDA derived from the user's public key
2. **Owner Verification**: All operations verify that the caller is the owner of the calculator
3. **Input Validation**: Division by zero is prevented with proper error handling
4. **Account Constraints**: Uses Anchor's account validation to ensure proper account relationships

## Deployment

To deploy to a Solana cluster:

1. Update the cluster configuration in `Anchor.toml`
2. Build the program: `anchor build`
3. Deploy: `anchor deploy`

## License

This project is open source and available under the MIT License. 