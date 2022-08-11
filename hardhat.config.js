/* hardhat.config.js */
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {
			chainId: 1337,
		},

		goerli: {
			url: 'https://eth-goerli.g.alchemy.com/v2/O_IzHiXU8kgW1DQn6FWJN2qFXcSPyMvr',
			accounts: [process.env.ALCHEMY_URL],
		},
	},
	solidity: {
		version: '0.8.9',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
};
