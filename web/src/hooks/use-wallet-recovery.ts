import { useState } from "react"
import * as bip39 from "bip39"
import { Keypair } from "@stellar/stellar-sdk"
import { encryptPrivateKey, saveEncryptedWallet } from "@/lib/crypto"
import { useWalletStore } from "@/store/wallet-store"

export function useWalletRecovery(onRecoverySuccess: () => void) {
  const [recoveryPhrase, setRecoveryPhrase] = useState<string[]>(Array(12).fill(""))
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isRecovering, setIsRecovering] = useState(false)
  const [error, setError] = useState("")

  const setPublicKey = useWalletStore((state) => state.setPublicKey)

  const updateRecoveryWord = (index: number, word: string) => {
    const newPhrase = [...recoveryPhrase]
    newPhrase[index] = word.toLowerCase().trim()
    setRecoveryPhrase(newPhrase)
    setError("")
  }

  const pasteRecoveryPhrase = (text: string) => {
    const words = text.trim().split(/\s+/).slice(0, 12)
    const newPhrase = Array(12).fill("")
    words.forEach((word, index) => {
      if (index < 12) {
        newPhrase[index] = word.toLowerCase().trim()
      }
    })
    setRecoveryPhrase(newPhrase)
    setError("")
  }

  const clearAll = () => {
    setRecoveryPhrase(Array(12).fill(""))
    setError("")
  }

  const passwordValidation = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    match: password === confirmPassword && password.length > 0,
  }

  const isPasswordValid = Object.values(passwordValidation).every(Boolean)
  const isRecoveryPhraseValid = recoveryPhrase.every(word => word.length > 0)

  const validateMnemonic = () => {
    const mnemonic = recoveryPhrase.join(" ")
    return bip39.validateMnemonic(mnemonic)
  }

  const recoverWallet = async () => {
    if (!isRecoveryPhraseValid) {
      setError("Please fill in all 12 words of your recovery phrase")
      return
    }

    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements")
      return
    }

    const mnemonic = recoveryPhrase.join(" ")
    
    if (!validateMnemonic()) {
      setError("Invalid recovery phrase. Please check that all 12 words are correct and match the BIP39 wordlist.")
      return
    }

    setIsRecovering(true)
    setError("")

    try {
      // Derive the private key from the mnemonic using Stellar's standard derivation
      const seed = await bip39.mnemonicToSeed(mnemonic)
      const raw = seed.slice(0, 32)
      const keypair = Keypair.fromRawEd25519Seed(raw)
      const publicKey = keypair.publicKey()

      // Encrypt the private key with the new password
      const encrypted = await encryptPrivateKey(keypair.secret(), password)
      
      // Store the encrypted private key in IndexedDB
      await saveEncryptedWallet(encrypted)

      // Set the public key in the wallet store
      setPublicKey(publicKey)

      // Success - call the callback to redirect to dashboard
      onRecoverySuccess()
    } catch (err) {
      console.error("Wallet recovery error:", err)
      setError("Failed to recover wallet. Please check your recovery phrase and try again.")
    } finally {
      setIsRecovering(false)
    }
  }

  return {
    recoveryPhrase,
    updateRecoveryWord,
    pasteRecoveryPhrase,
    clearAll,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordValidation,
    isPasswordValid,
    isRecoveryPhraseValid,
    validateMnemonic,
    recoverWallet,
    isRecovering,
    error,
    setError
  }
}