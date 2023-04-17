// _app.tsx
import '@/styles/globals.css';
import { UserProvider } from '../context/UserContext';
import type { AppProps } from 'next/app';
import Layout from '../../components/Layout';
import '/public/styles.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}

export default MyApp;
