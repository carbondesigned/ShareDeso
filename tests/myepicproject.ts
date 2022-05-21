import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import type { Myepicproject } from '../target/types/myepicproject';

const { SystemProgram } = anchor.web3;

describe('myepicproject', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Myepicproject as Program<Myepicproject>;

  const baseAccount = anchor.web3.Keypair.generate();

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.methods
      .startStuffOff()
      .accounts({
        baseAccount: baseAccount.publicKey,
        user: anchor.AnchorProvider.env().wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([baseAccount])
      .rpc();
    console.log('Your transaction signature', tx);

    let account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log('👀 GIF Count', account.totalPosts.toString());

    await program.methods
      .addPost(
        'https://media.giphy.com/media/26xBzu2ogAunL19hS/giphy-downsized-large.gif',
        'This is the first test post'
      )
      .accounts({
        baseAccount: baseAccount.publicKey,
      })
      .rpc();
    // Get the account again to see what changed.
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count', account.totalPosts.toString());

    // see the posts
    console.log('📝 Posts', account.posts);
  });
});
