import { useEffect, useState } from "react";
import { PrivyProvider, usePrivy, useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";

const MONAD_CHAIN = {
  chainId: "0x279f",
  chainName: "Monad Testnet",
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  blockExplorerUrls: ["https://testnet.monadexplorer.com"],
};

function WalletBalance() {
  const { login, logout, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [balance, setBalance] = useState(null);

  const fetchBalance = async () => {
    if (!wallets || wallets.length === 0) return;
    const wallet = wallets[0];
    await wallet.switchChain(MONAD_CHAIN);
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const rawBalance = await provider.getBalance(address);
    const formatted = ethers.utils.formatEther(rawBalance);
    setBalance(formatted);
  };

  useEffect(() => {
    if (authenticated) fetchBalance();
  }, [authenticated, wallets]);

  if (!authenticated) {
    return (
      <div className="text-center mt-20">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={login}>
          Conectar Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="text-center mt-20">
      <p>Wallet conectada: {user?.wallet?.address}</p>
      <p>Saldo: {balance ? `${balance} MON` : "Carregando..."}</p>
      <button className="bg-red-500 text-white px-4 py-2 mt-4 rounded" onClick={logout}>
        Desconectar
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <PrivyProvider
      appId="cmawsprsj04etld0ml7e41ycf"
      config={{
        appearance: { theme: "light" },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <WalletBalance />
    </PrivyProvider>
  );
}
