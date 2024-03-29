/* SPDX-License-Identifier: GNU AFFERO GENERAL PUBLIC LICENSE Version 3

Freedom Cash Helps Those Who Help Each Other Into Freedom, Fairness, Love and Peace. 

Total Supply:   369.369.369 Freedom Cash (FREEDOMCASH)

Utility:        Community investing in decentralized currencies while funding public goods 
                and providing playgrounds for freedom.
Liquidity:      The total supply of Freedom Cash is minted not to the developer or 
                deployer but to the smart contract itself (see constructor address(this)). 
                ETH liquidity is accrued automatically (see token economics diagram). 
                You might consider contributing to https://deno.land/x/freedom_cash_investor.
"Regulators":   Please think for yourself about the following while you go for a walk offline: 
                The crimes of the "governments" you worked for, seem much more dangerous to humanity 
                than the crimes which abuse freedom and privacy of money. 
                We believe in peace over war. We believe in freedom over totalitarianism.
                We believe in reasonable good police officers over kyc and total surveillance.
                We believe in free humans.
                You have proved that all your kyc, censorship, propaganda and visions of 
                totalitarian state money called CBDC do not succeed. 
                Even if you do not fully understand how we solve things yet,
                even if you do not like us, even if you cannot feel the hearts of free humans in your heart, 
                we invite you to join us, learn with us, help us and enjoy also
                the technical pulses of freedom block by block by block by block by block by block 
                by block by block by block
Wish:           Everyone who reads this with the best of intentions shall always have enough 
                Freedom Cash stored within self hosted paperwallets which shall be utilized 
                for fruitful and fair exploration of truth and peer to peer collaboration. 
                Please make Freedom Cash an homage to all who play for freedom and invest 
                some Finney right now. Start small and talk about Freedom. 
                We wish you all the best. */    

pragma solidity 0.8.19;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v4.9.4/contracts/token/ERC20/ERC20.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v4.9.4/contracts/utils/math/Math.sol";
import "https://github.com/Uniswap/v3-periphery/blob/v1.2.0/contracts/interfaces/ISwapRouter.sol";
import "https://github.com/Uniswap/v3-core/blob/v1.0.0/contracts/interfaces/IUniswapV3Factory.sol";
import "https://github.com/Uniswap/v3-core/blob/v1.0.0/contracts/interfaces/IUniswapV3Pool.sol";
import "https://github.com/Uniswap/v3-core/blob/v1.0.0/contracts/libraries/FixedPoint96.sol";

contract FreedomCash is ERC20 {
    address constant public routerAddress   = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address constant public factoryAddress  = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    address constant public wethAddress     = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    uint256 public iCCounter                = 0; 
    uint256 public pGCCounter               = 0;
    uint256 public gCCCounter               = 0;
    uint256 public aCounter                 = 0;    
    uint256 public investmentBudget         = 0;
    uint256 public liquidityBudget          = 0;
    uint256 public pubGoodsFundingBudget    = 0;
    uint256 public geoCashingBudget         = 0;    
    struct ICandidateInfo {
        address payable cAddress;
        uint256 eligibleRounds;
        uint256 clearedRounds;
        uint256 score;
    }
    struct PGCandidateInfo {
        address payable cAddress;
        uint256 successes;
        uint256 score;
    }    
    struct GCCandidateInfo {
        address payable cAddress;
        string text;
        uint256 successes;   
        uint256 score;
    }
    struct Attestation { // potential input for EAS via Freedom Enterprise
        address voter;
        address votedForAsset;
        bytes32 ofType; 
        uint256 WithValue;
        uint256 timestamp;
    }   
    mapping(uint256 => ICandidateInfo)  public investmentCandidates;
    mapping(uint256 => PGCandidateInfo) public pubGoodCandidates;
    mapping(uint256 => GCCandidateInfo) public geocashingCandidates;   
    mapping(uint256 => Attestation)     public attestations;
    mapping(address => uint256)         public iCIDs;
    mapping(address => uint256)         public pGCIDs;
    mapping(address => uint256)         public gCCIDs;
    error SellPriceMightHaveDropped();
    error TransferOfETHFailed();
    error UnreasonableRequest();
    constructor() ERC20("Freedom Cash", "FREEDOMCASH") {
        _mint(address(this), 369369369 * 10 ** decimals()); // into contract itself 
    }
    function voteForInvestmentIn(address payable scAddress, uint256 fCBuyPrice, uint256 fCAmount) public payable {
        if (iCIDs[scAddress] == 0) { // new candidate
            iCCounter = iCCounter + 1;
            iCIDs[scAddress] = iCCounter;
            ICandidateInfo memory candi = ICandidateInfo(scAddress,0, 0, 0);
            investmentCandidates[iCCounter] = candi;
        }
        uint256 vPower = msg.value + balanceOf(msg.sender);
        investmentCandidates[iCIDs[scAddress]].score = investmentCandidates[iCIDs[scAddress]].score + vPower;
        uint256 check = Math.mulDiv(msg.value, 10**18, fCBuyPrice); 
        if (check != fCAmount) { revert UnreasonableRequest(); }
        this.transfer(msg.sender, fCAmount);
        investmentBudget = investmentBudget + Math.mulDiv(msg.value, 33, 100); 
        reconcileAndClear(); 
        if (investmentBudget >= (99 * 10**15)) {
            address winner = getAddressOfHighestSoFar("investmentBet");
            investmentCandidates[iCIDs[winner]].eligibleRounds = investmentCandidates[iCIDs[winner]].eligibleRounds + 1;
            investmentCandidates[iCIDs[winner]].score = 0; 
        } 
        aCounter = aCounter + 1;
        attestations[aCounter] = Attestation(msg.sender, scAddress, "investmentBet", msg.value, block.timestamp);
    }
    function voteForPublicGood(address payable pubGoodWallet, uint256 fCBuyPrice, uint256 fCAmount) public payable {
        if (pGCIDs[pubGoodWallet] == 0) { // new candidate
            pGCCounter = pGCCounter + 1;
            pGCIDs[pubGoodWallet] = pGCCounter;
            PGCandidateInfo memory candi = PGCandidateInfo(pubGoodWallet, 0, 0);
            pubGoodCandidates[pGCCounter] = candi;
        }
        uint256 vPower = msg.value + balanceOf(msg.sender);
        pubGoodCandidates[pGCIDs[pubGoodWallet]].score =  pubGoodCandidates[pGCIDs[pubGoodWallet]].score + vPower;
        uint256 check = Math.mulDiv(msg.value, 10**18, fCBuyPrice); 
        if (check != fCAmount) { revert UnreasonableRequest(); }
        this.transfer(msg.sender, fCAmount);        
        pubGoodsFundingBudget = pubGoodsFundingBudget + Math.mulDiv(msg.value, 33, 100);
        reconcileAndClear();
        if(pubGoodsFundingBudget >= (99 * 10**15)) { 
            address winner = getAddressOfHighestSoFar("publicGoodsFunding");
            (bool sent, ) = winner.call{value: 99 * 10**15}("Congratulations");
            if (sent == false) { revert TransferOfETHFailed(); }
            pubGoodCandidates[pGCIDs[winner]].successes = pubGoodCandidates[pGCIDs[winner]].successes + 1;
            pubGoodsFundingBudget = pubGoodsFundingBudget - 99 * 10**15;   
            pubGoodCandidates[pGCIDs[winner]].score = 0;       
        }  
        aCounter = aCounter + 1;
        attestations[aCounter] = Attestation(msg.sender, pubGoodWallet, "publicGoodsFunding", msg.value, block.timestamp);
    }
    function voteForGeoCash(address payable geoCashAddress, string memory text, uint256 fCBuyPrice, uint256 fCAmount) public payable {
        if (gCCIDs[geoCashAddress] == 0) { // new candidate
            gCCCounter = gCCCounter + 1;
            gCCIDs[geoCashAddress] = gCCCounter;
            GCCandidateInfo memory candi = GCCandidateInfo(geoCashAddress, text, 0, 0);
            geocashingCandidates[gCCCounter] = candi;
        } 
        uint256 vPower = msg.value + balanceOf(msg.sender);        
        geocashingCandidates[gCCIDs[geoCashAddress]].score = 
        geocashingCandidates[gCCIDs[geoCashAddress]].score + vPower;
        uint256 check = Math.mulDiv(msg.value, 10**18, fCBuyPrice); 
        if (check != fCAmount) { revert UnreasonableRequest(); }
        this.transfer(msg.sender, fCAmount);        
        geoCashingBudget = geoCashingBudget + Math.mulDiv(msg.value, 33, 100);
        reconcileAndClear();   
        if(geoCashingBudget >= (99 * 10**15)){
            address payable winner = getAddressOfHighestSoFar("geoCashing");
            (bool sent, ) = winner.call{value: 99 * 10**15}("Congratulations");
            if (sent == false) { revert TransferOfETHFailed(); }
            geocashingCandidates[gCCIDs[winner]].successes = geocashingCandidates[gCCIDs[winner]].successes + 1;
            geoCashingBudget = geoCashingBudget - 99 * 10**15;     
            geocashingCandidates[gCCIDs[winner]].score = 0;                   
        }
        aCounter = aCounter + 1;
        attestations[aCounter] = Attestation(msg.sender, geoCashAddress, "geoCashing", msg.value, block.timestamp);              
    } 
    function executeCommunityInvestment(address asset, uint24 poolFee, uint24 maxSlip) public {
        if (investmentBudget <= (99 * 10**15)) { revert UnreasonableRequest(); }
        uint256 delta = investmentCandidates[iCIDs[asset]].eligibleRounds - investmentCandidates[iCIDs[asset]].clearedRounds;
        if (delta == 0) { revert UnreasonableRequest(); }
        if (delta > 9) { handlePotentialSwapProblems(delta, asset); }
        uint256 amount = (99 * 10**15) * delta;
        address poolAddress = getPoolAddress(wethAddress, asset, poolFee);
        uint256 price = getPriceForInvestment(asset, poolAddress);
        uint256 amountOutMinimum = getAmountOutMinimum(asset, amount, price, maxSlip);
        swipSwapV3(wethAddress, asset, amount, poolFee, amountOutMinimum);
        investmentBudget = investmentBudget - amount;  
        investmentCandidates[iCIDs[asset]].clearedRounds = investmentCandidates[iCIDs[asset]].eligibleRounds;
    }     
    function takeProfits(address asset, uint256 amount, uint24 poolFee, uint24 maxSlip) public {
        if ((getSellPrice() + (getSellPrice() * 9/100)) > getBuyPrice(10**18)) { revert UnreasonableRequest(); }
        if(asset == address(this) || IERC20(asset).balanceOf(address(this)) < amount) { revert UnreasonableRequest(); }
        address poolAddress = getPoolAddress(asset, wethAddress, poolFee);
        uint256 price = getPriceForInvestment(wethAddress, poolAddress);
        uint256 amountOutMinimum = getAmountOutMinimum(wethAddress, amount, price, maxSlip);
        swipSwapV3(asset, wethAddress, amount, poolFee, amountOutMinimum);
        reconcileAndClear();
    }        
    function sellFreedomCash(uint256 amount, uint256 sellPrice) public {
        if (amount > balanceOf(msg.sender)) { revert UnreasonableRequest(); }
        if (getSellPrice() < sellPrice) { revert SellPriceMightHaveDropped(); }
        uint256 amountOfETHToBeSent = Math.mulDiv(amount, getSellPrice(), 10**18); 
        if (allowance(msg.sender, address(this)) < amount) approve(address(this), amount);
        IERC20(address(this)).transferFrom(msg.sender, address(this), amount);
        (bool sent, ) = msg.sender.call{value: amountOfETHToBeSent}("Freedom Cash");
        if (sent == false) { revert TransferOfETHFailed(); }
        reconcileAndClear();
    }
    function getBuyPrice(uint256 amountToBeBought) public view returns(uint256){
        if(amountToBeBought < 9*10**9) { revert UnreasonableRequest(); }
        uint256 underway = totalSupply() - balanceOf(address(this));    
        uint256 toBeUnderway = underway + amountToBeBought;
        return Math.mulDiv(9 * 10**9, toBeUnderway, 10**18);
    }
    function getSellPrice() public view returns(uint256) {
        uint256 underway = totalSupply() - balanceOf(address(this)); 
        if (underway == 0) { revert UnreasonableRequest(); }
        uint256 sellPrice = Math.mulDiv(liquidityBudget, 10**18, underway);
        if (sellPrice > getBuyPrice(10**18)) sellPrice = getBuyPrice(10**18);
        return sellPrice;
    }   
    function getAddressOfHighestSoFar(bytes32 gameType) public view returns(address payable) {
        uint256 highestSoFar = 0;
        address payable addressOfHighestSoFar;
        if (gameType == "investmentBet") {
            for (uint256 i = 1; i <= iCCounter; i++) {
                if(investmentCandidates[i].score > highestSoFar) {
                    highestSoFar = investmentCandidates[i].score;
                    addressOfHighestSoFar = investmentCandidates[i].cAddress;
                }
            }
        } else if (gameType == "publicGoodsFunding") {
            for (uint256 i = 1; i <= pGCCounter; i++) {
                if(pubGoodCandidates[i].score > highestSoFar) {
                    highestSoFar = pubGoodCandidates[i].score;
                    addressOfHighestSoFar = pubGoodCandidates[i].cAddress;
                }
            }            
        } else if (gameType == "geoCashing") {
            for (uint256 i = 1; i <= gCCCounter; i++) {
                if(geocashingCandidates[i].score > highestSoFar) {
                    highestSoFar = geocashingCandidates[i].score;
                    addressOfHighestSoFar = geocashingCandidates[i].cAddress;
                }
            }            
        } else {
            revert UnreasonableRequest();
        } 
        return addressOfHighestSoFar;
    }
    function handlePotentialSwapProblems(uint256 iRounds, address swapTroubleAsset) internal {
        investmentBudget = investmentBudget - ((99 * 10**15) * iRounds);  
        reconcileAndClear(); // making the best out of potential swap troubles 
        investmentCandidates[iCIDs[swapTroubleAsset]].clearedRounds  = investmentCandidates[iCIDs[swapTroubleAsset]].eligibleRounds;
    }    
    function getAmountOutMinimum(address tOut, uint256 aIn, uint256 price, uint24 maxSlip) public view returns(uint256) {
        uint256 output = (aIn * 10**ERC20(tOut).decimals()) / price;
        return output - ((output * maxSlip) / 1000);
    }
    function getPoolAddress(address t1, address t2, uint24 fee) public view returns(address) {
        return IUniswapV3Factory(factoryAddress).getPool(t1, t2, fee);
    }
    function getPriceForInvestment(address asset, address poolAddress) public view returns(uint256) {
        IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);
        (uint160 sqrtPriceX96, , , , , , ) = pool.slot0();
        uint256 amount0 = (10**ERC20(pool.token1()).decimals()) * Math.mulDiv(pool.liquidity(), FixedPoint96.Q96, sqrtPriceX96);
        uint256 amount1 = (10**ERC20(pool.token0()).decimals()) * Math.mulDiv(pool.liquidity(), sqrtPriceX96, FixedPoint96.Q96);
        if (pool.token0() == asset) {
            return Math.mulDiv(amount1, 10**18, amount0);
        } else {
            return Math.mulDiv(amount0, 10**18, amount1);
        }
    }    
    function swipSwapV3(address tIn, address tOut,uint256 aIn, uint24 poolFee, uint256 amountOutMinimum) internal {
        ISwapRouter swapRouter = ISwapRouter(routerAddress);
        if (IERC20(tIn).allowance(address(this), address(routerAddress)) < aIn) {
            IERC20(tIn).approve(address(routerAddress), IERC20(tIn).balanceOf(address(this)));
        }
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({tokenIn: tIn,tokenOut: tOut,fee: poolFee,recipient: address(this),
                deadline: block.timestamp + 60, amountIn: aIn,amountOutMinimum: amountOutMinimum, 
                sqrtPriceLimitX96: 0 // not needed because amountOutMinimum avoids exploits
            });
        unchecked {
            swapRouter.exactInputSingle{value: aIn}(params);
        }
        reconcileAndClear(); 
    }    
    function reconcileAndClear() internal {
        liquidityBudget = address(this).balance - investmentBudget - geoCashingBudget - pubGoodsFundingBudget;
    }
}