// use anchor_lang::prelude::*;

// declare_id!("7FszeYqKQWzkJuLB5zU2auPtGZQN6faJ33jzYspaC3d5");

// #[program]
// pub mod calculator {
//     use super::*;

//     pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
//         let calculator = &mut ctx.accounts.calculator;
//         calculator.result = 0;
//         calculator.owner = ctx.accounts.user.key();
//         msg!("Calculator initialized with result: {}", calculator.result);
//         Ok(())
//     }

//     pub fn add(ctx: Context<Calculate>, a: i64, b: i64) -> Result<()> {
//         let calculator = &mut ctx.accounts.calculator;
//         calculator.result = a + b;
//         msg!("{} + {} = {}", a, b, calculator.result);
//         Ok(())
//     }

//     pub fn subtract(ctx: Context<Calculate>, a: i64, b: i64) -> Result<()> {
//         let calculator = &mut ctx.accounts.calculator;
//         calculator.result = a - b;
//         msg!("{} - {} = {}", a, b, calculator.result);
//         Ok(())
//     }

//     pub fn multiply(ctx: Context<Calculate>, a: i64, b: i64) -> Result<()> {
//         let calculator = &mut ctx.accounts.calculator;
//         calculator.result = a * b;
//         msg!("{} * {} = {}", a, b, calculator.result);
//         Ok(())
//     }

//     pub fn divide(ctx: Context<Calculate>, a: i64, b: i64) -> Result<()> {
//         require!(b != 0, CalculatorError::DivisionByZero);
//         let calculator = &mut ctx.accounts.calculator;
//         calculator.result = a / b;
//         msg!("{} / {} = {}", a, b, calculator.result);
//         Ok(())
//     }

//     pub fn clear(ctx: Context<Calculate>) -> Result<()> {
//         let calculator = &mut ctx.accounts.calculator;
//         calculator.result = 0;
//         msg!("Calculator cleared. Result: {}", calculator.result);
//         Ok(())
//     }

//     pub fn get_result(ctx: Context<Calculate>) -> Result<()> {
//         let calculator = &ctx.accounts.calculator;
//         msg!("Current result: {}", calculator.result);
//         Ok(())
//     }
// }

// #[derive(Accounts)]
// pub struct Initialize<'info> {
//     #[account(
//         init,
//         payer = user,
//         space = 8 + 8 + 32, // discriminator + result + owner
//         seeds = [b"calculator", user.key().as_ref()],
//         bump
//     )]
//     pub calculator: Account<'info, Calculator>,
//     #[account(mut)]
//     pub user: Signer<'info>,
//     pub system_program: Program<'info, System>,
// }

// #[derive(Accounts)]
// pub struct Calculate<'info> {
//     #[account(
//         mut,
//         seeds = [b"calculator", user.key().as_ref()],
//         bump,
//         constraint = calculator.owner == user.key() @ CalculatorError::Unauthorized
//     )]
//     pub calculator: Account<'info, Calculator>,
//     pub user: Signer<'info>,
// }

// #[account]
// pub struct Calculator {
//     pub result: i64,
//     pub owner: Pubkey,
// }

// #[error_code]
// pub enum CalculatorError {
//     #[msg("Division by zero is not allowed")]
//     DivisionByZero,
//     #[msg("Only the owner can perform this operation")]
//     Unauthorized,
// }


use anchor_lang::prelude::*;

declare_id!("7FszeYqKQWzkJuLB5zU2auPtGZQN6faJ33jzYspaC3d5");

#[program]
pub mod calculator {
    use super::*;

    pub fn init(ctx: Context<Initialize>, init_value: u32) -> Result<()>{

        ctx.accounts.account.num = init_value;
        Ok(())
    }

    pub fn double(ctx: Context<Double>) -> Result<()>{
        ctx.accounts.account.num = ctx.accounts.account.num * 2;
        Ok(())
    }

    pub fn add(ctx: Context<Add>, num: u32) -> Result<()>{

        ctx.accounts.account.num = ctx.accounts.account.num + num;
        Ok(())
    }
}


    #[account]
    struct DataShape{
        pub num: u32
    }


    #[derive(Accounts)]
    pub struct Initialize<'info> {
        #[account(init, payer = signer, space = 8 + 4)]
        pub account: Account<'info , DataShape>,
        pub system_program: Program<'info, System>,
        #[account(mut)]
        signer: Signer<'info>
    }

    #[derive(Accounts)]
    pub struct Double<'info> {
        #[account(mut)]
        pub account: Account<'info , DataShape>,
        #[account(mut)]
        signer: Signer<'info>
    }


    #[derive(Accounts)]
    pub struct Add<'info> {
        #[account(mut)]
        pub account: Account<'info , DataShape>,
        #[account(mut)]
        signer: Signer<'info>
    }



