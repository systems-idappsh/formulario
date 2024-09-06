// Importar las funciones necesarias de Firebase
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

// Función para obtener la fecha y hora actual
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

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
    modal.style.display = 'block';  // Mostrar el modal

    // Manejar eventos de los botones del modal
    document.getElementById('confirmButton').addEventListener('click', async () => {
        await handleFormSubmission(data);
        modal.style.display = 'none';  // Ocultar el modal
    });
    document.getElementById('modifyButton').addEventListener('click', () => {
        modal.style.display = 'none';  // Ocultar el modal para modificar
    });
    document.getElementById('cancelButton').addEventListener('click', () => {
        modal.style.display = 'none';  // Ocultar el modal
        document.getElementById('numeroContacto').focus();  // Enfocar el campo `numeroContacto`
    });
}

// Función para manejar la lógica de envío del formulario
async function handleFormSubmission(data) {
    const docRef = doc(db, "usuarios", data.numeroContacto);
    
    try {
        await setDoc(docRef, data);
        alert('Registro almacenado exitosamente!');
        resetFormAndShowInitialSection();
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
        fecha_hora_registro_nuevo_cliente: getCurrentDateTime()
    };

    const docRef = doc(db, "usuarios", numeroContacto);

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // Mostrar el modal si el documento ya existe
            showModal(data);
        } else {
            // Documento no existe, crear nuevo
            await handleFormSubmission(data);
        }
    } catch (e) {
        console.error("Error verificando el documento: ", e);
        alert('Error al verificar el registro. Por favor, intente nuevamente.');
    }
});

// Función para restablecer los campos del formulario y volver a la sección inicial
function resetFormAndShowInitialSection() {
    clientForm.reset();
    resetCalendars();
    // Aquí puedes agregar el código para mostrar la sección inicial del formulario si estás usando alguna estructura de pestañas o secciones
    document.getElementById('numeroContacto').focus();  // Opcional: colocar el cursor en el campo `numeroContacto`
}

// Función para restablecer los valores del calendario
function resetCalendars() {
    const calendarInputs = document.querySelectorAll('.calendar-class'); // Asegúrate de usar la clase adecuada para tus campos de calendario
    calendarInputs.forEach(input => {
        input.value = ''; // Restablecer cada campo de calendario
    });
}
