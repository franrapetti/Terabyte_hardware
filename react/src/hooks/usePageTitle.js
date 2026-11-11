import { useEffect } from 'react'

// Cambia el título de la pestaña del navegador cuando se muestra una página.
// El <head> del HTML está fuera de React, por eso se hace dentro de un useEffect.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} | TerraByte`
  }, [title])
}
