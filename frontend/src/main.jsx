import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignInPage from './SignInPage.jsx'
import WaitingPage from './WaitingPage.jsx'
import MainPage from './MainPage.jsx'
import CompletionScreen from './CompletionScreen.jsx'
import './index.css'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/waiting" element={<WaitingPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/completion" element={<CompletionScreen />} />
      </Routes>
    </Router>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)