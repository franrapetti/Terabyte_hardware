import { test, expect } from '@playwright/test'

const CART = 'terrabyte-cart'
const USERS = 'terrabyte-users'
const cartData = [{ id: 'nas', nombre: 'NAS de prueba', precio: '$1.200,50', cantidad: 2, tipo: 'Producto' }]

async function seed(page, entries) {
  await page.addInitScript((values) => {
    for (const [key, value] of Object.entries(values)) {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify(value))
    }
  }, entries)
}

async function fillRegister(page, email = 'lucia@example.com') {
  await page.getByLabel('Nombre', { exact: true }).fill('Lucía')
  await page.getByLabel('Apellido', { exact: true }).fill('Gómez')
  await page.getByLabel('Correo electrónico', { exact: true }).fill(email)
  await page.getByLabel('Contraseña', { exact: true }).fill('Prueba123!')
  await page.getByLabel('Repetir contraseña', { exact: true }).fill('Prueba123!')
  await page.locator('input[name="terms"]').check()
}

// Evitar que las fuentes externas afecten la reproducibilidad de estas pruebas.
test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort())
})

test('carrito: cantidades, persistencia, confirmaciones y compra simulada', async ({ page }) => {
  await page.goto('/products')
  await page.getByRole('button', { name: 'Ver Más', exact: true }).first().click()
  await expect(page.getByRole('dialog')).toContainText('Detalle del producto')
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Agregar al carrito', exact: true }).first().click()
  await page.getByRole('button', { name: 'Ir al carrito', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Carrito')
  await expect(page.locator('main')).toHaveCSS('max-width', '1152px')
  const plus = page.getByRole('button', { name: /^Sumar una unidad/ })
  await plus.click()
  await expect(page.getByRole('link', { name: 'Carrito, 2 artículos' })).toBeVisible()
  await expect(plus).toHaveCSS('padding-top', '4px')
  await page.reload()
  await expect(page.locator('main')).toContainText('$3.338.000')
  await page.getByRole('button', { name: 'Vaciar carrito', exact: true }).click()
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
  await expect(page.locator('main article')).toHaveCount(1)
  await page.getByRole('button', { name: 'Finalizar compra', exact: true }).click()
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('¡Gracias por tu compra!')
  await page.getByRole('button', { name: 'Entendido', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Finalizar compra', exact: true })).toBeDisabled()
  await expect(page.locator('main article')).toHaveCount(0)
})

test('carrito: datos antiguos inválidos, claves repetidas y cantidades cero', async ({ page }) => {
  await seed(page, { [CART]: [
    { ...cartData[0], imagen: {}, tipo: { invalido: true } },
    { ...cartData[0], nombre: 'Otro NAS', cantidad: 1 },
    { ...cartData[0], id: 'cero', cantidad: 0 }, null,
  ] })
  await page.goto('/cart')
  await expect(page.locator('main article')).toHaveCount(2)
  await expect(page.locator('main')).toContainText('$3.601,5')
  await page.getByRole('button', { name: 'Quitar', exact: true }).first().click()
  await expect(page.locator('main article')).toHaveCount(1)
  await expect(page.locator('main')).toContainText('Otro NAS')
  await page.getByRole('button', { name: /^Restar una unidad/ }).click()
  await expect(page.locator('main article')).toHaveCount(0)
})

test('carrito y búsqueda: filtros combinados, cambios entre pestañas y almacenamiento bloqueado', async ({ page, context }) => {
  await page.goto('/products.html?q=ugreen')
  await expect(page.locator('main article')).toHaveCount(2)
  await page.getByRole('radio', { name: 'QNAP', exact: true }).check()
  await expect(page.getByRole('status')).toContainText('No encontramos productos')
  await page.getByRole('searchbox').fill('qnap')
  await expect(page.locator('main article')).toHaveCount(2)
  const other = await context.newPage()
  await other.goto('/cart')
  await page.getByRole('button', { name: 'Agregar al carrito', exact: true }).first().click()
  await expect(other.locator('main article')).toHaveCount(1)
  await page.keyboard.press('Escape')
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('quota') } })
  await page.getByRole('button', { name: 'Agregar al carrito', exact: true }).first().click()
  await expect(page.getByRole('dialog')).toContainText('No se pudo agregar el producto')
  await expect(other.getByRole('link', { name: 'Carrito, 1 artículos' })).toBeVisible()
})

test('NAS: validación, múltiples discos, navegación y agrupación de configuraciones', async ({ page }) => {
  await page.goto('/services')
  for (let index = 0; index < 6; index++) await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('button', { name: 'Agregar al carrito', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('Configuración incompleta')
  await page.keyboard.press('Escape')
  await page.getByRole('radio', { name: 'TrueNAS Gratis', exact: true }).check()
  await page.getByRole('button', { name: 'Anterior', exact: true }).click()
  await page.getByRole('button', { name: 'Anterior', exact: true }).click()
  await page.getByRole('checkbox', { name: 'SSD NAS 1TB $80.000', exact: true }).check()
  await page.getByRole('checkbox', { name: 'HDD NAS 4TB $90.000', exact: true }).check()
  await page.getByRole('button', { name: 'Anterior', exact: true }).click()
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
  await expect(page.locator('main input:checked')).toHaveCount(2)
  for (let index = 0; index < 2; index++) await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
  await page.getByRole('button', { name: 'Agregar al carrito', exact: true }).click()
  await page.getByRole('button', { name: 'Seguir configurando', exact: true }).click()
  await page.getByRole('button', { name: 'Agregar al carrito', exact: true }).click()
  await page.getByRole('button', { name: 'Ir al carrito', exact: true }).click()
  await expect(page.locator('main article')).toHaveCount(1)
  await expect(page.locator('main')).toContainText('$340.000')
})

test('autenticación: registro, duplicados, hash, persistencia, login y logout entre pestañas', async ({ page, context }) => {
  await page.goto('/register')
  await fillRegister(page)
  await page.getByLabel('Repetir contraseña', { exact: true }).fill('Distinta123!')
  await page.getByRole('button', { name: 'Crear mi cuenta', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveText('Las contraseñas no coinciden.')
  await page.getByLabel('Repetir contraseña', { exact: true }).fill('Prueba123!')
  await page.getByRole('button', { name: 'Crear mi cuenta', exact: true }).click()
  await expect(page).toHaveURL('/')
  const data = await page.evaluate(() => ({ users: JSON.parse(localStorage.getItem('terrabyte-users')), session: JSON.parse(localStorage.getItem('terrabyte-session')) }))
  expect(data.users[0].passwordHash).toMatch(/^[a-f\d]{64}$/)
  expect(data.users[0].salt).toMatch(/^[a-f\d]{32}$/)
  expect(JSON.stringify(data)).not.toContain('Prueba123!')
  expect(data.session).not.toHaveProperty('passwordHash')
  await page.reload()
  await expect(page.locator('header')).toContainText('Hola, Lucía')
  const other = await context.newPage()
  await other.goto('/cart')
  await page.getByRole('button', { name: 'Cerrar sesión', exact: true }).click()
  await expect(other.getByRole('link', { name: 'Ingresar', exact: true })).toBeVisible()
  await page.goto('/register')
  await fillRegister(page)
  await page.getByRole('button', { name: 'Crear mi cuenta', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Ya existe una cuenta')
  await page.goto('/login.html')
  await page.getByLabel('Correo electrónico', { exact: true }).fill('LUCIA@example.com')
  await page.getByLabel('Contraseña', { exact: true }).fill('Incorrecta123!')
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('La contraseña no es correcta.')
  await page.getByLabel('Contraseña', { exact: true }).fill('Prueba123!')
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click()
  await expect(page).toHaveURL('/')
})

test('autenticación: no sobrescribe cuentas dañadas ni completa registros abandonados', async ({ page }) => {
  await seed(page, { [USERS]: [null] })
  await page.goto('/register')
  await fillRegister(page)
  await page.getByRole('button', { name: 'Crear mi cuenta', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('cuentas están dañados')
  expect(await page.evaluate(() => localStorage.getItem('terrabyte-users'))).toBe('[null]')
  await page.evaluate(() => localStorage.setItem('terrabyte-users', '[]'))
  await page.evaluate(() => {
    const derive = crypto.subtle.deriveBits.bind(crypto.subtle)
    crypto.subtle.deriveBits = (...args) => new Promise((resolve) => {
      window.releaseHash = () => derive(...args).then(resolve)
    })
  })
  await page.getByRole('button', { name: 'Crear mi cuenta', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Creando cuenta…', exact: true })).toBeDisabled()
  await page.locator('header').getByRole('link', { name: 'Productos', exact: true }).click()
  await page.evaluate(async () => { await window.releaseHash(); await new Promise(requestAnimationFrame) })
  expect(await page.evaluate(() => localStorage.getItem('terrabyte-session'))).toBeNull()
  expect(await page.evaluate(() => localStorage.getItem('terrabyte-users'))).toBe('[]')
  await expect(page).toHaveURL('/products')
})

test('tema: preferencia inicial antes de React, persistencia y sincronización sin almacenamiento', async ({ page, context }) => {
  await page.addInitScript(() => localStorage.setItem('terrabyte-theme', 'light'))
  await page.route('**/src/main.jsx', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light')
  await page.unroute('**/src/main.jsx')
  await page.reload()
  const other = await context.newPage()
  await other.goto('/cart')
  await page.getByRole('button', { name: 'Cambiar a modo oscuro', exact: true }).click()
  await expect(other.locator('html')).toHaveAttribute('data-theme', 'dark')
  // Ya no reinicializar localStorage al recargar: la preferencia debe venir de la aplicación.
  await other.reload()
  await expect(other.locator('html')).toHaveAttribute('data-theme', 'dark')
  await other.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('blocked') } })
  await other.getByRole('button', { name: 'Cambiar a modo claro', exact: true }).click()
  await expect(other.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('diseño: doce páginas en ambos temas, móvil, tablet y escritorio', async ({ page }) => {
  test.setTimeout(120_000)
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  for (const width of [320, 768, 1360, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const theme of ['light', 'dark']) {
      if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('header button[aria-pressed]').click()
      for (const path of ['/', '/products', '/services', '/cart', '/login', '/register', '/aboutus', '/sitemap', '/terms', '/refunds', '/legal', '/privacy']) {
        await page.goto(path, { waitUntil: 'domcontentloaded' })
        await expect(page.locator('main')).toBeVisible()
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path}, ${width}px, ${theme}`).toBeTruthy()
        await expect(page.locator('header')).toHaveCSS('background-color', theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)')
        await expect(page.locator('footer')).toHaveCSS('background-color', theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)')
        if ((width === 1440 && theme === 'dark' && path === '/products') || (width === 320 && theme === 'light' && path === '/register')) {
          await test.info().attach(`vista-${width}-${theme}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
        }
      }
    }
  }
  expect(errors).toEqual([])
})

test('carrusel: teclado, pausa, ciclo y tarjetas accesibles tras ampliar la pantalla', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto('/tests/fixtures/carousel.html')
  const next = page.getByRole('button', { name: 'Siguiente', exact: true })
  await next.focus()
  await page.keyboard.press('Enter')
  await expect(next).toBeFocused()
  await expect(next).toHaveAttribute('aria-disabled', 'false')
  await expect(page.getByRole('button', { name: 'Producto 2', exact: true })).toBeVisible()
  await page.setViewportSize({ width: 1200, height: 800 })
  await expect(next).toBeDisabled()
  await expect(page.locator('[role="group"][inert]')).toHaveCount(0)
  await page.getByRole('button', { name: 'Producto 1', exact: true }).focus()
  await expect(page.getByRole('button', { name: 'Producto 1', exact: true })).toBeFocused()
  await page.setViewportSize({ width: 375, height: 800 })
  await page.getByRole('button', { name: 'Pausar carrusel', exact: true }).click()
  const track = page.locator('[id][style*="translateX"]')
  const transform = await track.evaluate((el) => getComputedStyle(el).transform)
  await page.mouse.move(0, 0)
  await page.getByRole('button', { name: 'Anterior', exact: true }).focus()
  await page.keyboard.press('Tab')
  await page.locator('body').click({ position: { x: 1, y: 1 } })
  await expect(track).toHaveCSS('transform', transform)
  await page.getByRole('button', { name: 'Reanudar carrusel', exact: true }).click()
  await page.getByRole('button', { name: 'Producto 2', exact: true }).focus()
  await page.locator('body').click({ position: { x: 1, y: 1 } })
  await page.mouse.move(0, 799)
  await expect.poll(async () => track.evaluate((el) => getComputedStyle(el).transform)).not.toBe(transform)
})

test('modal: Escape, foco, bloqueo de scroll y carrusel detenido mientras está abierto', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')
  const details = page.getByRole('button', { name: 'Ver Más', exact: true }).first()
  await details.click()
  const track = page.locator('[id][style*="translateX"]')
  const transform = await track.getAttribute('style')
  await page.clock.fastForward(9000)
  await expect(track).toHaveAttribute('style', transform)
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
  await page.keyboard.press('Escape')
  await expect(details).toBeFocused()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
})

test('movimiento reducido y encabezado con nombres largos en móvil', async ({ page }) => {
  await seed(page, { 'terrabyte-session': { email: 'correo-muy-largo@example.com', firstName: 'Un nombre de usuario muy largo para comprobar el encabezado' } })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [320, 375, 480, 1360]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Cerrar sesión', exact: true })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy()
  }
  await expect(page.getByRole('button', { name: 'Pausar carrusel', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
  await expect(page.locator('[id][style*="translateX"]')).toHaveCSS('transition-duration', '0s')
})
