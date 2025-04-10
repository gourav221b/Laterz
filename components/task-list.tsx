"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, RefreshCw, Clock, Calendar, Check, Filter, X, Tag, Folder, AlertCircle, Flag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import excuseLoaderTexts from "@/lib/loaderTexts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Markdown from 'react-markdown'
import { Task, Category, Priority, Level } from "@/types/tasks"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import TaskInput from "./task-input"

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [aiTone, setAiTone] = useState("personal")
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all")
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [tagFilter, setTagFilter] = useState<string>("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    // Load tasks from localStorage on component mount
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks)
      setTasks(parsedTasks)
      
      // Extract all unique tags
      const tags = new Set<string>()
      parsedTasks.forEach((task: Task) => {
        task.tags.forEach(tag => tags.add(tag))
      })
      setAllTags(Array.from(tags))
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
        
        // Update allTags with new tags
        const tags = new Set<string>()
        newTasks.forEach((task: Task) => {
          task.tags.forEach(tag => tags.add(tag))
        })
        setAllTags(Array.from(tags))
        
        return newTasks
      })
    }

    const handleUpdateTask = (e: Event) => {
      const customEvent = e as CustomEvent;
      const updatedTask = customEvent.detail;
      setTasks((prev) => {
        const newTasks = prev.map((task) => task.id === updatedTask.id ? { ...task, excuses: updatedTask.excuses, alternatives: updatedTask.alternatives, level: updatedTask.level } : task)
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
      
      // Update allTags
      const tags = new Set<string>()
      newTasks.forEach((task: Task) => {
        task.tags.forEach(tag => tags.add(tag))
      })
      setAllTags(Array.from(tags))
      
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
              level: data.level
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

  const addTagToFilter = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
    setTagFilter("")
  }

  const removeTagFromFilter = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const clearFilters = () => {
    setCategoryFilter("all")
    setPriorityFilter("all")
    setSelectedTags([])
    setTagFilter("")
  }

  const filteredTasks = tasks.filter(task => {
    // Filter by completion status
    if (filter === "completed" && !task.completed) return false
    if (filter === "incomplete" && task.completed) return false
    
    // Filter by category
    if (categoryFilter !== "all" && task.category !== categoryFilter) return false
    
    // Filter by priority
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false
    
    // Filter by tags
    if (selectedTags.length > 0) {
      const hasAllSelectedTags = selectedTags.every(tag => task.tags.includes(tag))
      if (!hasAllSelectedTags) return false
    }
    
    return true
  })

  if (tasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white rounded-lg shadow-md border border-lavender-200"
      >
        <p className="text-gray-500 mb-2">No tasks to procrastinate on yet. Add one above!</p>
        <TaskInput floating={false} />
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "completed" | "incomplete")} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(categoryFilter !== "all" || priorityFilter !== "all" || selectedTags.length > 0) && (
                <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">
                  {categoryFilter !== "all" ? 1 : 0 + priorityFilter !== "all" ? 1 : 0 + selectedTags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Filters</h3>
                {(categoryFilter !== "all" || priorityFilter !== "all" || selectedTags.length > 0) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category-filter">Category</Label>
                <Select 
                  value={categoryFilter} 
                  onValueChange={(value) => setCategoryFilter(value as Category | "all")}
                >
                  <SelectTrigger id="category-filter" className="border-lavender-300 focus:ring-purple-500">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {Object.values(Category).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority-filter">Priority</Label>
                <Select 
                  value={priorityFilter} 
                  onValueChange={(value) => setPriorityFilter(value as Priority | "all")}
                >
                  <SelectTrigger id="priority-filter" className="border-lavender-300 focus:ring-purple-500">
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    {Object.values(Priority).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tag-filter">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTagFromFilter(tag)}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Filter by tag"
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    className="flex-1 border-lavender-300 focus-visible:ring-purple-500"
                  />
                  <Select 
                    value={tagFilter} 
                    onValueChange={(value) => addTagToFilter(value)}
                  >
                    <SelectTrigger className="w-[100px] border-lavender-300 focus:ring-purple-500">
                      <SelectValue placeholder="Add" />
                    </SelectTrigger>
                    <SelectContent>
                      {allTags
                        .filter(tag => !selectedTags.includes(tag) && tag.toLowerCase().includes(tagFilter.toLowerCase()))
                        .map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
        <Accordion type="multiple" >
        <AnimatePresence>
      <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <AccordionItem value={task.id.toString()} className="border-none">
                <Card className={`border-lavender-200 shadow-md h-full ${task.completed ? 'opacity-60' : ''}`}>
                  <CardHeader className="bg-lavender-50 rounded-t-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2 w-full">
                        <AccordionTrigger className="h-6 w-6 p-0 hover:no-underline mt-1" />
                        <div className="w-full">
                          <CardTitle className={`text-xl text-gray-800 ${task.completed ? 'line-through' : ''}`}>{task.text}</CardTitle>
                          
                          <div className="flex flex-col gap-2 mt-2">
                            <div className="flex flex-wrap gap-2 items-center">
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="bg-white text-purple-700 border-purple-200 text-xs">
                                <Folder className="h-3.5 w-3.5 text-purple-600 mr-1" />
                                  {task.category}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-xs capitalize", 
                                    task.priority === Priority.HIGH &&
                                     'bg-red-50 text-red-700 border-red-200', 
                                     task.priority === Priority.MEDIUM &&
                                     'bg-yellow-50 text-yellow-700 border-yellow-200', 
                                     task.priority === Priority.LOW &&
                                     'bg-green-50 text-green-700 border-green-200'
                                  )}
                                >
                                  <Flag className="h-3.5 w-3.5 mr-1 " />
                                  {task.priority}
                                </Badge>
                              </div>
                              
                              {task.level && (
                                <div className="flex items-center gap-1">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                  <AlertCircle className="h-3.5 w-3.5 text-blue-600 mr-1" />
                                    {task.level}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            
                            {task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 items-center">
                                <Tag className="h-3.5 w-3.5 text-gray-500" />
                                {task.tags.slice(0, 5).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {task.tags.length > 5 && (
                                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                                    +{task.tags.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-2">
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
                    <CardDescription className="flex flex-wrap items-center mt-2 text-gray-500 text-xs">
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 ml-7" />
                        Added {formatDistanceToNow(new Date(task.createdAt))} ago
                      </div>
                      {task.due && (
                        <>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            Due {formatDistanceToNow(new Date(task.due), { addSuffix: true })}
                          </div>
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                          <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs mr-2 text-[10px] text-center">AI EXCUSES</span>
                          Why you shouldn't do this right now:
                        </h3>
                        {
                          task.excuses?.length == 0 ? <>Loading excuse! {excuseLoaderTexts[Math.floor(Math.random() * excuseLoaderTexts.length)]}</> :
                            <ul className="space-y-2 pl-5 list-disc text-gray-700">
                              {task.excuses?.map((excuse, i) => (
                                <li key={i}><Markdown>{excuse}</Markdown></li>
                              ))}
                            </ul>}
                      </div>
                      <div>
                        <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                          <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs mr-2 text-[10px] text-center">
                            AI SUGGESTIONS
                          </span>
                          What you could do instead:
                        </h3>
                        {
                          task.excuses?.length == 0 ? <>Loading excuse! {excuseLoaderTexts[Math.floor(Math.random() * excuseLoaderTexts.length)]}</> :
                            <ul className="space-y-2 pl-5 list-disc text-gray-700">
                              {task.alternatives?.map((alt, i) => (
                                <li key={i}><Markdown>{alt}</Markdown></li>
                              ))}
                            </ul>
                        }</div>
                    </CardContent>
                  </AccordionContent>
                  <CardFooter className="bg-lavender-50 rounded-b-lg text-xs text-gray-500 py-2">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Procrastination level: {task.level||"Beginner"}</span>
                    </div>
                  </CardFooter>
                </Card>
              </AccordionItem>
            </motion.div>
          ))}
      </div>
        </AnimatePresence>
        </Accordion>
    </div>
  )
}

