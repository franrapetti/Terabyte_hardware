import LegalPage from '../components/LegalPage.jsx'

export default function Legal() {
  return (
    <LegalPage title="Información legal" updated="octubre 2026">
      <p>
        Información sobre la empresa responsable de este sitio.
      </p>
      <h2>Razón social</h2>
      <p>TerraByte Team S.R.L.</p>
      <h2>Domicilio</h2>
      <p>Buenos Aires, Argentina.</p>
      <h2>Contacto</h2>
      <p>
        <a href="mailto:contacto@terrabyte.com">contacto@terrabyte.com</a>
      </p>
      <h2>Defensa del consumidor</h2>
      <p>
        Ante cualquier reclamo podés dirigirte a la Dirección Nacional de
        Defensa del Consumidor o a la autoridad de tu jurisdicción.
      </p>
      <h2>Marcas</h2>
      <p>
        Las marcas y logos de terceros mencionados en el sitio pertenecen a
        sus respectivos dueños y se usan solo con fines identificatorios.
      </p>
    </LegalPage>
  )
}
