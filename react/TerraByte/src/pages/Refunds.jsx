import LegalPage from '../components/LegalPage.jsx'

export default function Refunds() {
  return (
    <LegalPage title="Ventas y reembolsos" updated="octubre 2026">
      <p>
        Queremos que estés conforme con tu compra. Estas son nuestras
        condiciones de venta, cambios y devoluciones.
      </p>
      <h2>1. Botón de arrepentimiento</h2>
      <p>
        Tenés 10 días corridos desde que recibís el producto para revocar la
        compra, sin necesidad de justificar el motivo, según la Ley 24.240
        de Defensa del Consumidor.
      </p>
      <h2>2. Condiciones de devolución</h2>
      <ul>
        <li>El producto debe estar en su empaque original y sin uso.</li>
        <li>Debe incluir todos sus accesorios, manuales y factura.</li>
        <li>Los discos y equipos con sellos de garantía no deben estar abiertos.</li>
      </ul>
      <h2>3. Garantía</h2>
      <p>
        Todos los productos cuentan con garantía oficial del fabricante. Ante
        una falla, contactanos y gestionamos el proceso por vos.
      </p>
      <h2>4. Reembolsos</h2>
      <p>
        Una vez recibido y revisado el producto, el reembolso se acredita por
        el mismo medio de pago dentro de los 10 días hábiles.
      </p>
    </LegalPage>
  )
}
