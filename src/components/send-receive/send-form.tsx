"use client"

import { useState, useEffect } from "react"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Clipboard, QrCode, Info, AlertCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useWalletStore } from "@/lib/stores/wallet-store"
import * as StellarSdk from "@stellar/stellar-sdk"
import { STELLAR_CONFIG } from "@/lib/stellar/config"

export function SendForm() {
  const { toast } = useToast()
  const { publicKey, secretKey } = useWalletStore()
  const [address, setAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [memo, setMemo] = useState("")
  const [selectedToken, setSelectedToken] = useState("XLM")
  const [percentageSelected, setPercentageSelected] = useState<number | null>(null)
  const [networkFee, setNetworkFee] = useState(0.00001)
  const [isLoading, setIsLoading] = useState(false)

  const tokens = [
    { symbol: "XLM", name: "Stellar Lumens", balance: 1250.75 },
    { symbol: "USDC", name: "USD Coin", balance: 350.0 },
    { symbol: "BTC", name: "Bitcoin", balance: 0.0045 },
    { symbol: "ETH", name: "Ethereum", balance: 0.12 },
  ]

  const selectedTokenData = tokens.find((t) => t.symbol === selectedToken) || tokens[0]

  // Fetch recommended network fee on component mount
  useEffect(() => {
    const fetchFee = async () => {
      try {
        const server = new StellarSdk.Horizon.Server(STELLAR_CONFIG.horizonURL)
        const feeStats = await server.feeStats()
        const recommendedFee = feeStats.fee_charged.p90 // in stroops
        const feeInXLM = recommendedFee / 10000000
        setNetworkFee(feeInXLM)
      } catch (error) {
        console.error("Error fetching fee stats:", error)
      }
    }
    fetchFee()
  }, [])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setAddress(text)
      toast({
        title: "Address pasted",
        description: "Stellar address has been pasted from clipboard",
      })
    } catch {
      toast({
        title: "Could not access clipboard",
        description: "Please paste the address manually",
        variant: "destructive",
      })
    }
  }

  const handleScanQR = () => {
    toast({
      title: "QR Scanner",
      description: "QR scanner would open here",
    })
  }

  const handlePercentageSelect = (percentage: number) => {
    setPercentageSelected(percentage)
    const calculatedAmount = ((selectedTokenData.balance * percentage) / 100).toFixed(
      selectedToken === "XLM" || selectedToken === "USDC" ? 2 : 6,
    )
    setAmount(calculatedAmount)
  }

  const handleSend = async () => {
    if (!publicKey || !secretKey) {
      toast({ title: "Wallet not connected", description: "Please connect your wallet", variant: "destructive" })
      return
    }
    if (!StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
      toast({ title: "Invalid address", description: "Please enter a valid Stellar address", variant: "destructive" })
      return
    }
    if (selectedToken !== "XLM") {
      toast({ title: "Unsupported asset", description: "Only XLM is supported for sending at the moment", variant: "destructive" })
      return
    }
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({ title: "Invalid amount", description: "Amount must be a positive number", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const server = new StellarSdk.Horizon.Server(STELLAR_CONFIG.horizonURL)
      const sourceAccount = await server.loadAccount(publicKey)
      const baseReserve = 0.5 // XLM
      const minBalance = (2 + sourceAccount.subentry_count) * baseReserve
      const nativeBalance = sourceAccount.balances.find(b => b.asset_type === "native").balance
      const spendableBalance = parseFloat(nativeBalance) - minBalance

      const feeStats = await server.feeStats()
      const recommendedFee = feeStats.fee_charged.p90 // in stroops
      const feeInXLM = recommendedFee / 10000000

      if (amountNum + feeInXLM > spendableBalance) {
        toast({ title: "Insufficient balance", description: "Not enough XLM to cover the amount and fee", variant: "destructive" })
        return
      }

      const paymentOp = StellarSdk.Operation.payment({
        destination: address,
        asset: StellarSdk.Asset.native(),
        amount: amount,
      })

      const builder = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: recommendedFee.toString(),
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      })

      if (memo) {
        builder.addMemo(StellarSdk.Memo.text(memo))
      }

      const tx = builder
        .addOperation(paymentOp)
        .setTimeout(30)
        .build()

      const keypair = StellarSdk.Keypair.fromSecret(secretKey)
      tx.sign(keypair)

      const result = await server.submitTransaction(tx)
      console.log("Transaction successful:", result)
      toast({ title: "Transaction successful", description: `Sent ${amount} XLM to ${address}` })
    } catch (error: any) {
      console.error("Transaction failed:", error)
      toast({ title: "Transaction failed", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const isValidForm = address.length > 0 && amount.length > 0 && Number(amount) > 0

  return (
    <CardContent className="p-6">
      <div className="space-y-6">
        {/* Recipient Address */}
        <div className="space-y-2">
          <Label htmlFor="recipient" className="text-gray-300 text-sm">
            Recipient Address
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="recipient"
                placeholder="G..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-[#0A0B1E]/50 border-[#1F2037] focus:border-[#7C3AED] text-white pr-10"
              />
              {address && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setAddress("")}
                >
                  ×
                </button>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handlePaste}
              className="bg-[#0A0B1E]/50 border-[#1F2037] hover:bg-[#1F2037] hover:border-[#2F3057]"
            >
              <Clipboard className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleScanQR}
              className="bg-[#0A0B1E]/50 border-[#1F2037] hover:bg-[#1F2037] hover:border-[#2F3057]"
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Token Selection */}
        <div className="space-y-2">
          <Label htmlFor="token" className="text-gray-300 text-sm">
            Select Asset
          </Label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger id="token" className="bg-[#0A0B1E]/50 border-[#1F2037] focus:border-[#7C3AED] text-white">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-[#12132A] border-[#1F2037] text-white">
              {tokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol} className="focus:bg-[#1F2037]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED]">
                      {token.symbol.substring(0, 2)}
                    </div>
                    <span>
                      {token.symbol}{" "}
                      <span className="text-gray-400 text-xs">
                        Balance: {token.balance.toFixed(token.balance < 1 ? 4 : 2)}
                      </span>
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="amount" className="text-gray-300 text-sm">
              Amount
            </Label>
            <span className="text-sm text-gray-400">
              Available: {selectedTokenData.balance.toFixed(selectedTokenData.balance < 1 ? 4 : 2)} {selectedToken}
            </span>
          </div>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.0000001"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setPercentageSelected(null)
              }}
              className="bg-[#0A0B1E]/50 border-[#1F2037] focus:border-[#7C3AED] text-white pr-16"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{selectedToken}</div>
          </div>

          <div className="flex gap-2">
            {[25, 50, 75, 100].map((percentage) => (
              <Button
                key={percentage}
                variant="outline"
                size="sm"
                className={`flex-1 text-sm ${
                  percentageSelected === percentage
                    ? "bg-[#7C3AED]/20 border-[#7C3AED] text-white"
                    : "bg-[#0A0B1E]/50 border-[#1F2037] text-gray-400 hover:bg-[#1F2037]"
                }`}
                onClick={() => handlePercentageSelect(percentage)}
              >
                {percentage}%
              </Button>
            ))}
          </div>
        </div>

        {/* Memo */}
        <div className="space-y-2">
          <Label htmlFor="memo" className="text-gray-300 text-sm">
            Memo (optional)
          </Label>
          <Input
            id="memo"
            placeholder="Enter memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="bg-[#0A0B1E]/50 border-[#1F2037] focus:border-[#7C3AED] text-white"
          />
        </div>

        {/* Network Fee & Processing Time */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center text-gray-400">
            <div className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span>Network Fee</span>
            </div>
            <span>{networkFee.toFixed(7)} XLM</span>
          </div>

          <div className="flex justify-between items-center text-gray-400">
            <div className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span>Processing Time</span>
            </div>
            <span>~5 seconds</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-[#1F2037]">
            <span className="text-gray-300">Total Amount</span>
            <div className="text-white">
              {amount ? (Number(amount) + (selectedToken === "XLM" ? networkFee : 0)).toFixed(7) : "0.00"} {selectedToken}
            </div>
          </div>
        </div>

        {/* Send Button */}
        <Button
          className={`w-full h-11 text-sm font-medium ${
            isValidForm && !isLoading ? "bg-[#7C3AED] hover:bg-[#6D31D9] text-white" : "bg-[#1F2037] text-gray-400 cursor-not-allowed"
          }`}
          disabled={!isValidForm || isLoading}
          onClick={handleSend}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </div>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send {selectedToken}
            </>
          )}
        </Button>

        {/* Warning */}
        <div className="flex items-start gap-2 text-xs text-yellow-500/90 bg-yellow-500/5 rounded-md p-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            Always double-check the recipient address before sending. Transactions on the Stellar network are
            irreversible.
          </p>
        </div>
      </div>
    </CardContent>
  )
}