import { Keypair } from "@solana/web3.js";
import bs58 from 'bs58'


// Generate a new keypair
let kp = Keypair.generate()
console.log(`You've generated a new Solana wallet:${kp.publicKey.toBase58()}`); //"wallet:2SGQ6TqeKdYBPLVM8M2cyJYNzEy7JWMpJaM2G857ofWG"]

console.log(`[${kp.secretKey}]`)

//import bs58 from 'bs58';
import wallet from "../airdrop/Turbin3-wallet.json";

const secretKey = new Uint8Array(wallet);

const base58 = bs58.encode(secretKey);
console.log(`Base58 encoded secret key: ${base58}`); // "2SGQ6TqeKdYBPLVM8M2cyJYNzEy7JWMpJaM2G857ofWG"