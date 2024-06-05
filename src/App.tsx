import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from 'react-router-dom';
import MainContextProvider from './ui/MainContext';
import MainPage from './ui/MainPage';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <MainContextProvider>
          <MainPage />
        </MainContextProvider>
      ),
      children: [
        {
          path: '*',
          loader: async () => redirect('/'),
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
