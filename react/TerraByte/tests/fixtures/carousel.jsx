import { createRoot } from 'react-dom/client'
import Carrousel from '../../src/components/ui/Carrousel.jsx'
import '../../src/index.css'

createRoot(document.getElementById('root')).render(
  <Carrousel interval={600}>
    {[1, 2].map((id) => <button key={id} type="button" className="h-48 w-full">Producto {id}</button>)}
  </Carrousel>,
)
