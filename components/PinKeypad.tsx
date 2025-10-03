"use client"

import { useState } from 'react'

interface PinKeypadProps {
  onPinEnter: (pin: string) => void
  onClear: () => void
  onBackspace: () => void
  pin: string
  maxLength?: number
}

export function PinKeypad({ onPinEnter, onClear, onBackspace, pin, maxLength = 6 }: PinKeypadProps) {
  const [isPressed, setIsPressed] = useState<string | null>(null)

  const handleKeyPress = (key: string) => {
    if (pin.length < maxLength) {
      onPinEnter(pin + key)
    }
  }

  const handleKeyDown = (key: string) => {
    setIsPressed(key)
  }

  const handleKeyUp = () => {
    setIsPressed(null)
  }

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['C', '0', '⌫']
  ]

  return (
    <div className="w-full max-w-xs mx-auto">
      {/* Affichage du PIN */}
      <div className="mb-6 flex justify-center space-x-2">
        {Array.from({ length: maxLength }, (_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 ${
              i < pin.length
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Clavier numérique */}
      <div className="grid grid-cols-3 gap-3">
        {keys.map((row, rowIndex) =>
          row.map((key, keyIndex) => {
            const isSpecialKey = key === 'C' || key === '⌫'
            const isPressedKey = isPressed === key

            return (
              <button
                key={`${rowIndex}-${keyIndex}`}
                onClick={() => {
                  if (key === 'C') {
                    onClear()
                  } else if (key === '⌫') {
                    onBackspace()
                  } else {
                    handleKeyPress(key)
                  }
                }}
                onMouseDown={() => handleKeyDown(key)}
                onMouseUp={handleKeyUp}
                onMouseLeave={handleKeyUp}
                className={`
                  h-16 text-xl font-semibold rounded-lg transition-all duration-150
                  ${isSpecialKey
                    ? 'bg-gray-600 hover:bg-gray-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }
                  ${isPressedKey ? 'scale-95 bg-gray-500' : 'hover:scale-105'}
                  ${key === '0' ? 'col-span-1' : ''}
                `}
              >
                {key}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
