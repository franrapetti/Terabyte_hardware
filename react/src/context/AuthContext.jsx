import { useMemo, useSyncExternalStore } from 'react'

export const USERS_KEY = 'terrabyte-users'
export const SESSION_KEY = 'terrabyte-session'
const changeEvent = 'terrabyte-auth-change'

function sessionSnapshot() {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

function parseSession(raw) {
  try {
    const session = JSON.parse(raw || 'null')
    if (!session || typeof session.email !== 'string' || !session.email.trim()) return null
    return { email: session.email, firstName: typeof session.firstName === 'string' ? session.firstName : '', lastName: typeof session.lastName === 'string' ? session.lastName : '', signedInAt: session.signedInAt }
  } catch {
    return null
  }
}

export function readSession() {
  return parseSession(sessionSnapshot())
}

function readUsers() {
  let users
  try {
    users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    throw new Error('No se pudieron leer las cuentas. Revisá el almacenamiento del navegador.')
  }
  if (!Array.isArray(users)) throw new Error('Los datos de las cuentas no son válidos.')
  if (users.some((user) => !user || typeof user.email !== 'string' || !user.email.trim() || typeof user.salt !== 'string' || !/^[a-f\d]{32}$/i.test(user.salt) || typeof user.passwordHash !== 'string' || !/^[a-f\d]{64}$/i.test(user.passwordHash))) {
    throw new Error('Los datos de las cuentas están dañados. No se modificaron las cuentas guardadas.')
  }
  return users
}

function requireCrypto() {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) throw new Error('Abrí el sitio desde localhost o HTTPS para habilitar el inicio de sesión seguro.')
}

function toHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 210000, hash: 'SHA-256' }, key, 256)
  return toHex(new Uint8Array(bits))
}

function storeSession(user) {
  const session = { email: user.email, firstName: user.firstName || '', lastName: user.lastName || '', signedInAt: new Date().toISOString() }
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    throw new Error('No se pudo iniciar sesión. Revisá el almacenamiento del navegador.')
  }
  window.dispatchEvent(new Event(changeEvent))
  return session
}

export async function loginUser({ email, password }, { signal } = {}) {
  requireCrypto()
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail || typeof password !== 'string' || !password) throw new Error('Completá el correo y la contraseña.')
  const user = readUsers().find((entry) => entry.email.toLowerCase() === normalizedEmail)
  if (!user) throw new Error('No encontramos una cuenta con ese correo.')
  const salt = new Uint8Array(user.salt.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)))
  const hash = await hashPassword(password, salt)
  signal?.throwIfAborted()
  if (hash !== user.passwordHash.toLowerCase()) throw new Error('La contraseña no es correcta.')
  return storeSession(user)
}

export async function registerUser({ firstName, lastName, email, password, confirmation, terms }, { signal } = {}) {
  requireCrypto()
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const first = String(firstName || '').trim()
  const last = String(lastName || '').trim()
  if (!first || !last || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) throw new Error('Completá tu nombre, apellido y un correo válido.')
  if (typeof password !== 'string' || password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres.')
  if (password !== confirmation) throw new Error('Las contraseñas no coinciden.')
  if (!terms) throw new Error('Aceptá los términos y condiciones para crear tu cuenta.')
  const alreadyExists = (users) => users.some((user) => user.email.toLowerCase() === normalizedEmail)
  if (alreadyExists(readUsers())) throw new Error('Ya existe una cuenta con ese correo.')
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const user = { firstName: first, lastName: last, email: normalizedEmail, salt: toHex(salt), passwordHash: await hashPassword(password, salt) }
  signal?.throwIfAborted()
  // Volver a leer después del hash evita perder registros creados mientras se calculaba.
  const users = readUsers()
  if (alreadyExists(users)) throw new Error('Ya existe una cuenta con ese correo.')
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
  } catch {
    throw new Error('No se pudo crear la cuenta. Revisá el almacenamiento del navegador.')
  }
  try {
    return storeSession(user)
  } catch {
    throw new Error('La cuenta fue creada, pero no se pudo iniciar sesión. Intentá ingresar desde la página de acceso.')
  }
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    throw new Error('No se pudo cerrar sesión. Revisá el almacenamiento del navegador.')
  }
  window.dispatchEvent(new Event(changeEvent))
}

function subscribe(listener) {
  const onStorage = (event) => {
    if (event.key === SESSION_KEY || event.key === null) listener()
  }
  window.addEventListener(changeEvent, listener)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(changeEvent, listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useAuth() {
  const raw = useSyncExternalStore(subscribe, sessionSnapshot, () => null)
  return useMemo(() => parseSession(raw), [raw])
}
