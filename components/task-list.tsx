"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, RefreshCw, Clock, Calendar, Check, ChevronDown, ChevronUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import excuseLoaderTexts from "@/lib/loaderTexts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id: number
  text: string
  createdAt: string
  excuses?: string[]
  alternatives?: string[]
  completed: boolean;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [aiTone, setAiTone] = useState("personal")
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all")

  useEffect(() => {
    // Load tasks from localStorage on component mount
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    // Load AI tone from localStorage
    const savedTone = localStorage.getItem('aiTone')
    if (savedTone) {
      setAiTone(savedTone)
    }

    const handleAddTask = (e: Event) => {
      const customEvent = e as CustomEvent
      const newTask = customEvent.detail
      setTasks((prev) => {
        const newTasks = [newTask, ...prev]
        localStorage.setItem('tasks', JSON.stringify(newTasks))
        return newTasks
      })
    }

    const handleUpdateTask = (e: Event) => {
      const customEvent = e as CustomEvent;
      const updatedTask = customEvent.detail;
      setTasks((prev) => {
        const newTasks = prev.map((task) => task.id === updatedTask.id ? { ...task, excuses: updatedTask.excuses, alternatives: updatedTask.alternatives } : task)
        localStorage.setItem('tasks', JSON.stringify(newTasks))
        return newTasks
      });
    }

    const handleToneChange = (e: Event) => {
      const customEvent = e as CustomEvent
      setAiTone(customEvent.detail)
    }

    window.addEventListener("addTask", handleAddTask)
    window.addEventListener("updateTask", handleUpdateTask)
    window.addEventListener("toneChange", handleToneChange)

    return () => {
      window.removeEventListener("updateTask", handleUpdateTask)
      window.removeEventListener("addTask", handleAddTask)
      window.removeEventListener("toneChange", handleToneChange)
    }
  }, [])

  const deleteTask = (id: number) => {
    setTasks((prev) => {
      const newTasks = prev.filter((task) => task.id !== id)
      localStorage.setItem('tasks', JSON.stringify(newTasks))
      return newTasks
    })
  }

  const regenerateExcuses = async (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          task: task.text,
          tone: aiTone 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate excuses and alternatives')
      }

      const data = await response.json()

      setTasks((prev) => {
        const newTasks = prev.map((task) => {
          if (task.id === id) {
            return {
              ...task,
              excuses: data.excuses,
              alternatives: data.alternatives,
            }
          }
          return task
        })
        localStorage.setItem('tasks', JSON.stringify(newTasks))
        return newTasks
      })
    } catch (error) {
      console.error('Error regenerating excuses:', error)
    }
  }

  const toggleCompleted = (id: number) => {
    setTasks((prev) => {
      const newTasks = prev.map((task) => task.id === id ? { ...task, completed: !task.completed } : task)
      localStorage.setItem('tasks', JSON.stringify(newTasks))
      return newTasks
    })
  }

  const toggleExpanded = (id: number) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true
    if (filter === "completed") return task.completed
    if (filter === "incomplete") return !task.completed
    return true
  })

  if (tasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white rounded-lg shadow-md border border-lavender-200"
      >
        <p className="text-gray-500">No tasks to procrastinate on yet. Add one above!</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Select value={filter} onValueChange={(value: "all" | "completed" | "incomplete") => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <AnimatePresence>
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={`border-lavender-200 shadow-md ${task.completed ? 'opacity-60' : ''}`}>
              <CardHeader className="bg-lavender-50 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpanded(task.id)}
                      className="h-6 w-6"
                    >
                      {expandedTasks.has(task.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <CardTitle className={`text-xl text-gray-800 ${task.completed ? 'line-through' : ''}`}>{task.text}</CardTitle>
                      <CardDescription className="flex items-center mt-1 text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Added {formatDistanceToNow(new Date(task.createdAt))} ago
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleCompleted(task.id)}
                            className={`h-8 w-8 ${task.completed ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' : 'text-purple-600 border-purple-200 hover:bg-purple-50'}`}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{task.completed ? 'Mark as incomplete' : 'Mark as complete'}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => regenerateExcuses(task.id)}
                            className="h-8 w-8 text-purple-600 border-purple-200 hover:bg-purple-50"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Regenerate excuses</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete task</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardHeader>
              <AnimatePresence>
                {expandedTasks.has(task.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                          <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs mr-2">AI EXCUSES</span>
                          Why you shouldn't do this right now:
                        </h3>
                        {
                          task.excuses?.length == 0 ? <>Loading excuse! {excuseLoaderTexts[Math.floor(Math.random() * excuseLoaderTexts.length)]}</> :

                            <ul className="space-y-2 pl-5 list-disc text-gray-700">
                              {task.excuses?.map((excuse, i) => (
                                <li key={i}>{excuse}</li>
                              ))}
                            </ul>}
                      </div>
                      <div>
                        <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                          <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs mr-2">
                            AI SUGGESTIONS
                          </span>
                          What you could do instead:
                        </h3>
                        {
                          task.excuses?.length == 0 ? <>Loading excuse! {excuseLoaderTexts[Math.floor(Math.random() * excuseLoaderTexts.length)]}</> :
                            <ul className="space-y-2 pl-5 list-disc text-gray-700">
                              {task.alternatives?.map((alt, i) => (
                                <li key={i}>{alt}</li>
                              ))}
                            </ul>
                        }</div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
              <CardFooter className="bg-lavender-50 rounded-b-lg text-xs text-gray-500 py-2">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Procrastination level: Expert</span>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

