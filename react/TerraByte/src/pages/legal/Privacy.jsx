import LegalPage from '../../components/layout/LegalPage.jsx'

export default function Privacy() {
  return (
    <LegalPage title="Política de privacidad" updated="octubre 2026">
      <p>
        En TerraByte respetamos tu privacidad. Esta política explica qué
        datos recopilamos, para qué los usamos y cuáles son tus derechos.
      </p>
      <h2>1. Datos que recopilamos</h2>
      <ul>
        <li>Datos de cuenta: nombre, correo electrónico y contraseña.</li>
        <li>Datos de compra: productos, dirección de envío y facturación.</li>
        <li>Datos de navegación: preferencias como el tema claro u oscuro.</li>
      </ul>
      <h2>2. Uso de la información</h2>
      <p>
        Usamos tus datos para procesar pedidos, brindarte soporte, mejorar
        el sitio y, si lo aceptás, enviarte novedades y promociones.
      </p>
      <h2>3. Compartir información</h2>
      <p>
        No vendemos tus datos. Solo los compartimos con proveedores
        necesarios para operar (pagos, envíos) o cuando la ley lo exija.
      </p>
      <h2>4. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas razonables para proteger
        tu información contra accesos no autorizados.
      </p>
      <h2>5. Tus derechos</h2>
      <p>
        Podés acceder, rectificar o eliminar tus datos en cualquier momento,
        conforme a la Ley 25.326 de Protección de Datos Personales,
        escribiéndonos a <a href="mailto:privacidad@terrabyte.com">privacidad@terrabyte.com</a>.
      </p>
    </LegalPage>
  )
}
