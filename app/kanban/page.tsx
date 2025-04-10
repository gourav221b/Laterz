"use client"

import { useState } from "react"
import Header from "@/components/header"
import TaskInput from "@/components/task-input"
import TaskList from "@/components/task-list"
import KanbanBoard from "@/components/kanban/kanban-board"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutList, LayoutGrid } from "lucide-react"

export default function KanbanPage() {
  const [viewMode, setViewMode] = useState<"list" | "board">("list")

  return (
    <div className="container mx-auto py-8 space-y-8">

      <TaskInput />
      
      <Tabs defaultValue="list" className="w-full" onValueChange={(value) => setViewMode(value as "list" | "board")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <LayoutList className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="board" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Board View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <TaskList />
        </TabsContent>
        
        <TabsContent value="board">
          <KanbanBoard />
        </TabsContent>
      </Tabs>
    </div>
  )
} 