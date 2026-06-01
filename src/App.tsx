import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DashboardHome from './components/Dashboard/DashboardHome'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          {/* Routes supplémentaires à venir */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
