import LegalPage from '../../components/LegalPage.jsx'
import LegalSection from '../../components/LegalSection.jsx'

export default function Terms() {
  return (
    <LegalPage title="Términos de uso" updated="octubre 2026">
      <p>
        Al acceder y utilizar el sitio de TerraByte aceptás los siguientes términos. Si no estás de acuerdo, te pedimos que no uses el sitio.
      </p>
      <LegalSection title="1. Uso del sitio">
        <p>
          El sitio está destinado a la compra de productos y servicios tecnológicos. Te comprometés a usarlo de forma lícita y sin afectar su funcionamiento.
        </p>
      </LegalSection>
      <LegalSection title="2. Cuentas de usuario">
        <p>
          Sos responsable de mantener la confidencialidad de tu contraseña y de toda actividad realizada desde tu cuenta.
        </p>
      </LegalSection>
      <LegalSection title="3. Precios y disponibilidad">
        <p>
          Los precios y el stock pueden cambiar sin previo aviso. Nos reservamos el derecho de cancelar pedidos ante errores evidentes de publicación.
        </p>
      </LegalSection>
      <LegalSection title="4. Propiedad intelectual">
        <p>
          Los contenidos, logos y diseños del sitio pertenecen a TerraByte o a sus respectivos titulares y no pueden reproducirse sin autorización.
        </p>
      </LegalSection>
      <LegalSection title="5. Modificaciones">
        <p>
          Podemos actualizar estos términos en cualquier momento. La versión vigente será siempre la publicada en esta página.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
