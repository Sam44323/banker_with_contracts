// contracts/Token.sol

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Token is ERC20, Ownable {
    using Address for address;
    uint256 internal MAX_SUPPLY = 1_000_000 * 10**18;
    uint256 internal minted_tokens = 0;
    uint256 internal mintedToken;

    constructor() ERC20("Banker", "BKR") {
        mintedToken = 100;
        _mint(msg.sender, 100 * 10**18);
    }

    // function for adding liquidity to a contract for LP purposes

    function mint(address _recipient, uint256 _amount) public onlyAdmin {
        require(
            minted_tokens + _amount <= MAX_SUPPLY,
            "Token supply is already capped"
        );
        mintedToken += _amount;
        _mint(_recipient, _amount * 10**18);
    }

    // function for transferring ownership of the token contract

    function transferOwnership(address _recipient) public override onlyAdmin {
        require(
            !address(_recipient).isContract(),
            "Recipient musn't be a contract"
        );
        _transferOwnership(_recipient);
    }

    function tokensMinted() public view returns (uint256) {
        return mintedToken;
    }

    // modifier for only admin

    modifier onlyAdmin() {
        require(msg.sender == owner(), "Admin can call this function!");
        _;
    }
}
