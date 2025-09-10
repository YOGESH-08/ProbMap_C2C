import { useState } from 'react'
import './App.css'
import Upload from './assets/components/Upload';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Upload/>
    </>
  )
}

export default App
