import { useSyncExternalStore } from 'react'

export const THEME_KEY = 'terrabyte-theme'
const changeEvent = 'terrabyte-theme-change'

function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

let currentTheme = readStoredTheme()

function applyTheme(theme) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

export function initializeTheme() {
  currentTheme = readStoredTheme()
  applyTheme(currentTheme)
}

export function getTheme() {
  return currentTheme
}

export function setTheme(theme) {
  currentTheme = theme === 'light' ? 'light' : 'dark'
  applyTheme(currentTheme)
  try {
    localStorage.setItem(THEME_KEY, currentTheme)
  } catch {
    // La preferencia sigue funcionando durante la sesión sin almacenamiento.
  }
  window.dispatchEvent(new Event(changeEvent))
}

export function toggleTheme() {
  setTheme(currentTheme === 'dark' ? 'light' : 'dark')
}

function subscribe(listener) {
  function onStorage(event) {
    if (event.key !== THEME_KEY && event.key !== null) return
    currentTheme = readStoredTheme()
    applyTheme(currentTheme)
    listener()
  }
  window.addEventListener(changeEvent, listener)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(changeEvent, listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, () => 'dark')
}
