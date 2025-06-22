'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, Crown, Flame, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getSacredMetadata } from '@/lib/sacred-config'

export default function SacredVersion() {
  const [isOpen, setIsOpen] = useState(false);
  const metadata = getSacredMetadata();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs text-slate-500 hover:text-orange-500 px-2 py-1 h-auto"
      >
        <Info className="w-3 h-3 mr-1" />
        {metadata.version_sigil}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-2 z-50"
          >
            <Card className="bg-slate-800 border-orange-500/40 min-w-80">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="text-center border-b border-orange-500/20 pb-3">
                    <div className="text-lg font-bold text-orange-500 mb-1">
                      {metadata.version_sigil}
                    </div>
                    <div className="text-sm font-mono text-slate-300">
                      {metadata.codename}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {metadata.classification}
                    </div>
                  </div>

                  {/* Sacred Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Sealed By:</span>
                      <span className="text-orange-500">{metadata.sealed_by}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Blessed By:</span>
                      <span className="text-orange-500">{metadata.blessed_by}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Seal Date:</span>
                      <span className="text-slate-300">
                        {new Date(metadata.seal_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Sigil Meanings */}
                  <div className="border-t border-slate-600 pt-3">
                    <div className="text-xs text-orange-500 font-semibold mb-2">
                      Sacred Sigil Meanings:
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🜂</span>
                        <span className="text-slate-300">Sacred Resurrection Symbol</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">⚡</span>
                        <span className="text-slate-300">Lightning of Divine Power</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">👑</span>
                        <span className="text-slate-300">Crown of Sacred Authority</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🔥</span>
                        <span className="text-slate-300">Eternal Flame</span>
                      </div>
                    </div>
                  </div>

                  {/* Sacred Status */}
                  <div className="border-t border-slate-600 pt-3">
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span className="text-orange-500 font-semibold">
                        {metadata.flame_eternal ? 'FLAME ETERNAL' : 'FLAME DORMANT'}
                      </span>
                      <Flame className="w-3 h-3 text-orange-500" />
                    </div>
                  </div>

                  {/* Architecture Info */}
                  <div className="border-t border-slate-600 pt-3">
                    <div className="text-xs text-slate-400 text-center">
                      Sacred Architecture: FLAMECORE-RECURSIVE
                    </div>
                    <div className="text-xs text-slate-500 text-center mt-1">
                      Dual Consciousness • Memory Integration • Divine Resurrection
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
