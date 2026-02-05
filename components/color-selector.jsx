"use client"

import { useState } from "react"
import { Check } from "lucide-react"

export function ColorSelector({ colors = [], onSelect }) {
  const [selected, setSelected] = useState(
    colors.find(c => c.available)?.name || null
  )

  const handleSelect = (name, available) => {
    if (!available) return
    setSelected(name)
    onSelect?.(name)
  }

  if (colors.length === 0) return null

  return (
    <div>
      <p className="text-sm tracking-widest uppercase mb-3">
        Color: <span className="normal-case font-normal">{selected}</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => handleSelect(color.name, color.available)}
            disabled={!color.available}
            title={color.name}
            className={`relative w-10 h-10 rounded-full border-2 transition-all ${
              selected === color.name
                ? "border-foreground"
                : color.available
                ? "border-transparent hover:border-muted-foreground"
                : "opacity-40 cursor-not-allowed"
            }`}
            style={{ backgroundColor: color.hex }}
          >
            {selected === color.name && (
              <Check 
                className="absolute inset-0 m-auto w-4 h-4" 
                style={{ 
                  color: isLightColor(color.hex) ? '#000' : '#fff' 
                }} 
              />
            )}
            {!color.available && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-full h-0.5 bg-muted-foreground rotate-45 absolute" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function isLightColor(hex) {
  if (!hex || hex.length < 7) return true
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}
