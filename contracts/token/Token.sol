// contracts/Token.sol

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Token is Ownable, ERC20Capped {
    using Address for address;
    uint256 internal mintedToken;

    constructor() ERC20("Banker", "BKR") ERC20Capped(100000 * 10**18) {}

    // function for adding liquidity to a contract for LP purposes

    function mint(address _recipient) public onlyAdmin {
        require(mintedToken <= cap(), "Token supply is already capped");
        _mint(_recipient, 1000 ether);
        mintedToken += 1000 ether;
    }

    // function for transferring ownership of the token contract

    function transferOwnership(address _recipient) public override onlyAdmin {
        require(
            !address(_recipient).isContract(),
            "Recipient musn't be a contract"
        );
        _transferOwnership(_recipient);
    }

    // modifier for only admin

    modifier onlyAdmin() {
        require(msg.sender != owner(), "Admin can call this function!");
        _;
    }
}
