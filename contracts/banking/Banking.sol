// contracts/Token.sol

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Banking is Ownable {
    IERC20 private immutable token;
    mapping(address => bool) public blacklisted;
    mapping(address => uint256) public balances;

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
