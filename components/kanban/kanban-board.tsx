"use client"

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { useTaskStore, Task } from "@/lib/store"

type ColumnId = 'TODO' | 'IN_PROGRESS' | 'DONE'

interface Column {
  id: ColumnId
  title: string
}

const COLUMNS: Column[] = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' }
]

export default function KanbanBoard() {
  const tasks = useTaskStore((state) => state.tasks)
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus)

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    if (source.droppableId === destination.droppableId) return

    updateTaskStatus(draggableId, destination.droppableId as ColumnId)
  }

  const getColumnTasks = (columnId: ColumnId) => {
    return tasks.filter((task) => task.status === columnId)
  }

  return (
    <div className="flex gap-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {COLUMNS.map((column) => (
          <div key={column.id} className="flex-1">
            <h2 className="font-semibold mb-4">{column.title}</h2>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4 min-h-[200px] p-4 bg-gray-50 rounded-lg"
                >
                  {getColumnTasks(column.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm">{task.text}</CardTitle>
                            </CardHeader>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  )
} 