import { get, deletes } from "./service.js";

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
  document.getElementById("content").innerHTML = ""; 
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);

  if(pathname == "/users"){
    renderUsers();
  }

  if (pathname == "/newuser") {
    const { setupNewUser } = await import("./newuser.js");
    setupNewUser(); // Ejecuta la función para inicializar el formulario
  }

  if(pathname == "/edituser"){
    const ulrParams = new URLSearchParams(window.location.search);
    const userId = ulrParams.get("id");
    const { setupEditUser } = await import("./edituser.js");
    setupEditUser(userId);
  }

    if (pathname == "/login") {
    const form = document.getElementById("login-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = form.username.value.trim();
        const password = form.password.value.trim();

        // Aquí se puede validar contra una lista fija o desde localStorage
        if (username === "admin" && password === "admin123") {
          localStorage.setItem("loggedUser", JSON.stringify({ username }));
          alert("✅ Sesión iniciada");
          navigate("/users");
        } else {
          alert("❌ Credenciales incorrectas");
        }
      });
    }
  }
}

window.addEventListener("popstate", () =>
  navigate(location.pathname)
);

async function renderUsers(){
  const containeUsers = document.getElementById("container-users");
  containeUsers.innerHTML = '';

  let userData = await get(urlUsers);
  userData.forEach(user => {
    containeUsers.innerHTML += `
    <div class="container-data" style="border:black 2px solid">
    <p> <strong style="color: red">Nombre:</strong> ${user.name}</p>
    <p> <strong style="color: red">Email:</strong> ${user.email}</p>
    <p> <strong style="color: red">Celular:</strong> ${user.phone}</p>
    <p> <strong style="color: red">Número de inscripción:</strong> ${user.enrollNumber}</p>
    <p> <strong style="color: red">Fecha de admision:</strong> ${user.dateOfAdmission}</p>
    <button class="edit-btn" data-id=${user.id}>Editar</button>
    <button class="delete-btn" data-id=${user.id}>Delete</button>
    </div>`
  });
  console.log(userData);
}

document.getElementById("content").addEventListener("click", async (e)=>{
  if (e.target.matches(".delete-btn")) {
    e.preventDefault();
    const id = e.target.dataset.id;
    if(confirm("Estas seguro que quieres eliminar este usuario?")){
      try {
        const deleted = await deletes(urlUsers, id);
        if (deleted){
          alert("Usuario eliminado con exito");
          renderUsers();
        }else{
          alert("No se pudo eliminar el usuario.")
        }
      } catch (error) {
        console.error("Error al intentar eliminar el usuario:", error);
        alert("No se pudo eliminar el usuario.")
      }
    }
  }else if(e.target.matches(".edit-btn")){
    e.preventDefault();
    const id = e.target.dataset.id;
    const { setupEditUser } = await import("./edituser.js");
    setupEditUser(id); // Llama al formulario dinámico
  }
})