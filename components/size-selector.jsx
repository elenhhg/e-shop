"use client"

import { useState } from "react"

export function SizeSelector({ sizes = [], onSelect }) {
  const [selected, setSelected] = useState(
    sizes.find(s => s.available)?.size || null
  )

  const handleSelect = (size, available) => {
    if (!available) return
    setSelected(size)
    onSelect?.(size)
  }

  if (sizes.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm tracking-widest uppercase">Size</p>
        <button className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((sizeOption) => (
          <button
            key={sizeOption.size}
            onClick={() => handleSelect(sizeOption.size, sizeOption.available)}
            disabled={!sizeOption.available}
            className={`min-w-[3rem] px-4 py-3 text-sm border transition-all duration-300 ${
              selected === sizeOption.size
                ? "border-foreground bg-foreground text-background"
                : sizeOption.available
                ? "border-muted hover:border-foreground"
                : "border-muted text-muted-foreground/40 cursor-not-allowed line-through"
            }`}
          >
            {sizeOption.size}
          </button>
        ))}
      </div>
    </div>
  )
}
