import { useState } from 'react'
import './App.css'
import AuthForms from "./assets/components/Authforms";
import "./assets/Styles/authform.css"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <AuthForms />
    </>
  )
}

export default App
