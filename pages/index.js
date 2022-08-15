import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';

import { marketplaceAddress } from '../config';

import NftMarket from '../artifacts/contracts/NftMarket.sol/NftMarket.json';

export default function Home() {
	const [nfts, setNfts] = useState([]);
	const [loadingState, setLoadingState] = useState('not-loaded');
	const [isLoading, setISLoading] = useState(false);
	useEffect(() => {
		loadNFTs();
	}, []);
	async function loadNFTs() {
		/* create a generic provider and query for unsold market items */
		const provider = new ethers.providers.JsonRpcProvider(
			'https://eth-goerli.g.alchemy.com/v2/O_IzHiXU8kgW1DQn6FWJN2qFXcSPyMvr'
		);
		const contract = new ethers.Contract(
			marketplaceAddress,
			NftMarket.abi,
			provider
		);
		const data = await contract.fetchMarketItems();

		/*
		 *  map over items returned from smart contract and format
		 *  them as well as fetch their token metadata
		 */
		const items = await Promise.all(
			data.map(async (i) => {
				const tokenUri = await contract.tokenURI(i.tokenId);
				const meta = await axios.get(tokenUri);
				let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
				let item = {
					price,
					tokenId: i.tokenId.toNumber(),
					seller: i.seller,
					owner: i.owner,
					image: meta.data.image,
					name: meta.data.name,
					description: meta.data.description,
				};
				return item;
			})
		);
		setNfts(items);
		setLoadingState('loaded');
	}
	async function buyNft(nft) {
		/* needs the user to sign the transaction, so will use Web3Provider and sign it */
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(
			marketplaceAddress,
			NftMarket.abi,
			signer
		);

		/* user will be prompted to pay the asking proces to complete the transaction */
		const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
		const transaction = await contract.createMarketSale(nft.tokenId, {
			value: price,
		});
		setISLoading(true);
		await transaction.wait();
		loadNFTs();
		setISLoading(false);
	}
	if (loadingState === 'loaded' && !nfts.length)
		return <h1 className='px-20 py-10 text-3xl'>No items in marketplace</h1>;
	return (
		<div className='flex flex-col justify-center items-center h-full '>
			{isLoading && (
				<svg
					className='animate-spin'
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					width='32'
					height='32'
				>
					<path fill='none' d='M0 0h24v24H0z' />
					<path
						d='M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z'
						fill='#f1edf1'
					/>
				</svg>
			)}

			<div className='px-4' style={{ maxWidth: '1600px' }}>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
					{nfts.map((nft, i) => (
						<div
							key={i}
							className='border shadow-pink-200 rounded-xl overflow-hidden shadow-md'
						>
							<img src={nft.image} />
							<div className='bg-gradient-to-br from-black to-pink-900'>
								<div className='p-4'>
									<p
										style={{ height: '64px' }}
										className='text-2xl font-semibold text-pink-500 uppercase'
									>
										{nft.name}
									</p>
									<div style={{ height: '70px', overflow: 'hidden' }}>
										<p className=' text-gray-100 text-lg'>{nft.description}</p>
									</div>
								</div>
								<div className='p-4'>
									<p className='text-2xl font-bold text-white'>
										{nft.price} ETH
									</p>
									<button
										className='mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded'
										onClick={() => buyNft(nft)}
									>
										Buy
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
