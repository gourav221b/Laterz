"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, PlusCircle, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ToneSelector from "./tone-selector"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Level, Priority, Task, Category } from "@/types/tasks"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

export default function TaskInput({floating=true}: {floating?: boolean}) {
  const defaultTask: Task = {
    id: 0,
    createdAt: new Date().toISOString(),
    text: "",
    category: Category.PERSONAL,
    tags: [],
    due: new Date(),
    priority: Priority.LOW,
    completed: false,
    level: Level.BEGINNER,
    excuses: [],
    alternatives: [],
  }
  const [task, setTask] = useState(defaultTask)
  const [tagInput, setTagInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!task.text.trim()) {
      toast({
        title: "Task cannot be empty",
        description: "Please enter a task to procrastinate on.",
        variant: "destructive",
      })
      return
    }
    const id = Date.now();
    setIsLoading(true)
    window.dispatchEvent(
      new CustomEvent("addTask", {
        detail: {
          id,
          text: task.text,
          tags: task.tags,
          category: task.category,
          due: task.due,
          level: task.level,
          createdAt: new Date().toISOString(),
          excuses: [],
          alternatives: [],
          completed: false,
          priority: task.priority
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
        body: JSON.stringify({ 
          task: task.text.trim(),
          category: task.category,
          priority: task.priority,
          tags: task.tags
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate excuses and alternatives')
      }

      const data = await response.json()

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

      setTask(defaultTask)
      setTagInput("")
      setOpen(false)

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

  const addTag = () => {
    if (tagInput.trim() && !task.tags.includes(tagInput.trim()) && task.tags.length < 5) {
      setTask(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    } else if (task.tags.length >= 5) {
      toast({
        title: "Maximum tags reached",
        description: "You can only add up to 5 tags per task.",
        variant: "destructive",
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTask(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {floating?<Button 
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 z-50"
            size="icon"
          >
            <PlusCircle className="h-6 w-6" />
            <span className="sr-only">Add task</span>
          </Button>:<Button><PlusCircle className="h-6 w-6 mr-1" />Add task</Button>}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Add a task to avoid</DialogTitle>
          </DialogHeader>
       
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task">Task</Label>
              <Input
                type="text"
                placeholder="Enter a task you should be doing..."
                value={task.text}
                onChange={(e) => setTask((prev) => ({ ...prev, text: e.target.value }))}
                className="w-full border-lavender-300 focus-visible:ring-purple-500"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Max. 5)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                type="text"
                placeholder="Add tags (comma separated)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border-lavender-300 focus-visible:ring-purple-500"
                disabled={isLoading || task.tags.length >= 5}
              />
              {task.tags.length >= 5 && (
                <p className="text-xs text-amber-600 mt-1">Maximum of 5 tags reached</p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={task.category} 
                  onValueChange={(value) => setTask((prev) => ({ ...prev, category: value as Category }))}
                >
                  <SelectTrigger id="category" className="w-full border-lavender-300 focus:ring-purple-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Category).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={task.priority} 
                  onValueChange={(value) => setTask((prev) => ({ ...prev, priority: value as Priority }))}
                >
                  <SelectTrigger id="priority" className="w-full border-lavender-300 focus:ring-purple-500">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Priority).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <div className="w-full border pl-3 flex items-center border-lavender-300 focus-within:ring-2 focus-within:ring-purple-500 rounded-md">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <Input
                    id="dueDate"
                    type="date"
                    value={task.due?.toISOString().split('T')[0]}
                    onChange={(e) => setTask((prev) => ({ ...prev, due: new Date(e.target.value) }))}
                    className="border-0 focus-visible:ring-0 pl-2"
                  />
                </div>
              </div>
              <ToneSelector />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 mt-6" 
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {isLoading ? "Adding..." : "Add Task"}
            </Button>
          </form>
          <p className="text-sm text-gray-500 mt-2">
            Our AI will help you find creative ways to avoid your responsibilities!
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}

