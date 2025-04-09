"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import excuseLoaderTexts from "@/lib/loaderTexts"
import ToneSelector from "./tone-selector"

export default function TaskInput() {
  const [task, setTask] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!task.trim()) {
      toast({
        title: "Task cannot be empty",
        description: "Please enter a task to procrastinate on.",
        variant: "destructive",
      })
      return
    }
   const id= Date.now();
    setIsLoading(true)
    window.dispatchEvent(
      new CustomEvent("addTask", {
        detail: {
          id,
          text: task,
          createdAt: new Date().toISOString(),
          excuses: [],
          alternatives:[],
          completed:false
        },
      }),
    )
    try {
      // Call our API to generate excuses and alternatives
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: task.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate excuses and alternatives')
      }

      const data = await response.json()
      console.log(data)
      // Dispatch the custom event with the task and AI-generated content
      window.dispatchEvent(
        new CustomEvent("updateTask", {
          detail: {
            id,
            excuses: data.excuses,
            alternatives: data.alternatives,
            level: data.level
          },
        }),
      )

      setTask("")

      toast({
        title: "Task added",
        description: "Now let's find ways to avoid doing it!",
      })
    } catch (error) {
      console.error('Error adding task:', error)
      toast({
        title: "Error",
        description: "Failed to generate excuses and alternatives. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-lavender-200 mb-6">
      <div className="flex items-center justify-between pb-4 flex-wrap">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add a task to avoid</h2>
      <ToneSelector />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 flex-wrap">
        <Input
          type="text"
          placeholder="Enter a task you should be doing..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-1 border-lavender-300 focus-visible:ring-purple-500"
          disabled={isLoading}
        />
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {isLoading ? "Adding..." : "Add Task"}
        </Button>
      </form>
      <p className="text-sm text-gray-500 mt-2">
        Our AI will help you find creative ways to avoid your responsibilities!
      </p>
    </div>
  )
}

