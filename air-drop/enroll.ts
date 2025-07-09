import { Connection, Keypair, PublicKey ,SystemProgram} from "@solana/web3.js"
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor"
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "../airdrop/Turbin3-wallet.json"
const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");



const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection("https://api.devnet.solana.com");

const provider = new AnchorProvider(connection, new Wallet(keypair), {commitment: "confirmed"});

const program = new Program<Turbin3Prereq>(IDL, provider);

// Create the PDA for our enrollment account
const account_seeds = [
Buffer.from("prereqs"),
keypair.publicKey.toBuffer(),
];
const [account_key, _account_bump] =
PublicKey.findProgramAddressSync(account_seeds, program.programId);
//console.log(program.programId);

const mintCollection = new
PublicKey("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2");

const mintTs = Keypair.generate();

// Execute the initialize transaction
// (async () => {
// try {
// const txhash = await program.methods
// .initialize("vickyone0")
// .accountsPartial({
// user: keypair.publicKey,
// account: account_key,
// system_program: SystemProgram.programId,
// })
// .signers([keypair])
// .rpc();
// console.log(`Success! Check out your TX here:
// https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
// } catch (e) {
// console.error(`Oops, something went wrong: ${e}`);
// }
// })();

// const authority_seeds = [
//   Buffer.from("authority"),
//   // You might need to add more seeds based on the IDL
// ];
const authority_seeds = [
  Buffer.from("collection"),
  mintCollection.toBuffer(), // or collection.toBuffer() if you use a different variable
];
const [authority_key, _authority_bump] = PublicKey.findProgramAddressSync(authority_seeds, program.programId);

console.log(`Authority Key: ${authority_key.toBase58()}`);

console.log(Object.keys(program.methods));

//Execute the submitTs transaction
(async () => {
try {
const txhash = await program.methods.
submitTs()
.accountsPartial({
user: keypair.publicKey,
account: account_key,
mint: mintTs.publicKey,
collection: mintCollection,
authority: authority_key, 
mpl_core_program: MPL_CORE_PROGRAM_ID,
system_program: SystemProgram.programId,
})
.signers([keypair, mintTs])
.rpc();
console.log(`Success! Check out your TX here:
https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
} 
catch (e) {
console.error(`Oops, something went wrong: ${e}`);
}})();