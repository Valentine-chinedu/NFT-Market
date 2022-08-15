import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const Header = () => {
	const router = useRouter();

	return (
		<div className='flex border-b items-center justify-around bg-gradient-to-br h-20 from-rose-900 to-gray-900'>
			<p className='text-3xl font-bold text-gray-100'>NFT Marketplace</p>
			<nav className=''>
				<div className='flex font-semibold space-x-8'>
					<Link href='/'>
						<a
							className={`text-pink-500 hover:text-pink-300 ${
								router.pathname === '/' && 'border-b border-pink-300'
							}`}
						>
							Buy NFTs
						</a>
					</Link>

					<Link href='/MyNfts'>
						<a
							className={`text-pink-500 hover:text-pink-300 ${
								router.pathname === '/MyNfts' && 'border-b border-pink-300'
							}`}
						>
							My NFTs
						</a>
					</Link>
					<Link href='/DashBoard'>
						<a
							className={`text-pink-500 hover:text-pink-300 ${
								router.pathname === '/DashBoard' && 'border-b border-pink-300'
							}`}
						>
							Dashboard
						</a>
					</Link>
				</div>
			</nav>
			<Link href='/CreateNft'>
				<a className=' rounded-3xl px-4 py-1 text-sm font-semibold bg-pink-500 text-gray-100'>
					CREATE NFT
				</a>
			</Link>
		</div>
	);
};

export default Header;
