import { useEffect, useState } from 'react'
import faviconLight from '../assets/favicon_claro.png'
import faviconDark from '../assets/favicon_oscuro.png'

const THEME_KEY = 'terrabyte-theme'

function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

// Header mantiene el estado del tema y lo comparte con ThemeToggle por props.
export function useTheme() {
  const [theme, setTheme] = useState(readStoredTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme

    const favicon = document.getElementById('site-favicon')
    if (favicon) favicon.href = theme === 'light' ? faviconLight : faviconDark

    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // El botón también funciona cuando el navegador bloquea el almacenamiento.
    }
  }, [theme])

  useEffect(() => {
    function syncTheme(event) {
      if (event.key === THEME_KEY || event.key === null) {
        setTheme(readStoredTheme())
      }
    }

    window.addEventListener('storage', syncTheme)
    return () => window.removeEventListener('storage', syncTheme)
  }, [])

  function toggleTheme() {
    setTheme((current) => current === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}
