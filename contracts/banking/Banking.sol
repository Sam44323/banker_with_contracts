// contracts/Token.sol

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Banking is Ownable {
    IERC20 private immutable token; // storing the token BKR
    mapping(address => bool) internal blacklisted; // blacklisted addresses
    mapping(address => uint256) internal balances; // balancer deposited for each address
    
    mapping(address => uint256) internal rewardBalances; // storing theh reward balances airdropped

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }


    modifier onlyAdmin() {
        require(msg.sender == owner(), "Admin can call this function!");
        _;
    }

    modifier isNotBlacklisted(){
      require(!blacklisted[msg.sender], "You are blacklisted!");
      _
    }
}
