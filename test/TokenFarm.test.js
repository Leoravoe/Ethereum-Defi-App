const TokenFarm = artifacts.require("TokenFarm")
const DaiToken = artifacts.require("DaiToken")
const DappToken = artifacts.require("DappToken")


require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n){
    return web3.utils.toWei(n,'ether')
}

contract('TokenFarm',(accounts)=>{
    let daiToken , dappToken, tokenFarm
    before(async ()=>{
        // load contracts
        daiToken = await DaiToken.new();
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address,daiToken.address);

        // Transfer all the token to token farm
        await dappToken.transfer(tokenFarm.address,tokens('1000000'))
        // Transfer 100 Mock DAI tokens to investor
        await daiToken.transfer(accounts[1],tokens('100'),{from : accounts[0]})
    })


    describe('Mock Dai deployment', async ()=>{
        it('has a name', async ()=>{
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })
    describe('Dapp deployment', async ()=>{
        it('has a name', async ()=>{
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })
    describe('Token Farm deployment', async ()=>{
        it('has a name', async ()=>{
            const name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm')
        })

        it('contract has balance', async ()=>{
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Farming token', async ()=>{
        it('rewards investors for staking mDai token',async ()=>{
            let result
            result = await daiToken.balanceOf(accounts[1])
            assert.equal(result.toString(), tokens('100'),'investor mock DAI wallet balance correct before staking')

            // Stake mock dai token
            await daiToken.approve(tokenFarm.address, tokens('100'), {from: accounts[1]})
            await tokenFarm.stakeTokens(tokens('100'), {from: accounts[1]})

            // check staking balance 
            result = await daiToken.balanceOf(accounts[1])
            assert.equal(result.toString(), tokens('0'), 'investor mock Dai wallet balance correct after staking')

            result = await tokenFarm.stackingBalance(accounts[1])
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')
            
            result = await tokenFarm.isStacking(accounts[1])
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

            // issue tokens
            await tokenFarm.issueTokens({from: accounts[0]})

            // check balances after issuing 
            result = await dappToken.balanceOf(accounts[1])
            
            // ensure taht only owner can issue tokens
            await tokenFarm.issueTokens({from: accounts[1]}).should.be.rejected;
            

            

        })
    })
})
