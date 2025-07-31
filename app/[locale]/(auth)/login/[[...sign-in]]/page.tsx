"use client"
import { SignIn } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

export default function Page() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h2>
          <p className="text-xl text-slate-300 mx-auto leading-relaxed">
            Sign in to access your admin dashboard
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto rounded-full mt-8"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-xl"
        >
          <SignIn
            redirectUrl="/admin"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none w-full',
                headerTitle: 'text-2xl font-bold text-white',
                headerSubtitle: 'text-slate-400',
                socialButtonsBlockButton:
                  'bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 text-white',
                socialButtonsBlockButtonText: 'text-slate-200',
                dividerLine: 'bg-slate-700',
                dividerText: 'text-slate-400',
                formFieldLabel: 'text-slate-300 mb-1',
                formFieldInput:
                  'bg-slate-800/70 border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 text-white',
                formButtonPrimary:
                  'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg',
                footerActionText: 'text-slate-400',
                footerActionLink: 'text-blue-400 hover:text-blue-300',
                formFieldAction: 'text-blue-400 hover:text-blue-300',
                formHeaderTitle: 'text-white',
                formHeaderSubtitle: 'text-slate-400',
              },
              layout: {
                logoPlacement: 'inside',
                logoImageUrl: '/logo.png', // Add your logo path
              },
              variables: {
                colorPrimary: '#3b82f6', // blue-500
                colorText: '#ffffff',
                colorTextSecondary: '#94a3b8', // slate-400
                colorBackground: '#1e293b', // slate-800
                colorInputBackground: '#1e293b', // slate-800
                colorInputText: '#ffffff',
              }
            }}
            fallback={
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              </div>
            }
          />
        </motion.div>

        <motion.div
          className="mt-8 text-center text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>Need help? <a href="mailto:support@example.com" className="text-blue-400 hover:underline">Contact support</a></p>
        </motion.div>
      </div>
    </section>
  )
}