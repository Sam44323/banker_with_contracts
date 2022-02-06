// contracts/Token.sol

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Banking is Ownable {
    IERC20 private immutable token; // storing the token BKR
    mapping(address => bool) internal blacklisted; // blacklisted addresses
    mapping(address => uint256) internal balances; // balancer deposited for each address

    mapping(address => uint256) internal rewardBalances; // storing the reward balances airdropped

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    /*
     * @dev: check if the address is blacklisted
     * @param: user: address of the user
     */

    function isBlaclisted(address user) public view returns (bool) {
        return blacklisted[user];
    }

    /*
     * @dev: to get the balance of the user
     * @param: user: address of the user
     */

    function userBalance(address user) public view returns (uint256) {
        require(balances[user] > 0, "User has no balance");
        return balances[user];
    }

    /*
     * @dev: to get the total reward given to the user in terms of BKR
     * @param: user: address of the user
     */

    function totalRewardReceived(address user) public view returns (uint256) {
        return rewardBalances[user];
    }

    /*
     * @dev: to add a user to the blacklist
     * @param: user: address of the user
     */

    function addToBlacklist(address user) public onlyAdmin {
        require(!blacklisted[user], "User is already blacklisted");
        blacklisted[user] = true;
    }

    modifier onlyAdmin() {
        require(msg.sender == owner(), "Admin can call this function!");
        _;
    }

    modifier isNotBlacklisted() {
        require(!blacklisted[msg.sender], "You are blacklisted!");
        _;
    }
}
