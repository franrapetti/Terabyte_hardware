const usersStorageKey = "terrabyte-users";
const sessionStorageKey = "terrabyte-session";
const encoder = new TextEncoder();

// Lee la lista de usuarios guardada y devuelve una lista vacia si no es valida.
function readUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(usersStorageKey) || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

// Lee la sesion actual y devuelve null si no hay una sesion valida.
function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(sessionStorageKey) || "null");
    return session && typeof session.email === "string" ? session : null;
  } catch {
    return null;
  }
}

// Muestra un mensaje en el formulario y marca si es un error o un exito.
function showMessage(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.dataset.state = isError ? "error" : "success";
}

// Dibuja enlaces de acceso o el saludo y boton de cierre segun la sesion.
function renderAccountLinks() {
  const accountLinks = document.querySelector(".nav-account-links");
  if (!accountLinks) return;

  const session = readSession();
  accountLinks.replaceChildren();

  if (!session) {
    const loginLink = document.createElement("a");
    loginLink.className = "nav-account-link";
    loginLink.href = "./login.html";
    loginLink.textContent = "Ingresar";

    const registerLink = document.createElement("a");
    registerLink.className = "nav-account-link";
    registerLink.href = "./register.html";
    registerLink.textContent = "Registrarse";

    accountLinks.append(loginLink, registerLink);
    return;
  }

  const greeting = document.createElement("span");
  greeting.className = "nav-account-link nav-account-greeting";
  greeting.textContent = `Hola, ${session.firstName || session.email}`;
  greeting.title = session.email;

  const logoutButton = document.createElement("button");
  logoutButton.className = "nav-account-link nav-logout";
  logoutButton.type = "button";
  logoutButton.textContent = "Cerrar sesión";
  // Elimina la sesion activa, actualiza el menu y vuelve al inicio.
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem(sessionStorageKey);
    renderAccountLinks();
    window.location.href = "./home.html";
  });

  accountLinks.append(greeting, logoutButton);
}

// Genera un hash PBKDF2 de la contrasena usando la sal recibida.
async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 210000, hash: "SHA-256" },
    key,
    256,
  );
  return Array.from(
    new Uint8Array(bits),
    // Convierte cada byte del hash a dos caracteres hexadecimales.
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
}

// Convierte bytes a texto hexadecimal para poder guardarlos.
function bytesToHex(bytes) {
  return Array.from(
    bytes,
    // Convierte cada byte a dos caracteres hexadecimales.
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
}

// Convierte texto hexadecimal a bytes para volver a usar la sal.
function hexToBytes(hex) {
  return new Uint8Array(
    hex.match(/.{2}/g).map(
      // Convierte cada par hexadecimal en un numero de byte.
      (byte) => Number.parseInt(byte, 16),
    ),
  );
}

// Guarda en localStorage los datos publicos de la sesion iniciada.
function storeSession(user) {
  const session = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    signedInAt: new Date().toISOString(),
  };
  localStorage.setItem(sessionStorageKey, JSON.stringify(session));
}

// Comprueba que el navegador permita usar las funciones criptograficas seguras.
function canUseSecureCrypto(messageElement) {
  if (crypto?.subtle && crypto?.getRandomValues) return true;
  showMessage(
    messageElement,
    "Abrí el sitio desde localhost o HTTPS para habilitar el inicio de sesión seguro.",
    true,
  );
  return false;
}

// Valida las credenciales ingresadas y crea una sesion si son correctas.
async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.getElementById("login-message");
  if (!canUseSecureCrypto(message)) return;

  const email = form.elements.email.value.trim().toLowerCase();
  const password = form.elements.password.value;
  const user = readUsers().find(
    // Busca el usuario cuyo correo coincide con el ingresado.
    (entry) => entry.email === email,
  );

  if (!user) {
    showMessage(message, "No encontramos una cuenta con ese correo.", true);
    return;
  }

  try {
    const passwordHash = await hashPassword(password, hexToBytes(user.salt));
    if (passwordHash !== user.passwordHash) {
      showMessage(message, "La contraseña no es correcta.", true);
      return;
    }

    storeSession(user);
    window.location.href = "./home.html";
  } catch {
    showMessage(message, "No se pudo iniciar sesión. Revisá el almacenamiento del navegador.", true);
  }
}

// Valida el formulario, guarda el nuevo usuario y comienza su sesion.
async function handleRegistration(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.getElementById("register-message");
  if (!canUseSecureCrypto(message)) return;

  const firstName = form.elements["first-name"].value.trim();
  const lastName = form.elements["last-name"].value.trim();
  const email = form.elements.email.value.trim().toLowerCase();
  const password = form.elements.password.value;
  const confirmation = form.elements["confirm-password"].value;

  if (password !== confirmation) {
    showMessage(message, "Las contraseñas no coinciden.", true);
    return;
  }

  const users = readUsers();
  if (
    users.some(
      // Comprueba si el correo ya esta asociado a una cuenta.
      (user) => user.email === email,
    )
  ) {
    showMessage(message, "Ya existe una cuenta con ese correo.", true);
    return;
  }

  try {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const user = {
      firstName,
      lastName,
      email,
      salt: bytesToHex(salt),
      passwordHash: await hashPassword(password, salt),
    };
    users.push(user);
    localStorage.setItem(usersStorageKey, JSON.stringify(users));
    storeSession(user);
    window.location.href = "./home.html";
  } catch {
    showMessage(message, "No se pudo crear la cuenta. Revisá el almacenamiento del navegador.", true);
  }
}

renderAccountLinks();
window.addEventListener("storage", renderAccountLinks);

document.getElementById("login-form")?.addEventListener("submit", handleLogin);
document.getElementById("register-form")?.addEventListener("submit", handleRegistration);