// afiliacion.js

// ==========================================
// CREDENCIALES (Reemplaza con las tuyas)
// ==========================================
const SERVICE_ID = "Afiliacion"; 
const TEMPLATE_ID_AFILIACION = "template_xxcl5tk"; // El ID del template nuevo que creaste

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('afiliacion-form');
    const messageContainer = document.getElementById('afiliacion-message');
    const submitButton = form.querySelector('button[type="submit"]'); // Seleccionamos el botón
    
    // Inputs
    const rucInput = document.getElementById('ruc');
    const telefonoInput = document.getElementById('telefono');

    // Validación en tiempo real: Solo números
    const soloNumeros = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    };

    if(rucInput) rucInput.addEventListener('input', soloNumeros);
    if(telefonoInput) telefonoInput.addEventListener('input', soloNumeros);

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtener valores
            const ruc = rucInput.value.trim();
            const razonSocial = document.getElementById('razon-social').value.trim();
            const representante = document.getElementById('representante').value.trim();
            const direccion = document.getElementById('direccion').value.trim();
            const telefono = telefonoInput.value.trim();
            const email = document.getElementById('email-empresa').value.trim();
            const terminos = document.getElementById('terminos').checked;

            // --- VALIDACIONES ---
            let errores = [];

            if (ruc.length !== 11) errores.push("El RUC debe tener exactamente 11 dígitos.");
            if (!razonSocial || !representante || !direccion) errores.push("Complete todos los campos de texto.");
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) errores.push("Ingrese un correo válido.");
            if (telefono.length < 7) errores.push("Ingrese un teléfono válido.");
            if (!terminos) errores.push("Debe aceptar los términos y condiciones.");

            // Mostrar errores si hay
            if (errores.length > 0) {
                mostrarMensaje(errores[0], 'error');
                return;
            }

            // --- ENVÍO DE CORREO ---
            
            // 1. Feedback visual (Cargando)
            const textoOriginal = submitButton.textContent;
            submitButton.textContent = "Procesando solicitud...";
            submitButton.disabled = true;

            // 2. Preparar parámetros (Coinciden con las variables de tu template)
            const templateParams = {
                empresa: razonSocial,
                ruc: ruc,
                representante: representante,
                email_proveedor: email, // A este correo llegará la confirmación
                telefono: telefono
            };

            // 3. Enviar a EmailJS
            emailjs.send(SERVICE_ID, TEMPLATE_ID_AFILIACION, templateParams)
                .then(() => {
                    mostrarMensaje("¡Solicitud recibida! Te hemos enviado un correo de confirmación. Redirigiendo...", 'success');
                    
                    // Redirigir al dashboard después de 3 segundos
                    setTimeout(() => {
                        window.location.href = 'dashboard-proveedor.html';
                    }, 3000);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    mostrarMensaje("Hubo un error al enviar la solicitud. Intente nuevamente.", 'error');
                    submitButton.textContent = textoOriginal;
                    submitButton.disabled = false;
                });
        });
    }

    function mostrarMensaje(texto, tipo) {
        // Limpiar clases previas
        messageContainer.className = "mt-4 p-4 rounded-lg text-center font-semibold border";
        
        if (tipo === 'success') {
            messageContainer.classList.add('bg-green-50', 'text-green-800', 'border-green-200');
        } else {
            messageContainer.classList.add('bg-red-50', 'text-red-800', 'border-red-200');
        }

        messageContainer.textContent = texto;
        messageContainer.classList.remove('hidden');
    }
});