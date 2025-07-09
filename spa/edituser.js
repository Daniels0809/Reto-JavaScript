import { get, update } from "./service.js";

const urlUsers = "http://localhost:3000/Usuarios";

export async function setupEditUser(userId) {
    const form = document.getElementById("edit-user-form");

    const user = await get(`${urlUsers}/${userId}`);

    form.name.value = user.name;
    form.email.value = user.email;
    form.phone.value = user.phone;
    form.enrollNumber.value = user.enrollNumber;
    form.dateOfAdmission.value = user.dateOfAdmission;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedUser = {
            name:form.name.value,
            email:form.email.value,
            phone:form.phone.value,
            enrollNumber:form.enrollNumber.value,
            dateOfAdmission:form.dateOfAdmission.value
        };
        try {
            await update(urlUsers, userId, updatedUser);
            navigate("/users")
        } catch (error) {
           console.log("Error al actualizar el susuario:", error);
           alert("Hubo un error al actualizar el usuario. Intentalo de nuevo.")
        }
        

        window.history.pushState({},"", "/users");
        document.getElementById("content").innerHTML = "";
    });

}