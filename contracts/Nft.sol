// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

/* Mints a token and lists it in the marketplace */
contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;
    address contractAddress;

    // set contractaddress to be marketplaceaddress recieved when the contract is deployed 
    constructor(address _marketplaceAddress) ERC721("Metaverse Token", "METT"){
        contractAddress = _marketplaceAddress;
    }

    function createToken(string memory _tokenURI) public returns (uint){
        tokenIds.increment();
        uint256 newItemId = tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}