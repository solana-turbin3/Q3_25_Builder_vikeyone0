import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Calculator } from "../target/types/calculator";
import { PublicKey, SystemProgram, Keypair, Connection } from "@solana/web3.js";

export class CalculatorClient {
  private program: Program<Calculator>;
  private connection: Connection;
  private user: Keypair;

  constructor(
    connection: Connection,
    user: Keypair,
    programId: PublicKey
  ) {
    this.connection = connection;
    this.user = user;
    
    // Create provider
    const provider = new anchor.AnchorProvider(
      connection,
      new anchor.Wallet(user),
      { commitment: "confirmed" }
    );
    
    // Create program instance
    this.program = new Program<Calculator>(
      require("../target/idl/calculator.json"),
      programId,
      provider
    ) as Program<Calculator>;
  }

  /**
   * Get the PDA for the calculator account
   */
  private getCalculatorPda(): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("calculator"), this.user.publicKey.toBuffer()],
      this.program.programId
    );
    return pda;
  }

  /**
   * Initialize a new calculator account
   */
  async initialize(): Promise<string> {
    const calculatorPda = this.getCalculatorPda();
    
    const tx = await this.program.methods
      .initialize()
      .accounts({
        calculator: calculatorPda,
        user: this.user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([this.user])
      .rpc();

    console.log("Calculator initialized with transaction:", tx);
    return tx;
  }

  /**
   * Perform addition
   */
  async add(a: number, b: number): Promise<string> {
    const calculatorPda = this.getCalculatorPda();
    
    const tx = await this.program.methods
      .add(new anchor.BN(a), new anchor.BN(b))
      .accounts({
        calculator: calculatorPda,
        user: this.user.publicKey,
      })
      .signers([this.user])
      .rpc();

    console.log(`${a} + ${b} = ${a + b}`);
    return tx;
  }

  /**
   * Perform subtraction
   */
  async subtract(a: number, b: number): Promise<string> {
    const calculatorPda = this.getCalculatorPda();
    
    const tx = await this.program.methods
      .subtract(new anchor.BN(a), new anchor.BN(b))
      .accounts({
        calculator: calculatorPda,
        user: this.user.publicKey,
      })
      .signers([this.user])
      .rpc();

    console.log(`${a} - ${b} = ${a - b}`);
    return tx;
  }

  /**
   * Perform multiplication
   */
  async multiply(a: number, b: number): Promise<string> {
    const calculatorPda = this.getCalculatorPda();
    
    const tx = await this.program.methods
      .multiply(new anchor.BN(a), new anchor.BN(b))
      .accounts({
        calculator: calculatorPda,
        user: this.user.publicKey,
      })
      .signers([this.user])
      .rpc();

    console.log(`${a} * ${b} = ${a * b}`);
    return tx;
  }

  /**
   * Perform division
   */
  async divide(a: number, b: number): Promise<string> {
    if (b === 0) {
      throw new Error("Division by zero is not allowed");
    }

    const calculatorPda = this.getCalculatorPda();
    
    const tx = await this.program.methods
      .divide(new anchor.BN(a), new anchor.BN(b))
      .accounts({
        calculator: calculatorPda,
        user: this.user.publicKey,
      })
      .signers([this.user])
      .rpc();

    console.log(`${a} / ${b} = ${a / b}`);
    return tx;
  }

  /**
   * Clear the calculator result
   */
  async clear(): Promise<string> {
    const calculatorPda = this.getCalculatorPda();
    
    const tx = await this.program.methods
      .clear()
      .accounts({
        calculator: calculatorPda,
        user: this.user.publicKey,
      })
      .signers([this.user])
      .rpc();

    console.log("Calculator cleared");
    return tx;
  }

  /**
   * Get the current result
   */
  async getResult(): Promise<number> {
    const calculatorPda = this.getCalculatorPda();
    
    try {
      const calculatorAccount = await this.program.account.calculator.fetch(calculatorPda);
      return calculatorAccount.result;
    } catch (error) {
      console.error("Error fetching calculator result:", error);
      throw new Error("Calculator not initialized. Please call initialize() first.");
    }
  }

  /**
   * Get calculator account info
   */
  async getCalculatorInfo(): Promise<{ result: number; owner: string } | null> {
    const calculatorPda = this.getCalculatorPda();
    
    try {
      const calculatorAccount = await this.program.account.calculator.fetch(calculatorPda);
      return {
        result: calculatorAccount.result,
        owner: calculatorAccount.owner.toString()
      };
    } catch (error) {
      return null;
    }
  }
}

// Example usage
async function example() {
  // Connect to localnet
  const connection = new Connection("http://localhost:8899", "confirmed");
  
  // Create a new keypair for testing
  const user = Keypair.generate();
  
  // Airdrop some SOL
  const signature = await connection.requestAirdrop(
    user.publicKey,
    2 * anchor.web3.LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(signature);
  
  // Program ID from Anchor.toml
  const programId = new PublicKey("7FszeYqKQWzkJuLB5zU2auPtGZQN6faJ33jzYspaC3d5");
  
  // Create calculator client
  const calculator = new CalculatorClient(connection, user, programId);
  
  try {
    // Initialize calculator
    await calculator.initialize();
    
    // Perform some calculations
    await calculator.add(10, 5);
    await calculator.multiply(3, 7);
    await calculator.subtract(25, 8);
    await calculator.divide(30, 3);
    
    // Get final result
    const result = await calculator.getResult();
    console.log("Final result:", result);
    
    // Clear calculator
    await calculator.clear();
    
  } catch (error) {
    console.error("Error:", error);
  }
}

// Uncomment to run example
// example(); 