import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Import pages as we build them — placeholder for now
// import { VisitsPage } from './features/visits'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="p-8 text-brand font-bold text-2xl">Doorknock PWA 🚪</div>} />
        {/* Add routes here as each feature is built */}
      </Routes>
    </BrowserRouter>
  )
}
