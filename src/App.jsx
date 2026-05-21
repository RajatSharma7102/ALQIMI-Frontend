import Signup from './Signup'
import Login from './Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'

function App() {

  return (
   <div>

    <div className="extra-white-circle"></div>
    <BrowserRouter>
      <Routes>
        <Route path="/registration" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />

      </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App
