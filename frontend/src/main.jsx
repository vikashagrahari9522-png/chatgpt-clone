import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
// import App from './App.jsx'
import { store } from './store/store.js'
import { RouterProvider } from 'react-router-dom'
import { AppRouter } from './AppRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={AppRouter} />
      {/* <App /> */}
    </Provider>
  </StrictMode>,
)
