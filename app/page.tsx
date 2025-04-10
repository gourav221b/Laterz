import Header from "@/components/header"
import TaskInput from "@/components/task-input"
import TaskList from "@/components/task-list"

export default function Home() {
  return (
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col h-full">
        <div className="w-full max-w-4xl mx-auto flex-1 h-full">
         <div className="block md:hidden">

          <TaskInput />
         </div>
          <TaskList />
        </div>
      </div>
  )
}

