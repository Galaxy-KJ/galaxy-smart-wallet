"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { StarBackground } from "@/components/effects/star-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Shield, Zap, RefreshCw, Globe } from "lucide-react"
import { StellarBlockchainIllustration } from "@/components/stellar-blockchain-illustration"
import { useMobile } from "@/hooks/use-mobile"

export function WelcomeScreen() {
  const router = useRouter()
  const isMobile = useMobile()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateWallet = () => {
    setIsCreating(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  const benefits = [
    {
      icon: <Shield className="h-6 w-6 text-blue-400" />, 
      title: "Advanced Security",
      description: "Multi-signature and dynamic authentication to protect your assets",
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-400" />, 
      title: "Financial AI",
      description: "Smart automation of your finances with personalized recommendations",
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-purple-400" />, 
      title: "Fast Exchanges",
      description: "Instant transactions without intermediaries on the Stellar network",
    },
    {
      icon: <Globe className="h-6 w-6 text-green-400" />, 
      title: "Global Access",
      description: "Connect with all available assets in the Stellar ecosystem",
    },
  ]

  return (
    <div className="relative w-full min-h-screen bg-[#0D0D22] text-white overflow-hidden">
      <StarBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          className="w-full max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center animate-pulse-subtle">
                <span className="text-white font-bold text-xl">GW</span>
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Galaxy Wallet
              </h1>
            </div>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Explore the future of finance with Galaxy Wallet
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="my-8 h-48 md:h-64 relative">
            <StellarBlockchainIllustration />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12">
            <Card className="bg-[#12132A]/70 border-[#1F2037] backdrop-blur-sm max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">
                  Your Smart Wallet on Stellar in seconds
                </h2>
                <p className="text-gray-300 mb-6">
                  Create a smart wallet with advanced security and access to the entire Stellar ecosystem
                </p>
                <Button
                  onClick={handleCreateWallet}
                  disabled={isCreating}
                  className="w-full h-14 bg-gradient-to-r from-[#3B82F6] to-[#9333EA] hover:from-[#4F46E5] hover:to-[#7C3AED] shadow-lg hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all duration-300 text-lg"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                      <span>Creating wallet...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Create My Smart Wallet</span>
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-medium mb-6 text-center">Benefits of Galaxy Wallet</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="bg-[#12132A]/50 border-[#1F2037] hover:bg-[#12132A]/70 transition-all duration-300 hover:shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1F2037] flex items-center justify-center flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">{benefit.title}</h4>
                        <p className="text-gray-400 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 text-gray-400 text-sm">
            <p>© 2025 Galaxy Wallet. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
