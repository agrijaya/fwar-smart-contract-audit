// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/// @custom:security-contact security@agtek.cloud
contract FWAR is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, ERC20PausableUpgradeable, AccessControlUpgradeable, ERC20PermitUpgradeable, UUPSUpgradeable, ReentrancyGuardUpgradeable {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BLACKLIST_ROLE = keccak256("BLACKLIST_ROLE");

    address[] public holderToken;
    uint256 public _userId;
    bool private locked;

    ERC20Storage private _storage 

    mapping(address => TokenHolderInfo) public tokenHolderInfos;
    mapping(address => BlacklistEntry) public blacklist;
    mapping(address => bool) private _lockWhiteList;

    event AddedGroupToBlacklist(address indexed account, string reason);
    event AddedToBlacklist(address indexed account, string reason);
    event RemovedFromBlacklist(address indexed account);

    struct TokenHolderInfo {
        uint256 _tokenId;
        address _from;
        address _to;
        uint256 _totalToken;
        bool _tokenHolder;
    }

    struct BlacklistEntry {
        bool isBlacklisted;
        string reason;
    }


    // event Transfer(address indexed _from, address indexed _to, uint256 _value);


    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address defaultAdmin, address pauser, address minter, bool icoLocked)
        initializer public
    {
        __ERC20_init("FWA Revolution", "FWAR");
        __ERC20Burnable_init();
        __ERC20Pausable_init();
        __AccessControl_init();
        __ERC20Permit_init("FWA Revolution");
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
        _grantRole(BLACKLIST_ROLE, defaultAdmin);
        locked = icoLocked;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(DEFAULT_ADMIN_ROLE)
        override
    {}

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20Upgradeable, ERC20PausableUpgradeable)
    {
        super._update(from, to, value);
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _storage._balances[account];
    }

    //--TRANSFER
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        require(!blacklist[_msgSender()].isBlacklisted, "Sender is blacklisted");
        require(!blacklist[recipient].isBlacklisted, "Recipient is blacklisted");
        _transfer(sender, recipient, amount);
        // DISABLED IF DEMO ------------ 
        require(amount > _storage._allowances[sender][_msgSender()], "ERC20: transfer amount exceeds allowance");
        // --------------------------
        _approve(sender, _msgSender(), _storage._allowances[sender][_msgSender()] - amount);
        return true;
    }

    function inc() internal {
        _userId++;
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        require(!blacklist[_msgSender()].isBlacklisted, "Sender is blacklisted");
        require(!blacklist[recipient].isBlacklisted, "Recipient is blacklisted");
        require(_msgSender() != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        // ------ DISABLED IF DEMO ----
        require(!locked || _lockWhiteList[_msgSender()] || _lockWhiteList[recipient], "ERC20: Not release yet");
        // ------
        require(_storage._balances[_msgSender()] >= amount, "ERC20: transfer amount exceeds balance");
        
        // _transfer(_msgSender(), recipient, amount);
        _transfer(_msgSender(), recipient, amount);
        _addToTokenHolder(recipient, amount);
        // emit Transfer(msg.sender, recipient, _value);
        return true;
    }

    function _addToTokenHolder(address recipient, uint256 amount) internal virtual {
        inc();
        _storage._balances[_msgSender()] -= amount;
        _storage._balances[recipient] += amount;

        TokenHolderInfo storage tokenHolderInfo = tokenHolderInfos[recipient];

        tokenHolderInfo._to = recipient;
        tokenHolderInfo._from = _msgSender();
        tokenHolderInfo._totalToken = amount;
        tokenHolderInfo._tokenHolder = true;
        tokenHolderInfo._tokenId = _userId;

        holderToken.push(recipient);
    }

    function getTokenHolderData(address _address) public view returns (uint256, address, address, uint256, bool) {
        return (
            tokenHolderInfos[_address]._tokenId,
            tokenHolderInfos[_address]._to,
            tokenHolderInfos[_address]._from,
            tokenHolderInfos[_address]._totalToken,
            tokenHolderInfos[_address]._tokenHolder
        );
    }

    function getTokenHolder() public view returns (address[] memory) {
        return holderToken;
    }

    //--ALLOWANCE
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _storage._allowances[owner][spender];
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        require(!blacklist[_msgSender()].isBlacklisted, "Sender is blacklisted");
        require(!blacklist[spender].isBlacklisted, "Spender is blacklisted");
        _approve(_msgSender(), spender, _storage._allowances[_msgSender()][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        // _approve(_msgSender(), spender, _storage._allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        require((_storage._allowances[_msgSender()][spender] - subtractedValue) < 0, "ERC20: decreased allowance below zero");
        _approve(_msgSender(), spender, _storage._allowances[_msgSender()][spender] - subtractedValue);
        return true;
    }

    //--LOCK
    // function release() external onlyRole(DEFAULT_ADMIN_ROLE) {
    //     locked = false;
    // }
 
    function release() external {
        locked = false;
    }

    // function lock() external onlyRole(DEFAULT_ADMIN_ROLE) {
    //     locked = true;
    // }

    function lock() external {
        locked = true;
    }

    function lockWhiteList(address owner) public view returns (bool) {
        return _lockWhiteList[owner];
    }

    function addToLockWhitelist(address wallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _lockWhiteList[wallet] = true;
    }

    function removeFromLockWhitelist(address wallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _lockWhiteList[wallet] = false;
    }


    //--APPROVE
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    //--BURN
    function burnFrom(address account, uint256 amount) public virtual override {
        // uint256 decreasedAllowance = allowance(account, _msgSender()).sub(amount, "ERC20: burn amount exceeds allowance");
        uint256 decreasedAllowance = allowance(account, _msgSender()) - amount;

        _approve(account, _msgSender(), decreasedAllowance);
        _burn(account, amount);
    }

    function addToBlacklist(address account, string memory reason) external onlyRole(BLACKLIST_ROLE) {
        blacklist[account] = BlacklistEntry(true, reason);
        emit AddedToBlacklist(account, reason);
    }

    function removeFromBlacklist(address account) external onlyRole(BLACKLIST_ROLE) {
        delete blacklist[account];
        emit RemovedFromBlacklist(account);
    }

    function addMultipleToBlacklist(address[] memory accounts, string memory reason) public onlyRole(BLACKLIST_ROLE) {
        for (uint i = 0; i < accounts.length; i++) {
            blacklist[accounts[i]] = BlacklistEntry(true, reason);
            emit AddedGroupToBlacklist(accounts[i], reason);
        }
    }   
 




    // LOGGING
    function getLockStatus() external view returns (address) {
        return msg.sender;
    }
}