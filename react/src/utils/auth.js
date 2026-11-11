// Autenticación sin React: leer y guardar usuarios y sesión en localStorage.
// Las claves y el formato de los datos son los de la versión simple, para no perder cuentas existentes.

export const USERS_KEY = 'terrabyte-users'
export const SESSION_KEY = 'terrabyte-session'

function parsearSesion(raw) {
  try {
    const sesion = JSON.parse(raw || 'null')
    if (!sesion || typeof sesion.email !== 'string' || !sesion.email.trim()) return null
    return {
      email: sesion.email,
      firstName: typeof sesion.firstName === 'string' ? sesion.firstName : '',
      lastName: typeof sesion.lastName === 'string' ? sesion.lastName : '',
      signedInAt: sesion.signedInAt,
    }
  } catch {
    return null
  }
}

export function leerSesion() {
  try {
    return parsearSesion(localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

function leerUsuarios() {
  let usuarios
  try {
    usuarios = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    throw new Error('No se pudieron leer las cuentas. Revisá el almacenamiento del navegador.')
  }
  if (!Array.isArray(usuarios)) throw new Error('Los datos de las cuentas no son válidos.')
  const danado = usuarios.some((usuario) => !usuario || typeof usuario.email !== 'string' || !usuario.email.trim()
    || typeof usuario.salt !== 'string' || !/^[a-f\d]{32}$/i.test(usuario.salt)
    || typeof usuario.passwordHash !== 'string' || !/^[a-f\d]{64}$/i.test(usuario.passwordHash))
  if (danado) throw new Error('Los datos de las cuentas están dañados. No se modificaron las cuentas guardadas.')
  return usuarios
}

function requerirCrypto() {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) {
    throw new Error('Abrí el sitio desde localhost o HTTPS para habilitar el inicio de sesión seguro.')
  }
}

function aHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function hashearContrasena(contrasena, sal) {
  const clave = await crypto.subtle.importKey('raw', new TextEncoder().encode(contrasena), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: sal, iterations: 210000, hash: 'SHA-256' }, clave, 256)
  return aHex(new Uint8Array(bits))
}

function guardarSesion(usuario) {
  const sesion = { email: usuario.email, firstName: usuario.firstName || '', lastName: usuario.lastName || '', signedInAt: new Date().toISOString() }
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sesion))
  } catch {
    throw new Error('No se pudo iniciar sesión. Revisá el almacenamiento del navegador.')
  }
  return sesion
}

export function borrarSesion() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    throw new Error('No se pudo cerrar sesión. Revisá el almacenamiento del navegador.')
  }
}

// Verifica el correo y la contraseña, guarda la sesión y la devuelve.
export async function autenticarUsuario({ email, password }) {
  requerirCrypto()
  const correo = String(email || '').trim().toLowerCase()
  if (!correo || typeof password !== 'string' || !password) throw new Error('Completá el correo y la contraseña.')
  const usuario = leerUsuarios().find((entry) => entry.email.toLowerCase() === correo)
  if (!usuario) throw new Error('No encontramos una cuenta con ese correo.')
  const sal = new Uint8Array(usuario.salt.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)))
  const hash = await hashearContrasena(password, sal)
  if (hash !== usuario.passwordHash.toLowerCase()) throw new Error('La contraseña no es correcta.')
  return guardarSesion(usuario)
}

// Valida los datos, crea la cuenta, inicia sesión y devuelve la sesión.
export async function crearUsuario({ firstName, lastName, email, password, confirmation, terms }) {
  requerirCrypto()
  const correo = String(email || '').trim().toLowerCase()
  const nombre = String(firstName || '').trim()
  const apellido = String(lastName || '').trim()
  if (!nombre || !apellido || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) throw new Error('Completá tu nombre, apellido y un correo válido.')
  if (typeof password !== 'string' || password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres.')
  if (password !== confirmation) throw new Error('Las contraseñas no coinciden.')
  if (!terms) throw new Error('Aceptá los términos y condiciones para crear tu cuenta.')
  const yaExiste = (usuarios) => usuarios.some((usuario) => usuario.email.toLowerCase() === correo)
  if (yaExiste(leerUsuarios())) throw new Error('Ya existe una cuenta con ese correo.')
  const sal = crypto.getRandomValues(new Uint8Array(16))
  const usuario = { firstName: nombre, lastName: apellido, email: correo, salt: aHex(sal), passwordHash: await hashearContrasena(password, sal) }
  // Se vuelve a leer después del hash: pudo crearse otra cuenta mientras se calculaba.
  const usuarios = leerUsuarios()
  if (yaExiste(usuarios)) throw new Error('Ya existe una cuenta con ese correo.')
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify([...usuarios, usuario]))
  } catch {
    throw new Error('No se pudo crear la cuenta. Revisá el almacenamiento del navegador.')
  }
  try {
    return guardarSesion(usuario)
  } catch {
    throw new Error('La cuenta fue creada, pero no se pudo iniciar sesión. Intentá ingresar desde la página de acceso.')
  }
}
