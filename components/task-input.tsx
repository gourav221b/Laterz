"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Calendar, Clock, Tag, Flag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import excuseLoaderTexts from "@/lib/loaderTexts"
import ToneSelector from "./tone-selector"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useTaskStore } from "@/lib/store"

export default function TaskInput() {
  const [task, setTask] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("medium")
  const [dueDate, setDueDate] = useState("")
  const [estimatedDuration, setEstimatedDuration] = useState("")
  const { toast } = useToast()
  const addTask = useTaskStore((state) => state.addTask)

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

    setIsLoading(true)
    
    try {
      // Add task to Zustand store
      addTask({
        text: task,
        status: 'TODO'
      })

      setTask("")
      setCategory("")
      setPriority("medium")
      setDueDate("")
      setEstimatedDuration("")

      toast({
        title: "Task added",
        description: "Now let's find ways to avoid doing it!",
      })
    } catch (error) {
      console.error('Error adding task:', error)
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2 flex-wrap">
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Study">Study</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Home">Home</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border-lavender-300 focus-visible:ring-purple-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Est. Duration (min)</Label>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <Input
                id="duration"
                type="number"
                placeholder="e.g. 30"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                className="border-lavender-300 focus-visible:ring-purple-500"
              />
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-2">
          Our AI will help you find creative ways to avoid your responsibilities!
        </p>
      </form>
    </div>
  )
}

