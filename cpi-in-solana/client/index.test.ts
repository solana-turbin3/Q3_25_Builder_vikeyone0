import {test, expect} from "bun:test";
import path from "path";
import { LiteSVM } from "litesvm";
import {
	PublicKey,
	Transaction,
	SystemProgram,
	Keypair,
	LAMPORTS_PER_SOL,
} from "@solana/web3.js";

test("one transfer", () => {
	const svm = new LiteSVM();
    const contractPubkey = PublicKey.unique();
    svm.addProgramFromFile(contractPubkey, "./doublecounter.so")
	const payer = new Keypair();
	svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL));

    const dataAccount = new Keypair();
    const blockhash = svm.latestBlockhash();
    const ixs = [
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: dataAccount.publicKey,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            programId:contractPubkey,
            space:4,

        })
    ]
	
	const tx = new Transaction();
	tx.recentBlockhash = blockhash;
	tx.add(...ixs);
	tx.sign(payer, dataAccount);
	svm.sendTransaction(tx);
	const balanceAfter = svm.getBalance(dataAccount.publicKey);
	expect(balanceAfter).toBe(svm.minimumBalanceForRentExemption(BigInt(4)));
});