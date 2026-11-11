import LegalPage from '../../components/LegalPage.jsx'
import LegalSection from '../../components/LegalSection.jsx'

export default function Privacy() {
  return (
    <LegalPage title="Política de privacidad" updated="octubre 2026">
      <p>
        En TerraByte respetamos tu privacidad. Esta política explica qué datos recopilamos, para qué los usamos y cuáles son tus derechos.
      </p>
      <LegalSection title="1. Datos que recopilamos">
        <ul className="my-2 list-disc pl-5">
          <li>Datos de cuenta: nombre, correo electrónico y contraseña.</li>
          <li>Datos de compra: productos, dirección de envío y facturación.</li>
          <li>Datos de navegación: preferencias como el tema claro u oscuro.</li>
        </ul>
      </LegalSection>
      <LegalSection title="2. Uso de la información">
        <p>
          Usamos tus datos para procesar pedidos, brindarte soporte, mejorar el sitio y, si lo aceptás, enviarte novedades y promociones.
        </p>
      </LegalSection>
      <LegalSection title="3. Compartir información">
        <p>
          No vendemos tus datos. Solo los compartimos con proveedores necesarios para operar (pagos, envíos) o cuando la ley lo exija.
        </p>
      </LegalSection>
      <LegalSection title="4. Seguridad">
        <p>
          Aplicamos medidas técnicas y organizativas razonables para proteger tu información contra accesos no autorizados.
        </p>
      </LegalSection>
      <LegalSection title="5. Tus derechos">
        <p>
          Podés acceder, rectificar o eliminar tus datos en cualquier momento, conforme a la Ley 25.326 de Protección de Datos Personales, escribiéndonos a <a href="mailto:privacidad@terrabyte.com">privacidad@terrabyte.com</a>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
