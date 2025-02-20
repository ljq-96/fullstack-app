import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/list/list1/')({
  meta: {
    name: 'list1',
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/list/list1/"!</div>
}
