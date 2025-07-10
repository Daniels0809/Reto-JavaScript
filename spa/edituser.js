import { get, update } from "./service.js";

const urlUsers = "http://localhost:3000/Usuarios";

export async function setupEditUser(userId) {
  const modal = document.getElementById("edit-modal");
  const form = document.getElementById("edit-user-form");
  const msg = document.getElementById("edit-msg");
  const closeBtn = document.getElementById("close-modal");

  // Mostrar modal
  modal.classList.remove("hidden");

  // Cargar datos del usuario
  const user = await get(`${urlUsers}/${userId}`);
  form.name.value = user.name;
  form.email.value = user.email;
  form.phone.value = user.phone;
  form.enrollNumber.value = user.enrollNumber;
  form.dateOfAdmission.value = user.dateOfAdmission;

  // Evento para cerrar modal
  closeBtn.onclick = () => {
    modal.classList.add("hidden");
    msg.textContent = "";
    form.reset();
  };

  // Evento para editar usuario
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
      await update(urlUsers, userId, updatedUser);
      msg.textContent = "✅ Usuario actualizado exitosamente";
      msg.style.color = "green";

    setTimeout(() => {
      modal.classList.add("hidden");
      msg.textContent = "";
      form.reset();
      window.history.pushState({}, "", "/users");
      document.getElementById("content").innerHTML = "";
      import("./script.js").then(mod => mod.navigate("/users"));
    }, 1000);


    } catch (error) {
      console.error("Error actualizando:", error);
      msg.textContent = "❌ Hubo un error al actualizar";
      msg.style.color = "red";
    }
  };
}
