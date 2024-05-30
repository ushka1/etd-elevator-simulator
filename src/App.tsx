import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from 'react-router-dom';
import MainPage from './ui/MainPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    children: [
      {
        path: '*',
        loader: async () => redirect('/'),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
