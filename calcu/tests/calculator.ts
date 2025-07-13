import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Calculator } from "../target/types/calculator";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { expect } from "chai";

describe("calculator", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Calculator as Program<Calculator>;
  const user = Keypair.generate();

  // PDA for the calculator account
  const [calculatorPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("calculator"), user.publicKey.toBuffer()],
    program.programId
  );

  before(async () => {
    // Airdrop SOL to the user
    const signature = await provider.connection.requestAirdrop(
      user.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
  });

  it("Initializes the calculator", async () => {
    try {
      const tx = await program.methods
        .initialize()
        .accounts({
          calculator: calculatorPda,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc();

      console.log("Initialize transaction signature:", tx);

      // Fetch the calculator account to verify initialization
      const calculatorAccount = await program.account.calculator.fetch(calculatorPda);
      expect(calculatorAccount.result).to.equal(0);
      expect(calculatorAccount.owner.toString()).to.equal(user.publicKey.toString());

      console.log("Calculator initialized successfully!");
    } catch (error) {
      console.error("Error initializing calculator:", error);
      throw error;
    }
  });

  it("Performs addition", async () => {
    try {
      const a = 10;
      const b = 5;
      
      const tx = await program.methods
        .add(new anchor.BN(a), new anchor.BN(b))
        .accounts({
          calculator: calculatorPda,
          user: user.publicKey,
        })
        .signers([user])
        .rpc();

      console.log("Add transaction signature:", tx);

      // Verify the result
      const calculatorAccount = await program.account.calculator.fetch(calculatorPda);
      expect(calculatorAccount.result).to.equal(a + b);
      console.log(`Addition result: ${a} + ${b} = ${calculatorAccount.result}`);
    } catch (error) {
      console.error("Error performing addition:", error);
      throw error;
    }
  });

  it("Performs subtraction", async () => {
    try {
      const a = 20;
      const b = 7;
      
      const tx = await program.methods
        .subtract(new anchor.BN(a), new anchor.BN(b))
        .accounts({
          calculator: calculatorPda,
          user: user.publicKey,
        })
        .signers([user])
        .rpc();

      console.log("Subtract transaction signature:", tx);

      // Verify the result
      const calculatorAccount = await program.account.calculator.fetch(calculatorPda);
      expect(calculatorAccount.result).to.equal(a - b);
      console.log(`Subtraction result: ${a} - ${b} = ${calculatorAccount.result}`);
    } catch (error) {
      console.error("Error performing subtraction:", error);
      throw error;
    }
  });

  it("Performs multiplication", async () => {
    try {
      const a = 6;
      const b = 8;
      
      const tx = await program.methods
        .multiply(new anchor.BN(a), new anchor.BN(b))
        .accounts({
          calculator: calculatorPda,
          user: user.publicKey,
        })
        .signers([user])
        .rpc();

      console.log("Multiply transaction signature:", tx);

      // Verify the result
      const calculatorAccount = await program.account.calculator.fetch(calculatorPda);
      expect(calculatorAccount.result).to.equal(a * b);
      console.log(`Multiplication result: ${a} * ${b} = ${calculatorAccount.result}`);
    } catch (error) {
      console.error("Error performing multiplication:", error);
      throw error;
    }
  });

  it("Performs division", async () => {
    try {
      const a = 50;
      const b = 5;
      
      const tx = await program.methods
        .divide(new anchor.BN(a), new anchor.BN(b))
        .accounts({
          calculator: calculatorPda,
          user: user.publicKey,
        })
        .signers([user])
        .rpc();

      console.log("Divide transaction signature:", tx);

      // Verify the result
      const calculatorAccount = await program.account.calculator.fetch(calculatorPda);
      expect(calculatorAccount.result).to.equal(a / b);
      console.log(`Division result: ${a} / ${b} = ${calculatorAccount.result}`);
    } catch (error) {
      console.error("Error performing division:", error);
      throw error;
    }
  });

  it("Prevents division by zero", async () => {
    try {
      const a = 10;
      const b = 0;
      
      await program.methods
        .divide(new anchor.BN(a), new anchor.BN(b))
        .accounts({
          calculator: calculatorPda,
          user: user.publicKey,
        })
        .signers([user])
        .rpc();

      // If we reach here, the test should fail
      expect.fail("Division by zero should have failed");
    } catch (error) {
      console.log("Division by zero correctly prevented:", error.message);
      expect(error.message).to.include("Division by zero is not allowed");
    }
  });

  it("Gets the current result", async () => {
    try {
      const tx = await program.methods
        .getResult()
        .accounts({
          calculator: calculatorPda,
          user: user.publicKey,
        })
        .signers([user])
        .rpc();

      console.log("Get result transaction signature:", tx);
      console.log("Current result retrieved successfully");
    } catch (error) {
      console.error("Error getting result:", error);
      throw error;
    }
  });

  it("Clears the calculator", async () => {
    try {
      const tx = await program.methods
        .clear()
        .accounts({
          calculator: calculatorPda,
          user: user.publicKey,
        })
        .signers([user])
        .rpc();

      console.log("Clear transaction signature:", tx);

      // Verify the result is cleared
      const calculatorAccount = await program.account.calculator.fetch(calculatorPda);
      expect(calculatorAccount.result).to.equal(0);
      console.log("Calculator cleared successfully!");
    } catch (error) {
      console.error("Error clearing calculator:", error);
      throw error;
    }
  });

  it("Prevents unauthorized access", async () => {
    try {
      const unauthorizedUser = Keypair.generate();
      
      // Airdrop SOL to the unauthorized user
      const signature = await provider.connection.requestAirdrop(
        unauthorizedUser.publicKey,
        anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(signature);

      await program.methods
        .add(new anchor.BN(5), new anchor.BN(3))
        .accounts({
          calculator: calculatorPda,
          user: unauthorizedUser.publicKey,
        })
        .signers([unauthorizedUser])
        .rpc();

      // If we reach here, the test should fail
      expect.fail("Unauthorized access should have failed");
    } catch (error) {
      console.log("Unauthorized access correctly prevented:", error.message);
      expect(error.message).to.include("Only the owner can perform this operation");
    }
  });
});
