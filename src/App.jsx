import Signup from './Signup'
import Home from './Home'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const isRegistered = localStorage.getItem("isRegistered");

  if (!isRegistered) {
    return <Navigate to="/registration" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <div className="extra-white-circle"></div>
      <BrowserRouter>
        <Routes>
          <Route path="/registration" element={<Signup />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/registration" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App