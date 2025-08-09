"use client"

import { WalletRecoveryScreen } from "@/components/wallet-recovery/wallet-recovery-screen"
import { useRouter } from "next/navigation"

export default function RecoverPage() {
  const router = useRouter()

  return (
    <WalletRecoveryScreen 
      onClose={() => router.push("/")}
      onRecoverySuccess={() => router.push("/dashboard")}
    />
  )
}