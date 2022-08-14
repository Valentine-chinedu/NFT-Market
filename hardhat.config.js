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
			url: process.env.ALCHEMY_URL,
			accounts: [process.env.ACCOUNT_KEY],
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
