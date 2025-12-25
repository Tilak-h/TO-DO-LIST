import TaskList from './pages/TaskList';
import Login from './pages/Login';
import Register from './pages/Register';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Tasks',
    path: '/',
    element: <TaskList />
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false
  },
  {
    name: 'Register',
    path: '/register',
    element: <Register />,
    visible: false
  }
];

export default routes;
