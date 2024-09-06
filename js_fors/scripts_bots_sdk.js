
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyADQWEULwBoqjl3XIraHjH6ofMRKzqcfJk",
    authDomain: "datosbots-8750f.firebaseapp.com",
    projectId: "datosbots-8750f",
    storageBucket: "datosbots-8750f.appspot.com",
    messagingSenderId: "97198607302",
    appId: "1:97198607302:web:e406c7262ced46d5a9c0c7"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Obtener el formulario
const clientForm = document.getElementById('clientForm');


// Función para mostrar el modal
function showModal(data) {
    const modal = document.getElementById('modal');
    document.getElementById('modalContent').innerHTML = `
        <h1>Confirmar Registro</h1>
        <hr>
        <div class="modal-section"><strong>Fecha y Hora de Registro:</strong> ${data.fecha_hora_registro_nuevo_cliente}</div>
        <div class="modal-section"><strong>Nombre Completo:</strong> ${data.nombreUsuario}</div>
        <div class="modal-section"><strong>Teléfono:</strong> ${data.numeroContacto}</div>
        <div class="modal-section"><strong>País:</strong> ${data.pais}</div>
        <hr>
        <div class="modal-section"><strong>Correo Electrónico:</strong> ${data.correoSolicitante}</div>
        <div class="modal-section"><strong>Contraseña:</strong> ${data.passwordVisas}</div>
        <hr>
        <div class="modal-section"><strong>Tipo de Trámite:</strong> ${data.tipo_tramite}</div>
        <div class="modal-section"><strong>Cantidad de Personas:</strong> ${data.cantidad_personas}</div>
        <div class="modal-section"><strong>Ubicación Consular:</strong> ${data.ubicacion_consular}</div>
        <div class="modal-section"><strong>Ubicación CAS:</strong> ${data.ubicacion_CAS}</div>
        <hr>
        <div class="modal-section"><strong>Notas Generales:</strong> ${data.address}</div>
        <hr>
        <button id="confirmButton">Confirmar Registro</button>
        <button id="modifyButton">Modificar</button>
        <button id="cancelButton">Cancelar</button>
    `;
    modal.style.display = 'block'; // Mostrar el modal

    // Asignar eventos a los botones
    document.getElementById('confirmButton').addEventListener('click', () => {
        // Enviar los datos y cerrar el modal
        saveData(data);
        modal.style.display = 'none';
    });
    document.getElementById('modifyButton').addEventListener('click', () => {
        // Ocultar el modal para que el usuario pueda modificar los datos
        modal.style.display = 'none';
    });
    document.getElementById('cancelButton').addEventListener('click', () => {
        // Ocultar el modal y cancelar la operación
        modal.style.display = 'none';
    });
}

// Función para guardar los datos en Firestore
async function saveData(data) {
    const docRef = doc(db, "usuarios", data.numeroContacto);
    try {
        await setDoc(docRef, data);
        alert('Registro almacenado exitosamente!');
        clientForm.reset();
        resetCalendars(); // Función para restablecer los valores del calendario
        document.getElementById('numeroContacto').focus();  // Opcional: colocar el cursor en el campo `numeroContacto`
        // Redirigir a otra página o sección
        window.location.href = "https://systems-idappsh.github.io/servicio/"; // Cambia esta URL por la URL de destino deseada
    } catch (e) {
        console.error("Error añadiendo o actualizando el documento: ", e);
        alert('Error al almacenar o actualizar el registro. Por favor, intente nuevamente.');
    }
}

// Agregar evento de submit para enviar los datos a Firestore
clientForm.addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevenir que se recargue la página

    // Obtener los valores del formulario
    const nombreUsuario = document.getElementById('nombreUsuario').value;
    const numeroContacto = document.getElementById('numeroContacto').value;
    const correoSolicitante = document.getElementById('correoSolicitante').value;
    const pais = document.getElementById('pais').value;
    const correoVisas = document.getElementById('correoVisas').value;
    const passwordVisas = document.getElementById('passwordVisas').value;
    const tipoTramite = document.getElementById('tipo_tramite').value;
    const cantidadPersonas = document.getElementById('cantidad_personas').value;
    const ubicacionConsular = document.getElementById('ubicacion_consular').value;
    const ubicacionCAS = document.getElementById('ubicacion_CAS').value;
    const address = document.getElementById('address').value;

    const data = {
        nombreUsuario,
        numeroContacto,
        correoSolicitante,
        pais,
        correoVisas,
        passwordVisas,
        tipo_tramite: tipoTramite,
        cantidad_personas: cantidadPersonas,
        ubicacion_consular: ubicacionConsular,
        ubicacion_CAS: ubicacionCAS,
        address,
        fecha_hora_registro_nuevo_cliente: new Date().toLocaleString() // Agregar fecha y hora de registro
    };

    // Obtener referencia al documento
    const docRef = doc(db, "usuarios", numeroContacto);

    // Verificar si el documento ya existe
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // Documento ya existe, mostrar información existente
            const existingData = docSnap.data();
            const existingMessage = `
                El número de contacto ya existe. Aquí están los datos existentes:
                \nNombre Usuario: ${existingData.nombreUsuario}
                \nCorreo Solicitante: ${existingData.correoSolicitante}
                \nNúmero de Contacto: ${existingData.numeroContacto}
                \nPaís: ${existingData.pais}
                \nCorreo Visas: ${existingData.correoVisas}
                \nPassword Visas: ${existingData.passwordVisas}
                \nTipo de Trámite: ${existingData.tipoTramite}
                \nCantidad de Personas: ${existingData.cantidadPersonas}
                \nUbicación Consular: ${existingData.ubicacionConsular}
                \nUbicación CAS: ${existingData.ubicacionCAS}
                \nDirección: ${existingData.address}
                \n\n¿Desea actualizar los datos con la nueva información?
            `;
            const userConfirmed = confirm(existingMessage);
            if (userConfirmed) {
                await setDoc(docRef, data);
                alert('Registro actualizado exitosamente!');
                clientForm.reset();
                resetCalendars(); // Restablecer calendarios
                document.getElementById('numeroContacto').focus();  // Opcional
                // Redirigir a otra página o sección
                window.location.href = "https://systems-idappsh.github.io/servicio/"; // Cambia esta URL por la URL de destino deseada
            } else {
                document.getElementById('numeroContacto').focus();
                alert('Operación cancelada. Modifique el número de contacto si es necesario.');
            }
        } else {
            // Documento no existe, mostrar modal
            showModal(data);
        }
    } catch (e) {
        console.error("Error añadiendo o actualizando el documento: ", e);
        alert('Error al almacenar o actualizar el registro. Por favor, intente nuevamente.');
    }
});

// Función para restablecer los valores del calendario
function resetCalendars() {
    const calendarInputs = document.querySelectorAll('.calendar-class');
    calendarInputs.forEach(input => {
        input.value = '';
    });
}
