/* applies global css to all rendered pages */
import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import Layout from '../../components/Layout'
import '/public/styles.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
