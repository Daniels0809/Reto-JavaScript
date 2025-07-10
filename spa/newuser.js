import { post } from "./service.js";

export function setupNewUser() {
    const form = document.getElementById("new-user-form");
    const msg = document.getElementById("form-msg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newUser = {
            name: document.getElementById("name").value.trim(),
            enrollNumber: document.getElementById("enrollNumber").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value.trim(),
            dateOfAdmission: document.getElementById("dateOfAdmission").value,
            role: "user"
        }

        try {
            await post("http://localhost:3000/Usuarios", newUser);
            msg.textContent = "✅ Usuario agregado exitosamente";
            msg.style.color = "green";
            form.reset();
        
        } catch (err) {
            msg.textContent = "❌ Error al agregar usuario";
            msg.style.color = "red";
        }
    })
}

/** quiero hacer un spa con javascript vanilla que incluya solamente los concepto basicos que te voy a mencionar a continuacion:
enrutamiento
reactividad
manipulacion del DOM en tiempo real
multiples vistas
Pero no crees muchos archivos y no compliques la puta historia, hazlo y muestrame el paso a paso */