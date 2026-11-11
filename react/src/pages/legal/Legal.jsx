import LegalPage from '../../components/LegalPage.jsx'
import LegalSection from '../../components/LegalSection.jsx'

export default function Legal() {
  return (
    <LegalPage title="Información legal" updated="octubre 2026">
      <p>Información sobre la empresa responsable de este sitio.</p>
      <LegalSection title="Razón social">
        <p>TerraByte Team S.R.L.</p>
      </LegalSection>
      <LegalSection title="Domicilio">
        <p>Buenos Aires, Argentina.</p>
      </LegalSection>
      <LegalSection title="Contacto">
        <p>
          <a href="mailto:contacto@terrabyte.com">contacto@terrabyte.com</a>
        </p>
      </LegalSection>
      <LegalSection title="Defensa del consumidor">
        <p>
          Ante cualquier reclamo podés dirigirte a la Dirección Nacional de Defensa del Consumidor o a la autoridad de tu jurisdicción.
        </p>
      </LegalSection>
      <LegalSection title="Marcas">
        <p>
          Las marcas y logos de terceros mencionados en el sitio pertenecen a sus respectivos dueños y se usan solo con fines identificatorios.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
