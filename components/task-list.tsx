"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, RefreshCw, Clock, Calendar, Check, Star, Tag, Flag, Timer, ChevronDown, ChevronUp, Plus, X, Edit2, Save } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import excuseLoaderTexts from "@/lib/loaderTexts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Markdown from 'react-markdown'
import { useTaskStore, Task } from "@/lib/store"

interface ExtendedTask extends Task {
  category?: string
  priority?: 'high' | 'medium' | 'low'
  dueDate?: string
  estimatedDuration?: number
  subtasks?: Array<{
    id: string
    text: string
    completed: boolean
  }>
  tags?: string[]
  excuses?: string[]
  alternatives?: string[]
  favoriteExcuses?: string[]
  level?: string
  postponeCount?: number
  procrastinationPoints?: number
  createdAt?: string
}

export default function TaskList() {
  const tasks = useTaskStore((state) => state.tasks) as ExtendedTask[]
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus)
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [newSubtask, setNewSubtask] = useState("")
  const [newTag, setNewTag] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.status === "DONE"
    if (filter === "incomplete") return task.status !== "DONE"
    return true
  })

  const handleStatusChange = (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    updateTaskStatus(taskId, newStatus)
  }

  const deleteTask = (id: string) => {
    // Implementation of deleteTask function
  }

  const regenerateExcuses = async (id: string) => {
    // Implementation of regenerateExcuses function
  }

  const toggleCompleted = (id: string) => {
    // Implementation of toggleCompleted function
  }

  const toggleSubtaskCompleted = (taskId: string, subtaskId: string) => {
    // Implementation of toggleSubtaskCompleted function
  }

  const addSubtask = (taskId: string) => {
    // Implementation of addSubtask function
  }

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    // Implementation of deleteSubtask function
  }

  const addTag = (taskId: string) => {
    // Implementation of addTag function
  }

  const removeTag = (taskId: string, tagToRemove: string) => {
    // Implementation of removeTag function
  }

  const toggleFavoriteExcuse = (taskId: string, excuse: string) => {
    // Implementation of toggleFavoriteExcuse function
  }

  const updateTaskField = (taskId: string, field: string, value: any) => {
    // Implementation of updateTaskField function
  }

  const startEditing = (taskId: string) => {
    setEditingTask(taskId)
  }

  const saveEditing = (taskId: string) => {
    setEditingTask(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getDueDateStatus = (dueDate?: string) => {
    if (!dueDate) return { class: '', text: '' }
    const date = new Date(dueDate)
    const now = new Date()
    if (date < now) {
      return { class: 'bg-red-50 text-red-700 border-red-200', text: 'Overdue' }
    }
    if (date.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return { class: 'bg-yellow-50 text-yellow-700 border-yellow-200', text: 'Due today' }
    }
    return { class: 'bg-green-50 text-green-700 border-green-200', text: 'Upcoming' }
  }

  const calculateProgress = (task: ExtendedTask) => {
    if (!task.subtasks || task.subtasks.length === 0) return 0
    const completed = task.subtasks.filter(subtask => subtask.completed).length
    return Math.round((completed / task.subtasks.length) * 100)
  }

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
      <div className="flex flex-wrap gap-4 justify-end mb-4">
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
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <AnimatePresence>
        <Accordion type="multiple" className="space-y-4" defaultValue={filteredTasks.map(task => task.id)}>
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
            >
              <AccordionItem value={task.id} className="border-none" >
                <Card className={`border-lavender-200 shadow-md ${task.status === "DONE" ? 'opacity-60' : ''}`}>
                  <CardHeader className="bg-lavender-50 rounded-t-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <AccordionTrigger className="h-6 w-6 p-0 hover:no-underline" />
                        <div>
                          {editingTask === task.id ? (
                            <Input 
                              value={task.text} 
                              onChange={(e) => updateTaskField(task.id, 'text', e.target.value)}
                              className="text-xl font-semibold"
                              onBlur={() => saveEditing(task.id)}
                            />
                          ) : (
                            <CardTitle className={`text-xl text-gray-800 ${task.status === "DONE" ? 'line-through' : ''}`}>
                              {task.text}
                            </CardTitle>
                          )}
                          
                          <div className="flex flex-wrap gap-2 mt-1">
                            {task.category && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                {task.category}
                              </Badge>
                            )}
                            
                            {task.priority && (
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                <Flag className="h-3 w-3 mr-1" />
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </Badge>
                            )}
                            
                            {task.dueDate && (
                              <Badge variant="outline" className={getDueDateStatus(task.dueDate).class}>
                                <Calendar className="h-3 w-3 mr-1" />
                                {getDueDateStatus(task.dueDate).text}
                              </Badge>
                            )}
                            
                            {task.estimatedDuration && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                <Timer className="h-3 w-3 mr-1" />
                                {task.estimatedDuration} min
                              </Badge>
                            )}
                          </div>
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
                                className={`h-8 w-8 ${task.status === "DONE" ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' : 'text-purple-600 border-purple-200 hover:bg-purple-50'}`}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{task.status === "DONE" ? 'Mark as incomplete' : 'Mark as complete'}</p>
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
                                onClick={() => startEditing(task.id)}
                                className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit task</p>
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
                    <CardDescription className="flex items-center mt-1 text-gray-500">
                      <Clock className="h-4 w-4 mr-1 ml-7" />
                      Added {task.createdAt ? formatDistanceToNow(new Date(task.createdAt)) : 'recently'} ago
                    </CardDescription>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="pt-6">
                      {/* Subtasks Section */}
                      <div className="mb-4">
                        <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                          <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs mr-2 text-[10px] text-center">SUBTASKS</span>
                          Break it down:
                        </h3>
                        
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="mb-2">
                            <Progress value={calculateProgress(task)} className="h-2 mb-2" />
                            <p className="text-xs text-gray-500">{calculateProgress(task)}% complete</p>
                          </div>
                        )}
                        
                        <ul className="space-y-2 pl-5 list-disc text-gray-700">
                          {task.subtasks?.map((subtask) => (
                            <li key={subtask.id} className="flex items-center">
                              <Checkbox 
                                checked={subtask.completed} 
                                onCheckedChange={() => toggleSubtaskCompleted(task.id, subtask.id)}
                                className="mr-2"
                              />
                              <span className={subtask.completed ? 'line-through text-gray-400' : ''}>
                                {subtask.text}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-auto text-red-500"
                                onClick={() => deleteSubtask(task.id, subtask.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex mt-2">
                          <Input
                            type="text"
                            placeholder="Add a subtask..."
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            className="flex-1 mr-2"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => addSubtask(task.id)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Tags Section */}
                      <div className="mb-4">
                        <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                          <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs mr-2 text-[10px] text-center">TAGS</span>
                          Organize your procrastination:
                        </h3>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          {task.tags?.map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 text-blue-500"
                                onClick={() => removeTag(task.id, tag)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex mt-2">
                          <Input
                            type="text"
                            placeholder="Add a tag..."
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="flex-1 mr-2"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => addTag(task.id)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Task Details Section */}
                      <div className="mb-4">
                        <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                          <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs mr-2 text-[10px] text-center">DETAILS</span>
                          Task information:
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-500">Category</label>
                            <Select 
                              value={task.category || ""} 
                              onValueChange={(value) => updateTaskField(task.id, 'category', value)}
                            >
                              <SelectTrigger>
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
                          
                          <div>
                            <label className="text-sm text-gray-500">Priority</label>
                            <Select 
                              value={task.priority || "medium"} 
                              onValueChange={(value) => updateTaskField(task.id, 'priority', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-500">Due Date</label>
                            <Input 
                              type="date" 
                              value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ""} 
                              onChange={(e) => updateTaskField(task.id, 'dueDate', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-500">Estimated Duration (minutes)</label>
                            <Input 
                              type="number" 
                              value={task.estimatedDuration || ""} 
                              onChange={(e) => updateTaskField(task.id, 'estimatedDuration', e.target.value ? parseInt(e.target.value) : undefined)}
                              placeholder="e.g. 30"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Excuses Section */}
                      <div className="mb-4">
                        <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                          <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs mr-2 text-[10px] text-center">AI EXCUSES</span>
                          Why you shouldn't do this right now:
                        </h3>
                        {
                          !task.excuses || task.excuses.length === 0 ? <>Loading excuse! {excuseLoaderTexts[Math.floor(Math.random() * excuseLoaderTexts.length)]}</> :
                            <ul className="space-y-2 pl-5 list-disc text-gray-700">
                              {task.excuses.map((excuse, i) => (
                                <li key={i} className="flex items-start">
                                  <Markdown>{excuse}</Markdown>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-6 w-6 ml-2 ${task.favoriteExcuses?.includes(excuse) ? 'text-yellow-500' : 'text-gray-400'}`}
                                    onClick={() => toggleFavoriteExcuse(task.id, excuse)}
                                  >
                                    <Star className="h-4 w-4" />
                                  </Button>
                                </li>
                              ))}
                            </ul>}
                      </div>
                      
                      {/* Alternatives Section */}
                      <div>
                        <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                          <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs mr-2 text-[10px] text-center">
                            AI SUGGESTIONS
                          </span>
                          What you could do instead:
                        </h3>
                        {
                          !task.alternatives || task.alternatives.length === 0 ? <>Loading excuse! {excuseLoaderTexts[Math.floor(Math.random() * excuseLoaderTexts.length)]}</> :
                            <ul className="space-y-2 pl-5 list-disc text-gray-700">
                              {task.alternatives.map((alt, i) => (
                                <li key={i}><Markdown>{alt}</Markdown></li>
                              ))}
                            </ul>}
                      </div>
                    </CardContent>
                  </AccordionContent>
                  <CardFooter className="bg-lavender-50 rounded-b-lg text-xs text-gray-500 py-2">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Procrastination level: {task.level || "Beginner"}</span>
                      </div>
                      <div className="flex items-center">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        <span>Postponed {task.postponeCount || 0} times</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        <span>{task.procrastinationPoints || 0} points</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </AnimatePresence>
    </div>
  )
}

