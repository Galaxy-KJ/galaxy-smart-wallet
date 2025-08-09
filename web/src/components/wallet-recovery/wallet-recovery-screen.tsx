"use client"

import { useState } from "react"
import { X, AlertTriangle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWalletRecovery } from "@/hooks/use-wallet-recovery"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { StarBackground } from "@/components/effects/star-background"

interface WalletRecoveryScreenProps {
  onClose?: () => void
  onRecoverySuccess?: () => void
}

export function WalletRecoveryScreen({ onClose, onRecoverySuccess }: WalletRecoveryScreenProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
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
    recoverWallet,
    isRecovering,
    error,
  } = useWalletRecovery(() => {
    onRecoverySuccess?.()
    router.push("/dashboard")
  })

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault()
    try {
      const text = await navigator.clipboard.readText()
      pasteRecoveryPhrase(text)
    } catch (err) {
      console.error("Failed to paste:", err)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <StarBackground />
      <div className="relative w-full max-w-2xl bg-gray-900/70 border border-gray-700/50 backdrop-blur-xl p-8 shadow-2xl rounded-xl text-white z-10">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-800/90 border border-slate-700 rounded-md p-1 text-slate-300 hover:bg-slate-700 hover:text-white transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="text-center mb-6">
          <Image
            src="/images/galaxy-smart-wallet-logo.png"
            alt="Galaxy Logo"
            className="mx-auto mb-4"
            width={32}
            height={32}
          />
          <h1 className="text-2xl font-bold mb-2">Recover Your Wallet</h1>
          <p className="text-slate-400 text-sm">
            Enter your 12-word recovery phrase to restore your wallet
          </p>
        </div>

        {/* Important Warning */}
        <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-amber-400 font-semibold text-sm mb-1">Important</h3>
              <p className="text-amber-200/80 text-sm">
                These 12 words must match your original recovery phrase exactly. If they are
                incorrect, the wallet cannot be restored.
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Recovery Phrase Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recovery Phrase</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="text-slate-400 border-slate-600 hover:bg-slate-800"
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {recoveryPhrase.map((word, index) => (
              <div key={index} className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                  {index + 1}.
                </span>
                <Input
                  value={word}
                  onChange={(e) => updateRecoveryWord(index, e.target.value)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  placeholder={`Word ${index + 1}`}
                  className="pl-8 bg-slate-800/50 border-slate-600 text-white placeholder-slate-500"
                />
              </div>
            ))}
          </div>

          <p className="text-slate-500 text-xs">
            Tip: You can paste all 12 words at once into any field
          </p>
        </div>

        {/* Password Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Set New Password</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="pr-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="pr-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-slate-300">Password requirements:</p>
            <div className="space-y-1">
              <div className={`flex items-center gap-2 text-xs ${passwordValidation.minLength ? 'text-green-400' : 'text-slate-500'}`}>
                <div className={`w-2 h-2 rounded-full ${passwordValidation.minLength ? 'bg-green-400' : 'bg-slate-600'}`} />
                At least 8 characters
              </div>
              <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasNumber ? 'text-green-400' : 'text-slate-500'}`}>
                <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? 'bg-green-400' : 'bg-slate-600'}`} />
                At least one number
              </div>
              <div className={`flex items-center gap-2 text-xs ${passwordValidation.match ? 'text-green-400' : 'text-slate-500'}`}>
                <div className={`w-2 h-2 rounded-full ${passwordValidation.match ? 'bg-green-400' : 'bg-slate-600'}`} />
                Passwords match
              </div>
            </div>
          </div>
        </div>

        {/* Recover Button */}
        <Button
          onClick={recoverWallet}
          disabled={isRecovering || !isRecoveryPhraseValid || !isPasswordValid}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
        >
          {isRecovering ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Recovering Wallet...
            </div>
          ) : (
            "Recover Wallet"
          )}
        </Button>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-xs">
            Need help? Make sure you&apos;re entering the exact 12 words in the correct order.
          </p>
        </div>
      </div>
    </div>
  )
}