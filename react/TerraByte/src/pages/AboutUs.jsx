import InfoSection from '../components/InfoSection.jsx'

export default function AboutUs() {
  return (
    <main className="mx-auto grid w-full max-w-[76rem] flex-1 gap-8 p-[clamp(1.25rem,4vw,3rem)] text-left text-[clamp(0.95rem,1.5vw,1rem)] leading-[1.6] text-[#273137] max-[700px]:gap-4 dark:text-[#d9d9d9] [&_h1]:text-[#273137] [&_h2]:text-[#273137] dark:[&_h1]:text-white dark:[&_h2]:text-white">
      <title>Nosotros | TerraByte</title>
      <InfoSection title="Somos TerraByte" headingLevel={1}>
        <p>
          Somos una empresa familiar fundada en el año 2026. Nuestro primer
          capital invertido constaba de esfuerzo, trabajo y ganas de superarnos,
          con la esperanza de crear una estructura sólida que nos permitiera
          hacer frente a los distintos desafíos que se venían por delante.
          <br />
          <br />
          Iniciamos ofreciendo servicio técnico para computadoras desde el
          garaje de una casa. Con el pasar del tiempo fuimos incorporando
          productos para su comercialización, lo que nos llevó a ampliar
          nuestras instalaciones de ventas, consiguiendo dar apertura a nuestro
          primer local comercial.
          <br />
          <br />
          Apoyados en alianzas estratégicas con las principales marcas
          tecnológicas, nos fuimos volviendo referentes del mercado,
          incorporando variedad a nuestra oferta con el objetivo de trasladar a
          nuestros clientes la excelencia, calidad, innovación y vanguardia que
          nos exigimos en cada paso que damos.
          <br />
          <br />
          Al día de hoy somos partners oficiales de más de 20 marcas
          internacionales. Contamos con un equipo en constante crecimiento, un
          sitio web con más de 2 categorías de producto a la venta y múltiples
          puntos de retiro distribuidos a lo largo del país.
          <br />
          Somos lo que querés, cuando querés, donde querés. Somos TerraByte
        </p>
      </InfoSection>

      <div className="grid w-full grid-cols-3 gap-5 max-[1000px]:grid-cols-2 max-[1000px]:[&>section:last-child]:col-span-full max-[700px]:grid-cols-1">
        <InfoSection title="Visión">
          <p>
            Ser la empresa líder en el mercado de tecnología, ofreciendo
            productos y servicios de alta calidad, con un enfoque en la
            satisfacción del cliente y la innovación constante.
          </p>
        </InfoSection>
        <InfoSection title="Misión">
          <p>
            Brindar soluciones tecnológicas integrales a nuestros clientes, a
            través de la venta de productos de última generación y servicios
            especializados, fomentando la confianza y fidelidad de nuestros
            clientes.
          </p>
        </InfoSection>
        <InfoSection title="Valores">
          <ul className="flex list-disc flex-col gap-2 pl-6 max-[480px]:pl-[1.15rem]">
            <li>
              Compromiso con la calidad y la excelencia en todo lo que hacemos.
            </li>
            <li>
              Innovación constante para ofrecer soluciones tecnológicas de
              vanguardia.
            </li>
            <li>Responsabilidad social y ambiental en nuestras operaciones.</li>
            <li>
              Trabajo en equipo y colaboración para lograr objetivos comunes.
            </li>
            <li>
              Integridad y ética en todas nuestras relaciones comerciales.
            </li>
          </ul>
        </InfoSection>
      </div>
    </main>
  )
}
