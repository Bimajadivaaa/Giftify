import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { Chain } from '@rainbow-me/rainbowkit';
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { sepolia } from 'viem/chains';

// const mainnet = {
//   id: 1,
//   name: "Ethereum",
//   nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
//   rpcUrls: {
//     default: {
//       http: [
//         "https://virtual.mainnet.rpc.tenderly.co/3f59caed-35bb-496d-9b3d-40f299ec6f16",
//       ],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: "Etherscan",
//       url: "https://etherscan.io",
//       apiUrl: "https://api.etherscan.io/api",
//     },
//   },
//   contracts: {
//     ensRegistry: {
//       address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
//     },
//     ensUniversalResolver: {
//       address: "0xce01f8eee7E479C928F8919abD53E553a36CeF67",
//       blockCreated: 19_258_213,
//     },
//     multicall3: {
//       address: "0xca11bde05977b3631167028862be2a173976ca11",
//       blockCreated: 14_353_601,
//     },
//   },
// } as const satisfies Chain;

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [sepolia],
  ssr: true,
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
