import './App.css'
import { useTheme } from './hooks/useTheme'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <div className='flex items-center gap-4 p-6'>
        <h1 className='text-3xl font-bold underline text-blue-500'>Vite + React</h1>
        <button
          type='button'
          onClick={toggleTheme}
          className='rounded-lg border px-4 py-2 text-sm font-medium'
        >
          {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
        </button>
      </div>
    </>
  )
}

export default App
