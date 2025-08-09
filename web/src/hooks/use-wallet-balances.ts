import { useEffect, useState } from "react";
import * as StellarSDK from "@stellar/stellar-sdk";
import { useWalletStore } from "@/store/wallet-store";
import { STELLAR_CONFIG } from "@/lib/stellar/config";

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  value?: number;
  change?: number;
  icon?: string;
  assetCode?: string;
  assetIssuer?: string;
}

export function useWalletBalances() {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const publicKey = useWalletStore((state) => state.publicKey);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!publicKey) {
        setBalances([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const server = new StellarSDK.Horizon.Server(STELLAR_CONFIG.horizonURL);
        const account = await server.accounts().accountId(publicKey).call();
        
        const tokenBalances: TokenBalance[] = [];

        // Procesar todos los balances
        account.balances.forEach((balance) => {
          if (balance.asset_type === "native") {
            // XLM (Stellar Lumens)
            tokenBalances.push({
              symbol: "XLM",
              name: "Stellar Lumens",
              balance: parseFloat(balance.balance),
              value: parseFloat(balance.balance) * 0.39, // Precio aproximado
              change: 1.8,
              icon: "🌟",
            });
          } else if (balance.asset_type === "credit_alphanum4" || balance.asset_type === "credit_alphanum12") {
            // Otros tokens
            const assetCode = balance.asset_code;
            
            // Mapear tokens conocidos
            const tokenInfo = getTokenInfo(assetCode);
            
            tokenBalances.push({
              symbol: assetCode,
              name: tokenInfo.name,
              balance: parseFloat(balance.balance),
              value: parseFloat(balance.balance) * tokenInfo.price,
              change: tokenInfo.change,
              icon: tokenInfo.icon,
              assetCode,
            });
          }
        });

        setBalances(tokenBalances);
      } catch (error) {
        console.error("Error fetching balances:", error);
        setError("Error al obtener balances");
        setBalances([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [publicKey]);

  return { balances, loading, error };
}

// Función auxiliar para obtener información de tokens conocidos
function getTokenInfo(assetCode: string) {
  // Mapeo de tokens conocidos en Stellar testnet/mainnet
  const knownTokens: Record<string, { name: string; price: number; change: number; icon: string }> = {
    USDC: {
      name: "USD Coin",
      price: 1.0,
      change: 0.0,
      icon: "💵",
    },
    BTC: {
      name: "Bitcoin",
      price: 50000, // Precio aproximado
      change: -1.2,
      icon: "₿",
    },
    ETH: {
      name: "Ethereum",
      price: 2600, // Precio aproximado
      change: 3.7,
      icon: "Ξ",
    },
    USDT: {
      name: "Tether USD",
      price: 1.0,
      change: 0.1,
      icon: "💰",
    },
  };

  return knownTokens[assetCode] || {
    name: assetCode,
    price: 1.0,
    change: 0.0,
    icon: "🪙",
  };
}