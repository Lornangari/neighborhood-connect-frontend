// components/DarkModeToggle.jsx
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react' // or use other icons

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') {
      setDarkMode(true)
    }
  }, [])

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="flex items-center gap-2 bg-gray-200 dark:bg-black-800 p-1 rounded-full transition-colors duration-300"
    >
      <div className="w-10 h-5 flex items-center bg-black-300 dark:bg-black-600 rounded-full p-1">
        <div
          className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            darkMode ? 'translate-x-5' : ''
          }`}
        />
      </div>
      {darkMode ? (
        <Moon className="w-4 h-4 text-yellow-300" />
      ) : (
        <Sun className="w-4 h-4 text-yellow-500" />
      )}
    </button>
  )
}

export default DarkModeToggle
