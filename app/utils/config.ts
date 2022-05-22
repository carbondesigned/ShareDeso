import { web3 } from '@project-serum/anchor';
import { PublicKey, clusterApiUrl } from '@solana/web3.js';
import idl from '../myepicproject.json';

import kp from '../keypair.json';

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the data.
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = Keypair.fromSecretKey(secret);

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

export { baseAccount, programID, network, SystemProgram };
