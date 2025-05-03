import { create } from "zustand"

interface WalletState {
  publicKey: string | null
  secretKey: string | null
  setPublicKey: (key: string) => void
  setSecretKey: (key: string) => void
}

export const useWalletStore = create<WalletState>((set) => ({
  publicKey: null,
  secretKey: null,
  setPublicKey: (key) => set({ publicKey: key }),
  setSecretKey: (key) => set({ secretKey: key }),
}))
// Note: Storing the secretKey in the store is for demonstration purposes only.
// In a production environment, secret keys should be managed securely, e.g., encrypted storage or external wallet integration.