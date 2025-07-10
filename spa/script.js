import { setupNewUser } from "./newuser.js";
import { get, deletes } from "./service.js";

// URL base API
const urlUsers = "http://localhost:3000/usuarios";

// Rutas SPA
const routes = {
  "/": "./login.html",
  "/users": "./users.html",
  "/newuser": "./newuser.html",
  "/about": "./about.html",
};

// Navegación SPA: clic en enlaces con data-link
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.href);
  }
});

// Función para cargar vista según ruta
async function navigate(pathname) {
  const route = routes[pathname];
  if (!route) return;

  const html = await fetch(route).then((res) => res.text());
  history.pushState({}, "", pathname);

  if (pathname === "/") {
    // Login
    document.getElementById("app").style.display = "none";
    document.getElementById("login-content").innerHTML = html;
    setupLogin();
    return;
  }

  // Vista app
  document.getElementById("login-content").innerHTML = "";
  document.getElementById("app").style.display = "block";
  document.getElementById("content").innerHTML = html;

  if (pathname === "/users") {
    renderUsers();
  } else if (pathname === "/newuser") {
    setupNewUser();
  } else if (pathname === "/about") {
    setupAbout?.();
  }
}

// Renderizar usuarios en #users.html
async function renderUsers() {
  const container = document.getElementById("container-users");
  container.innerHTML = "";

  try {
    const users = await get(urlUsers);
    users.forEach((user) => {
      container.innerHTML += `
        <div class="container-data" style="border:black 2px solid; margin-bottom: 10px; padding: 10px;">
          <p><strong style="color: red">Nombre:</strong> ${user.name}</p>
          <p><strong style="color: red">Email:</strong> ${user.email}</p>
          <p><strong style="color: red">Celular:</strong> ${user.phone}</p>
          <p><strong style="color: red">Número de inscripción:</strong> ${user.enrollNumber}</p>
          <p><strong style="color: red">Fecha de admisión:</strong> ${user.dateOfAdmission}</p>
          <button class="edit-btn" data-id="${user.id}">Editar</button>
          <button class="delete-btn" data-id="${user.id}">Eliminar</button>
        </div>`;
    });
  } catch (error) {
    alert("Error al cargar usuarios.");
    console.error(error);
  }
}

// Manejo botones editar y eliminar usuarios (event delegation)
document.getElementById("content").addEventListener("click", async (e) => {
  if (e.target.matches(".delete-btn")) {
    const id = e.target.dataset.id;
    if (confirm("¿Estás seguro que quieres eliminar este usuario?")) {
      try {
        await deletes(urlUsers, id);
        alert("Usuario eliminado con éxito");
        renderUsers();
      } catch {
        alert("Error al eliminar usuario.");
      }
    }
  } else if (e.target.matches(".edit-btn")) {
    const id = e.target.dataset.id;
    setupEditUser(id);
  }
});

// Setup login: escucha submit form
function setupLogin() {
  const form = document.getElementById("login-form");
  const msg = document.getElementById("login-msg");
  msg.textContent = "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    try {
      const users = await get(urlUsers); // Asegúrate que URL sea correcta

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
        navigate("/users");
      } else {
        msg.textContent = "Correo o contraseña incorrectos";
      }
    } catch (error) {
      msg.textContent = "Error al iniciar sesión";
      console.error(error);
    }
  });
}

// Editar usuario - abre modal con datos y escucha submit
function setupEditUser(userId) {
  const modal = document.getElementById("edit-modal");
  const form = document.getElementById("edit-user-form");
  const msg = document.getElementById("edit-msg");
  msg.textContent = "";

  // Mostrar modal
  modal.classList.remove("hidden");

  // Cerrar modal botón
  document.getElementById("close-modal").onclick = () => {
    modal.classList.add("hidden");
  };

  // Cargar datos usuario para editar
  get(`${urlUsers}/${userId}`).then(user => {
    form.name.value = user.name;
    form.email.value = user.email;
    form.phone.value = user.phone;
    form.enrollNumber.value = user.enrollNumber;
    form.dateOfAdmission.value = user.dateOfAdmission;
  });

  form.onsubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      enrollNumber: form.enrollNumber.value.trim(),
      dateOfAdmission: form.dateOfAdmission.value,
    };
    try {
      await fetch(`${urlUsers}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      alert("Usuario actualizado");
      modal.classList.add("hidden");
      renderUsers();
    } catch {
      msg.textContent = "Error al actualizar usuario";
    }
  };
}

// Controlar navegación con botones atras/adelante del navegador
window.addEventListener("popstate", () => {
  navigate(location.pathname);
});

// Al cargar la app
const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
if (loggedUser) {
  navigate("/users");
} else {
  navigate("/");
}
document.addEventListener("click", (e) => {
  if (e.target.id === "logout-btn") {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("loggedUser");
        navigate("/");
      }
    });
  }
});
