use anchor_lang::prelude::*;

declare_id!("HdMEs2wsVHy3HyjW3BjQ4AJwTASWM4RwteJC5jsm4xYr");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_posts = 0;
    Ok(())
  }
  
	// Another function woo!
  pub fn add_post(ctx: Context<AddPost>, img_link: String, content: String) -> Result <()> {
    // Get a reference to the account and increment total_posts.
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

    let post = PostItem {
      img_link: img_link.to_string(),
      content: content.to_string(),
      user_address: *user.to_account_info().key,
    };

    base_account.posts.push(post);
    base_account.total_posts += 1;
    Ok(())
  }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
  #[account(init, payer = user, space = 9000)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program <'info, System>,
}

// Specify what data you want in the AddGif Context.
// Getting a handle on the flow of things :)?
#[derive(Accounts)]
pub struct AddPost<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct PostItem {
  pub img_link: String,
  pub content: String,
  pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
    pub total_posts: u64,
    pub posts: Vec<PostItem>
}