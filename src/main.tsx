import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  cronosTestnet,
} from 'wagmi/chains';

import { publicProvider } from 'wagmi/providers/public';



const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora, cronosTestnet],
  [
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: '96a3327b236c37e865200ce298c4aeb5',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
    <App />
  </RainbowKitProvider>
    </WagmiConfig>,
  </React.StrictMode>
)
