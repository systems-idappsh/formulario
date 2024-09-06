
        document.addEventListener('DOMContentLoaded', () => {
            const clientForm = document.getElementById('clientForm');
            const sections = clientForm.querySelectorAll('.section');
    
            // Mostrar todas las secciones y limpiar los campos
            sections.forEach(section => {
                section.style.display = 'block'; // Mostrar todas las secciones
            });
    
            // Restablecer (limpiar) todos los campos del formulario
            clientForm.reset();
    
            // Ocultar todas las secciones excepto la primera
            sections.forEach((section, index) => {
                section.style.display = index === 0 ? 'block' : 'none';
            });
    
            // Logica de navegación por secciones
            const prevButton = document.getElementById("prevButton");
            const nextButton = document.getElementById("nextButton");
            const submitButton = document.getElementById("submitButton");
            const header = document.getElementById("header");
            const footer = document.getElementById("footer");
            let currentSection = 0;
    
            function showSection(index) {
                sections.forEach((section, i) => {
                    section.style.display = i === index ? "block" : "none"; // Solo muestra la sección activa
                    section.classList.toggle("active", i === index);
                });
                prevButton.style.display = index === 0 ? "none" : "inline-block";
                nextButton.style.display = index === sections.length - 1 ? "none" : "inline-block";
                submitButton.style.display = index === sections.length - 1 ? "inline-block" : "none";
                header.style.display = index === 0 ? "block" : "none"; // Mostrar encabezado en la primera sección
                footer.style.display = index === 0 ? "block" : "none"; // Mostrar pie de página solo en la primera sección
            }
    
            function validateInput(input) {
                const value = input.value.trim();
                const errorElement = document.getElementById(`${input.id}_error`);
                const correctElement = document.getElementById(`${input.id}_correcto`);
                let valid = true;
    
                if (input.required && !value) {
                    valid = false;
                    errorElement.textContent = "Este campo es obligatorio.";
                } else if (input.type === "text" && !/^[a-zA-Z\s]+$/.test(value)) {
                    valid = false;
                    errorElement.textContent = "Este campo debe contener solo letras.";
                } else if (input.type === "tel" && !/^\+?\d{10,15}$/.test(value)) {
                    valid = false;
                    errorElement.textContent = "Por favor ingresa un número telefónico válido.";
                } else if (input.type === "email" && !/\S+@\S+\.\S+/.test(value)) {
                    valid = false;
                    errorElement.textContent = "Por favor ingresa un correo electrónico válido.";
                } else if (input.type === "number" && (isNaN(value) || value <= 0)) {
                    valid = false;
                    errorElement.textContent = "Por favor ingresa una cantidad válida.";
                }
    
                if (valid) {
                    input.classList.add("input-correcto");
                    input.classList.remove("input-incorrecto");
                    errorElement.style.display = "none";
                    correctElement.style.display = "block";
                } else {
                    input.classList.add("input-incorrecto");
                    input.classList.remove("input-correcto");
                    errorElement.style.display = "block";
                    correctElement.style.display = "none";
                }
                return valid;
            }
    
            function validateSection(index) {
                const section = sections[index];
                const inputs = section.querySelectorAll("input[required], select[required], textarea[required]");
                let valid = true;
    
                inputs.forEach(input => {
                    if (!validateInput(input)) valid = false;
                });
    
                return valid;
            }
    
            nextButton.addEventListener("click", function () {
                if (validateSection(currentSection)) {
                    currentSection++;
                    if (currentSection >= sections.length) {
                        document.getElementById("clientForm").submit();
                        return;
                    }
                    showSection(currentSection);
                }
            });
    
            prevButton.addEventListener("click", function () {
                currentSection--;
                showSection(currentSection);
            });
    
            sections.forEach(section => {
                section.addEventListener("input", function (event) {
                    validateInput(event.target);
                });
            });
    
            showSection(currentSection); // Inicializa mostrando la primera sección
    
            // Nueva función para alternar la visibilidad de la contraseña
            const passwordField = document.getElementById("passwordVisas");
            const showPasswordCheckbox = document.getElementById("showPasswordCheckbox");
    
            showPasswordCheckbox.addEventListener("change", function () {
                passwordField.type = this.checked ? "text" : "password";
            });
        });
  
    