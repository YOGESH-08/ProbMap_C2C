import { useState } from 'react'
import './App.css'
import Header from "./assets/Admin/Header"
import Footer from "./assets/components/Footer"
import AuthForms from './assets/components/Authforms'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <AuthForms/>
    </>
  )
}

export default App
