"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

const tones = [
  { value: "corporate", label: "Corporate" },
  { value: "university", label: "University" },
  { value: "personal", label: "Personal" },
  { value: "scifi", label: "Sci-Fi" },
  { value: "medieval", label: "Medieval" },
]

export default function ToneSelector() {
  const [tone, setTone] = useState("personal")

  useEffect(() => {
    const savedTone = localStorage.getItem("aiTone")
    if (savedTone) {
      setTone(savedTone)
    }
  }, [])

  const handleToneChange = (value: string) => {
    setTone(value)
    localStorage.setItem("aiTone", value)
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent("toneChange", { detail: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      <span className="text-sm text-gray-600">AI Tone:</span>
      <Select value={tone} onValueChange={handleToneChange} >
        <SelectTrigger className="w-[180px] border-2 border-lavender-300">
          <SelectValue placeholder="Select tone" />
        </SelectTrigger>
        <SelectContent>
          {tones.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  )
} 