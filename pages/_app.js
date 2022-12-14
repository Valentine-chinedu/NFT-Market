import '../styles/globals.css';

import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
	return (
		<div className='bg-black h-screen overflow-scroll'>
			<Header />
			<Component {...pageProps} />
		</div>
	);
}

export default MyApp;
