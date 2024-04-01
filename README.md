# FWAR

It include the ERC-20 smart contract code for FWAR


-----

``` java

modifier:
1. onlyRole(bytes32)


variable:
1. bytes32 constant PAUSER_ROLE
2. bytes32 constant MINTER_ROLE
3. bytes32 constant BLACKLIST_ROLE
4. address[] public holderToken
5. uint256 public userId;
6. bool private _locked
7. mapping(address => mapping(address => uint256)) private _allowance
8. mapping(address => uint256) private _balances
9. mapping(address => TokenHolderInfo) public tokenHolderInfos
10. mapping(address => BlacklistEntry) private _lockWhitelist
11. mapping(address => bool) private _lockWhitelist


event:
1. AddToBlaclist
2. RemoveFromBlacklist
3. AddedGroupToBlacklist


external function:
1. release                                                      onlyRole(DEFAULT_ADMIN_ROLE)
2. lock                                                         onlyRole(DEFAULT_ADMIN_ROLE)
3. addToLockWhitelist(address wallet)                           onlyRole(DEFAULT_ADMIN_ROLE)
4. removeToLockWhitelist(address wallet)                        onlyRole(DEFAULT_ADMIN_ROLE)
5. addToBlacklist(address account, string memory reason)        onlyRole(DEFAULT_ADMIN_ROLE)
6. removeToBlacklist(address account)                           onlyRole(DEFAULT_ADMIN_ROLE)

internal function:
1. _authorizeUpgrade(address)
2. 



public function:
1. initialize(address defaultAdmin, address pauser, address minter, bool icoLocked)     initializer
2. pause()
3. unpause()
3. mint()


struct:
1. TokenHolderInfo{}
2. BlacklistEntry{}





notes:
1. role are represented as keccak256

```


TODO:
1. Add Validation

```npx hardhat run scripts/deploy.js --network ganache```





------------------------------


Multisig wallet

constructor:
1. list of owners
2. required number


modifier:
1. onlyWallet
2. ownerDoestNotExist(owner)
3. ownerExists(owner)
4. transactionsExists(transactionId)
5. confirmed(transactionId, owner)
6. notConfirmed(transactionId, owner)
7. notExecuted(transactionId)
8. notNull(_address)
9. validRequirement(ownerCount, required)


function:
1. addOwner(owner)
2. removeOwner(owner)
3. replaceOwner(owner)
4. changeRequiremet(required)
5. submitTransaction(destination, value, data)
6. confirmTransaction(transactionid)
7. revokeConfirmation(transactionId)
8. executeTransaction(transactionId)
9. external_call(destinatoin, value, datalength, data)
10. isConfirmed(transactionId)
11. addTransaction(destination, value, datas)
12. getTransactionCount(pending, executed)
13. getOwners
14. getConfirmation(transactionId)


event:
1. confirmation
2. revocation
3. submission
4. execution
5. executionfailure
6. deposit
7. owneraddtion
8. ownerremoval
9. requirementchange

