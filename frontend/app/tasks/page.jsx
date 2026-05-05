import ProtectedLayout from '../../src/components/ProtectedLayout'
import TasksPage from '../../src/features/tasks/pages/TasksPage'

export default function TasksRoute() {
  return (
    <ProtectedLayout>
      <TasksPage />
    </ProtectedLayout>
  )
}
