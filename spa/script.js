
import { get } from "./service.js";

const urlUsers = "http://localhost:3000/Usuarios";

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

  if(pathname == "/users"){
    renderUsers();
  }

  if (pathname === "/newuser") {
    const { setupNewUser } = await import("./newuser.js");
    setupNewUser(); // Ejecuta la función para inicializar el formulario
  }
}

window.addEventListener("popstate", () =>
  navigate(location.pathname)
);

async function renderUsers(){
  const containeUsers = document.getElementById("container-users");
  // containeUsers.innerHTML = `<p>Hola</p>`

  let userData = await get(urlUsers);
  userData.forEach(user => {
    containeUsers.innerHTML += `
    <div class="container-data" style="border:black 2px solid">
    <p> <strong style="color: red">Nombre:</strong> ${user.name}</p>
    <p> <strong style="color: red">Email:</strong> ${user.email}</p>
    <p> <strong style="color: red">Celular:</strong> ${user.phone}</p>
    <p> <strong style="color: red">Número de inscripción:</strong> ${user.enrollNumber}</p>
    <p> <strong style="color: red">Fecha de admision:</strong> ${user.dateOfAdmission}</p>
    </div> `
  });
  console.log(userData);
}

