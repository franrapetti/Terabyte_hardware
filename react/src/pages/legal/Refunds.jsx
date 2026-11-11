import LegalPage from '../../components/LegalPage.jsx'
import LegalSection from '../../components/LegalSection.jsx'

export default function Refunds() {
  return (
    <LegalPage title="Ventas y reembolsos" updated="octubre 2026">
      <p>
        Queremos que estés conforme con tu compra. Estas son nuestras condiciones de venta, cambios y devoluciones.
      </p>
      <LegalSection title="1. Botón de arrepentimiento">
        <p>
          Tenés 10 días corridos desde que recibís el producto para revocar la compra, sin necesidad de justificar el motivo, según la Ley 24.240 de Defensa del Consumidor.
        </p>
      </LegalSection>
      <LegalSection title="2. Condiciones de devolución">
        <ul className="my-2 list-disc pl-5">
          <li>El producto debe estar en su empaque original y sin uso.</li>
          <li>Debe incluir todos sus accesorios, manuales y factura.</li>
          <li>Los discos y equipos con sellos de garantía no deben estar abiertos.</li>
        </ul>
      </LegalSection>
      <LegalSection title="3. Garantía">
        <p>
          Todos los productos cuentan con garantía oficial del fabricante. Ante una falla, contactanos y gestionamos el proceso por vos.
        </p>
      </LegalSection>
      <LegalSection title="4. Reembolsos">
        <p>
          Una vez recibido y revisado el producto, el reembolso se acredita por el mismo medio de pago dentro de los 10 días hábiles.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
