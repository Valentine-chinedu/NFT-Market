import { useState } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';

import { marketplaceAddress } from '../config';

import NftMarket from '../artifacts/contracts/NftMarket.sol/NftMarket.json';

const projectId = '2DLj3t300gVftVkBzFe7HnmqA9y';
const projectSecret = '43c34e12e88e40c02b2c74d2bc6b45a4';

const auth =
	'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https',
	headers: {
		authorization: auth,
	},
});

export default function CreateItem() {
	const [fileUrl, setFileUrl] = useState(null);
	const [formInput, updateFormInput] = useState({
		price: '',
		name: '',
		description: '',
	});
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	async function onChange(e) {
		const file = e.target.files[0];
		try {
			const { path } = await client.add(file, {
				progress: (prog) => console.log(`received: ${prog}`),
			});
			const url = `https://nft-pro.infura-ipfs.io/ipfs/${path}`;
			setFileUrl(url);
			console.log(url);
		} catch (error) {
			console.log('Error uploading file: ', error);
		}
	}
	async function uploadToIPFS() {
		const { name, description, price } = formInput;
		if (!name || !description || !price || !fileUrl) return;
		/* first, upload to IPFS */
		const data = JSON.stringify({
			name,
			description,
			image: fileUrl,
		});
		try {
			const { path } = await client.add(data);
			const url = `https://nft-pro.infura-ipfs.io/ipfs/${path}`;
			/* after file is uploaded to IPFS, return the URL to use it in the transaction */
			return url;
		} catch (error) {
			console.log('Error uploading file: ', error);
		}
	}

	async function listNFTForSale() {
		const url = await uploadToIPFS();
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		/* next, create the item */
		const price = ethers.utils.parseUnits(formInput.price, 'ether');
		let contract = new ethers.Contract(
			marketplaceAddress,
			NftMarket.abi,
			signer
		);
		let listingPrice = await contract.getListingPrice();
		listingPrice = listingPrice.toString();
		let transaction = await contract.createToken(url, price, {
			value: listingPrice,
		});
		setIsLoading(true);
		await transaction.wait();
		setIsLoading(false);

		router.push('/');
	}

	return (
		<div className='flex justify-center h-full items-center '>
			<div className='w-2/5 flex flex-col justify-center p-12 pb-12 bg-pink-900'>
				<input
					placeholder='Asset Name'
					className='mt-8 border rounded p-4 bg-gray-200'
					onChange={(e) =>
						updateFormInput({ ...formInput, name: e.target.value })
					}
				/>
				<textarea
					placeholder='Asset Description'
					className='mt-2 border rounded p-4 bg-gray-200'
					onChange={(e) =>
						updateFormInput({ ...formInput, description: e.target.value })
					}
				/>
				<input
					placeholder='Asset Price in Eth'
					className='mt-2 border rounded p-4 bg-gray-200'
					onChange={(e) =>
						updateFormInput({ ...formInput, price: e.target.value })
					}
				/>
				<input type='file' name='Asset' className='my-4' onChange={onChange} />
				{fileUrl && <img className='rounded mt-4' width='350' src={fileUrl} />}
				{isLoading ? (
					<div className='w-full flex justify-center'>
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
					</div>
				) : (
					<button
						onClick={listNFTForSale}
						className='font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg'
					>
						Create
					</button>
				)}
			</div>
		</div>
	);
}
