require('@nomicfoundation/hardhat-chai-matchers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: '0.8.9',
	networks: {
		goerli: {
			url: 'https://eth-goerli.g.alchemy.com/v2/l81H09zhtSClnJY-Ao7PsTevtAoZMQfJ',
			accounts: [
				'f872af8e24689d2b72bf17d97e91a200e703e428bc97aeb5c18fa2f19169d60b',
			],
		},
	},
};
