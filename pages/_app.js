import '../styles/globals.css';
import Link from 'next/link';
import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
	return (
		<div>
			<Header />
			<Component {...pageProps} />
		</div>
	);
}

export default MyApp;
