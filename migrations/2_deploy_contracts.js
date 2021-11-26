const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

module.exports = async function (deployer, network, accounts) {
    
    // Deployed token
    await deployer.deploy(DaiToken);
    const daiToken = await DaiToken.deployed();
    
    await deployer.deploy(DappToken);
    const dapptoken = await DappToken.deployed();
    
    await deployer.deploy(TokenFarm, DappToken.address, DaiToken.address);
    const tokenFarm = await TokenFarm.deployed();

    // Transfer all the token to token farm
    await dapptoken.transfer(tokenFarm.address,'1000000000000000000000000')
    // Transfer 100 Mock DAI tokens to investor
    await daiToken.transfer(accounts[1],'10000000000000000000000')
};
