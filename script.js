import { get } from "./service"; // Verifica la ruta correcta

const routes = {
  "/": "./users.html",
  "/users": "./users.html",
  "/newuser": "./newuser.html",
  "/about": "./about.html",
};

document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  }
});

async function navigate(pathname) {
  const route = routes[pathname];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);

  // Solo cargamos los usuarios en la página de usuarios o en la raíz
  if (pathname === "/users" || pathname === "/") {
    loadUsers();
  }
}

window.addEventListener("popstate", () => navigate(location.pathname));

async function loadUsers() {
  try {
    const data = await get("http://localhost:3000/Usuarios");
    // const users = await data.json();
    
    console.log(users); // Esto te ayudará a ver los datos en la consola

    const container = document.getElementById("user-list");
    if (!container) return;

    container.innerHTML = ""; // Limpiar contenedor antes de agregar nuevos elementos

    users.map((user) => {
      const userDiv = document.createElement("div");
      userDiv.innerHTML = `
        <h3>${user.name}</h3>
        <p>Email: ${user.email}</p>
        <p>Telefono: ${user.phone}</p>
        <p>Matricula: ${user.enrollNumber}</p>
        <p>Fecha de ingreso: ${user.dateOfAdmission}</p>
      `;
      container.appendChild(userDiv);
    });
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
  }
}


// Cargar la página actual al cargar
navigate(location.pathname);
