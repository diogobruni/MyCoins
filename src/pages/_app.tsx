import type { AppProps } from 'next/app'
import '../styles/globals.css'

import { PortfolioProvider } from '../providers/portfolio'
import { TokenListProvider } from '../providers/token-list'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <PortfolioProvider>
        <TokenListProvider>
          <Component {...pageProps} />
        </TokenListProvider>
      </PortfolioProvider>
    </>
  )
}

export default MyApp
