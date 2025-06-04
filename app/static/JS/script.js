let marcadorActual = null;
let ultimaUbicacion = null;
let mapaGoogle;
let infoWindowContenedores;
let contenedorAEliminarId = null;

//============================================================================
//============================================================================
function iniciarMap() {
    const coord = { lat: -29.16434370771048, lng: -67.49589881729844 };
    mapaGoogle = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: coord,
        mapTypeId: 'hybrid',
        styles: getEstilosConZoom(13) // Asegúrate de tener esta función definida en algún lugar
    });

    infoWindowContenedores = new google.maps.InfoWindow();    

<<<<<<< HEAD
    const containerCardsContainer = document.getElementById('container-cards-container');
    const markers = [];

    if (typeof datosContenedores !== 'undefined' && datosContenedores.length > 0) {
        datosContenedores.forEach(contenedor => {
            const latLng = new google.maps.LatLng(contenedor.ubicacion.lat, contenedor.ubicacion.lng);
            const marker = new google.maps.Marker({
                position: latLng,
                map: mapaGoogle,
                title: contenedor.nombre
            });

            markers.push(marker);

            const contentString = `
                <div class="info-window-content">
                    <h3 class="font-bold text-lg mb-1">${contenedor.nombre}</h3>
                    <p><strong>Color:</strong> ${contenedor.color}</p>
                    <p><strong>Tamaño:</strong> ${contenedor.tamanio} m³</p>
                    <p><strong>Tipo de Residuo:</strong> ${contenedor.tipoResiduo}</p>
                </div>
            `;

            marker.addListener('click', () => {
                infoWindowContenedores.setContent(contentString);
                infoWindowContenedores.open(mapaGoogle, marker);
            });

            const card = document.createElement('div');
            card.className = 'container-card';
            card.innerHTML = `
                <h3>${contenedor.nombre}</h3>
                <p><strong>Color:</strong> ${contenedor.color}</p>
                <p><strong>Tamaño:</strong> ${contenedor.tamanio} m³</p>
                <p><strong>Tipo de Residuo:</strong> ${contenedor.tipoResiduo}</p>
            `;

            card.addEventListener('click', () => {
                mapaGoogle.setCenter(latLng);
                mapaGoogle.setZoom(16);
                infoWindowContenedores.setContent(contentString);
                infoWindowContenedores.open(mapaGoogle, marker);
            });

            containerCardsContainer.appendChild(card);
        });
    } else {
        console.warn("No se encontraron contenedores para mostrar en el mapa inicial o datosContenedores no está definido.");
    }
}

//============================================================================
//============================================================================
function mapaAgregarContenedor(){
    // Limpiar estado previo
    if (marcadorActual) {
        marcadorActual.setMap(null);
        marcadorActual = null;
    }
    ultimaUbicacion = null;
    
    const coord = { lat: -29.16434370771048, lng: -67.49589881729844 };
    mapaGoogle = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: coord,
        mapTypeId: 'hybrid',
        styles: getEstilosConZoom(13),
        gestureHandling: 'greedy', 
        disableDoubleClickZoom: true 
    });

    // Limpiar campos de coordenadas y dirección
    document.getElementById('coordenadas').textContent = 'Latitud: — | Longitud: —';
    document.getElementById('direccion').textContent = '📍 Dirección: —';

    const geocoder = new google.maps.Geocoder();
    const botonEnviar = document.getElementById("enviarTodo");
    const formElement = document.getElementById('contenedorForm');

    // Resetear el botón de enviar
    botonEnviar.disabled = true;

    // Manejar el evento de clic en el mapa
    mapaGoogle.addListener('click', function(event) {
        try {
            console.log("¡Click detectado para colocar marcador! Coordenadas:", event.latLng.lat(), event.latLng.lng());
            colocarUnicoMarcador(event.latLng, mapaGoogle);
            mostrarCoordenadas(event.latLng);
            obtenerDireccion(geocoder, event.latLng);
            ultimaUbicacion = event.latLng;

            // Verificar si el navegador está bloqueando los logs
            if (typeof console === "undefined" || typeof console.log === "undefined") {
                alert("Click en coordenadas: " + event.latLng.lat() + ", " + event.latLng.lng());
            }

            // Habilitar botón si el formulario es válido
            botonEnviar.disabled = !validarFormulario();
        } catch (error) {
            console.error("Error en el evento de clic:", error);
            showCustomAlert("Error al procesar la ubicación. Por favor, inténtalo de nuevo.");
        }
    });

    // Manejar cambios en el formulario
    formElement.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            if (ultimaUbicacion && validarFormulario()) {
                botonEnviar.disabled = false;
            } else {
                botonEnviar.disabled = true;
            }
=======
    // Contenedor donde se insertarán las tarjetas++
    const containerCardsContainer = document.getElementById('container-cards-container');

    // Almacenar los marcadores para poder acceder a ellos desde las tarjetas
    const markers = [];

    // Crear los marcadores existentes de los contenedores y sus tarjetas
    datosContenedores.forEach(contenedor => {
        const latLng = new google.maps.LatLng(contenedor.lat, contenedor.long); // Usar latitud y longitud
        const marker = new google.maps.Marker({
        position: latLng,
        map: mapaGoogle,
        title: contenedor.nombre
    });

        markers.push(marker); // Guardar el marcador

        // Contenido de la InfoWindow para cada contenedor
        const contentString = `
            <div class="info-window-content">
                <h3 class="font-bold text-lg mb-1">${contenedor.nombre}</h3>
                <p><strong>Color:</strong> ${contenedor.color}</p>
                <p><strong>Tamaño:</strong> ${contenedor.tamanio} m³</p>
                <p><strong>Tipo de Residuo:</strong> ${contenedor.tipoResiduo}</p>
            </div>
        `;

        // Añadir un listener para abrir la InfoWindow al hacer clic en el marcador
        marker.addListener('click', () => {
            infoWindowContenedores.setContent(contentString);
            infoWindowContenedores.open(mapaGoogle, marker);
        });

        // Crear la tarjeta para el contenedor
        const card = document.createElement('div');
        card.className = 'container-card';
        card.innerHTML = `
            <h3>${contenedor.nombre}</h3>
            <p><strong>Color:</strong> ${contenedor.color}</p>
            <p><strong>Tamaño:</strong> ${contenedor.tamanio} m³</p>
            <p><strong>Tipo de Residuo:</strong> ${contenedor.tipoResiduo}</p>
        `;

        // Añadir un listener para que al hacer clic en la tarjeta:
        // 1. Se centre el mapa en el contenedor
        // 2. Se abra la InfoWindow del marcador correspondiente
        card.addEventListener('click', () => {
            mapaGoogle.setCenter(latLng);
            mapaGoogle.setZoom(16); // Puedes ajustar el zoom al hacer clic en la tarjeta
            infoWindowContenedores.setContent(contentString);
            infoWindowContenedores.open(mapaGoogle, marker);
>>>>>>> 9efcc08db1bb2afaa22a061659d638f8823123ca
        });

        containerCardsContainer.appendChild(card);
    });

    // Configurar el botón de enviar
    botonEnviar.addEventListener('click', function(e) {
        e.preventDefault();
        enviarDatos();
    });

    // Forzar un redibujado del mapa para asegurar que los eventos están activos
    setTimeout(() => {
        google.maps.event.trigger(mapaGoogle, 'resize');
        mapaGoogle.setCenter(coord);
    }, 100);
}

//============================================================================
//============================================================================
function validarFormulario() {
    return document.getElementById('nombre').value.trim() !== '' && 
        document.getElementById('color').value.trim() !== '' &&
        document.getElementById('tamanio').value.trim() !== '' &&
        document.getElementById('tipoResiduo').value.trim() !== '';
}

//============================================================================
//============================================================================
function enviarDatos() {
    const botonEnviar = document.getElementById("enviarTodo");
    botonEnviar.disabled = true;
    const form = document.getElementById('contenedorForm');

    if (!ultimaUbicacion || !validarFormulario()) {
        showCustomAlert('Por favor, completa todos los campos y selecciona una ubicación en el mapa.');
        botonEnviar.disabled = false;
        return;
    }

    const datos = {
        nombre: document.getElementById('nombre').value,
        color: document.getElementById('color').value,
        tamanio: parseFloat(document.getElementById('tamanio').value),
        tipoResiduo: document.getElementById('tipoResiduo').value,
        ubicacion: {
            lat: ultimaUbicacion.lat(),
            lng: ultimaUbicacion.lng()
        }
    };

    // Mostrar mensaje de carga
    const loadingAlert = showCustomAlert('Creando contenedor...', 0);

    fetch('/crear_contenedor', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
        
        // Cerrar mensaje de carga
        if (loadingAlert) loadingAlert.remove();
        
        // Mostrar mensaje de éxito
        showCustomAlert(`✅ Contenedor "${data.nombre || datos.nombre}" creado con éxito`, 3000);
        
        // Limpiar formulario
        form.reset();
        
        // Limpiar mapa
        if (marcadorActual) {
            marcadorActual.setMap(null);
            marcadorActual = null;
        }
        
        // Limpiar ubicación y campos
        ultimaUbicacion = null;
        document.getElementById('coordenadas').textContent = 'Latitud: — | Longitud: —';
        document.getElementById('direccion').textContent = '📍 Dirección: —';
        
        // Actualizar la página después de 1 segundo (para que se vea el mensaje)
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    })
    .catch(error => {
        console.error('Error al enviar datos:', error);
        if (loadingAlert) loadingAlert.remove();
        
        const errorMsg = error.message || error.error || 'Error desconocido al crear el contenedor';
        showCustomAlert(`❌ Error: ${errorMsg}`, 5000);
        botonEnviar.disabled = false;
    });
}

//============================================================================
//============================================================================
function mapaEditarContenedor(){
    const coord = { lat: -29.16434370771048, lng: -67.49589881729844 };
    mapaGoogle = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: coord,
        mapTypeId: 'hybrid',
        styles: getEstilosConZoom(13),
        gestureHandling: 'greedy', 
        disableDoubleClickZoom: true 
    });

    const geocoder = new google.maps.Geocoder();
    const botonEnviar = document.getElementById("enviarTodo");
    const formElement = document.getElementById('contenedorForm');

    mapaGoogle.addListener('click', function(event) {
        console.log("¡Click detectado para colocar marcador! Coordenadas:", event.latLng.lat(), event.latLng.lng());
        colocarUnicoMarcador(event.latLng, mapaGoogle);
        mostrarCoordenadas(event.latLng);
        obtenerDireccion(geocoder, event.latLng);
        ultimaUbicacion = event.latLng;

        if (ultimaUbicacion && validarFormulario()) {
            botonEnviar.disabled = false;
        }
    });

    formElement.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            if (ultimaUbicacion && validarFormulario()) {
                botonEnviar.disabled = false;
            } else {
                botonEnviar.disabled = true;
            }
        });
    });

    botonEnviar.addEventListener('click', enviarDatosEditar);
    cargarContenedores();
}

//============================================================================
//============================================================================
async function enviarDatosEditar() {
    const botonEnviar = document.getElementById("enviarTodo");
    botonEnviar.disabled = true;
    const contenedorId = document.getElementById('contenedorForm').dataset.contenedorId;

    if (!contenedorId) {
        showCustomAlert("Por favor, selecciona un contenedor de la lista para editar.");
        botonEnviar.disabled = false;
        return;
    }

    if (!ultimaUbicacion || !validarFormulario()) {
        showCustomAlert('Por favor, completa todos los campos y selecciona una ubicación en el mapa.');
        botonEnviar.disabled = false;
        return;
    }

    const datos = {
        nombre: document.getElementById('nombre').value,
        color: document.getElementById('color').value,
        tamanio: parseFloat(document.getElementById('tamanio').value),
        tipoResiduo: document.getElementById('tipoResiduo').value,
        ubicacion: {
            lat: ultimaUbicacion.lat(),
            lng: ultimaUbicacion.lng()
        }
    };

    try {
        // Mostrar mensaje de carga
        showCustomAlert('Guardando cambios...', 2000);

        const response = await fetch(`/api/contenedores/${contenedorId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error desconocido al actualizar el contenedor.');
        }
        const data = await response.json();
        
        // Mostrar mensaje de éxito y recargar después de 1 segundo
        showCustomAlert(`✅ Cambios guardados: ${data.message}`, 1000);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
    } catch (error) {
        console.error('Error al enviar datos:', error);
        showCustomAlert(`❌ Error al guardar: ${error.message}`, 3000);
    } finally {
        botonEnviar.disabled = false;
    }
}
//============================================================================
//============================================================================
async function cargarContenedores(mode = 'normal') {
    const containerListDiv = document.getElementById('containerList');
    const loadingMessage = document.getElementById('loadingMessage');
    
    containerListDiv.innerHTML = '';
    containerListDiv.appendChild(loadingMessage);

    try {
        const response = await fetch('/api/contenedores');
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error desconocido al cargar contenedores.');
        }
        const contenedores = await response.json();
        
        loadingMessage.remove();

        if (contenedores.length === 0) {
            containerListDiv.innerHTML = '<p>No hay contenedores cargados aún.</p>';
        } else {
            contenedores.forEach(contenedor => {
                const card = document.createElement('div');
                card.className = 'container-card';
                card.dataset.contenedorId = contenedor._id;
                
                const deleteButton = mode === 'delete' ? 
                    `<button class="delete-button" onclick="mostrarConfirmacionEliminar('${contenedor._id}', '${contenedor.nombre}', event)">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>` : '';
                
                card.innerHTML = `
                    <h4>${contenedor.nombre}</h4>
                    <p><strong>Color:</strong> ${contenedor.color}</p>
                    <p><strong>Tamaño:</strong> ${contenedor.tamanio} m³</p>
                    <p><strong>Tipo de Residuo:</strong> ${contenedor.tipoResiduo}</p>
                    ${deleteButton}
                `;
                
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('.delete-button')) {
                        if (mode === 'delete') {
                            seleccionarContenedorParaEliminar(contenedor, card);
                        } else {
                            seleccionarContenedor(contenedor, card);
                        }
                    }
                });
                
                containerListDiv.appendChild(card);
            });
        }
    } catch (error) {
        containerListDiv.innerHTML = `<p style="color: red;">Error al cargar contenedores: ${error.message}</p>`;
        console.error('Error de red al cargar contenedores:', error);
    }
}

//============================================================================
//============================================================================
function seleccionarContenedor(contenedor, cardElement) {
    document.querySelectorAll('.container-card').forEach(card => {
        card.classList.remove('selected');
    });
    cardElement.classList.add('selected');

    document.getElementById('nombre').value = contenedor.nombre;
    document.getElementById('color').value = contenedor.color;
    document.getElementById('tamanio').value = contenedor.tamanio;
    document.getElementById('tipoResiduo').value = contenedor.tipoResiduo;
    document.getElementById('contenedorForm').dataset.contenedorId = contenedor._id;

    const latLng = new google.maps.LatLng(contenedor.ubicacion.lat, contenedor.ubicacion.lng);
    colocarUnicoMarcador(latLng, mapaGoogle);
    mapaGoogle.setCenter(latLng);
    mapaGoogle.setZoom(15);
    mostrarCoordenadas(latLng);
    obtenerDireccion(new google.maps.Geocoder(), latLng);
    ultimaUbicacion = latLng;
    document.getElementById("enviarTodo").disabled = !validarFormulario();
}

//============================================================================
//============================================================================
function seleccionarContenedorParaEliminar(contenedor, cardElement) {
    document.querySelectorAll('.container-card').forEach(card => {
        card.classList.remove('selected');
    });
    cardElement.classList.add('selected');

    const latLng = new google.maps.LatLng(contenedor.ubicacion.lat, contenedor.ubicacion.lng);
    colocarUnicoMarcador(latLng, mapaGoogle);
    mapaGoogle.setCenter(latLng);
    mapaGoogle.setZoom(15);
    mostrarCoordenadas(latLng);
    obtenerDireccion(new google.maps.Geocoder(), latLng);
    ultimaUbicacion = latLng;
}

//============================================================================
//============================================================================
async function eliminarContenedor(id) {
    try {
        const response = await fetch(`/api/contenedores/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error desconocido al eliminar el contenedor.');
        }
        const data = await response.json();
        showCustomAlert(`🗑️ Contenedor eliminado: ${data.message}`);
        
        // Recargar la página completa para asegurar que todo se actualice correctamente
        window.location.reload();

    } catch (error) {
        console.error('Error al eliminar datos:', error);
        showCustomAlert(`Hubo un error al eliminar el contenedor: ${error.message}. Por favor, inténtalo de nuevo.`);
    }
}

//============================================================================
//============================================================================
function mapaEliminarContenedor(){
    const coord = { lat: -29.16434370771048, lng: -67.49589881729844 };
    mapaGoogle = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: coord,
        mapTypeId: 'hybrid',
        styles: getEstilosConZoom(13),
        gestureHandling: 'greedy', 
        disableDoubleClickZoom: true 
    });

    const geocoder = new google.maps.Geocoder();

    mapaGoogle.addListener('click', function(event) {
        console.log("¡Click detectado para colocar marcador! Coordenadas:", event.latLng.lat(), event.latLng.lng());
        colocarUnicoMarcador(event.latLng, mapaGoogle);
        mostrarCoordenadas(event.latLng);
        obtenerDireccion(geocoder, event.latLng);
        ultimaUbicacion = event.latLng;
    });

    cargarContenedores('delete');
}

//============================================================================
//============================================================================
// Funciones para el modal de confirmación de eliminación
function mostrarConfirmacionEliminar(id, nombre, event) {
    event.stopPropagation();
    contenedorAEliminarId = id;
    const modal = document.getElementById('confirmationModal');
    const message = document.getElementById('confirmationMessage');
    
    message.textContent = `¿Estás seguro que deseas eliminar el contenedor "${nombre}"?`;
    modal.style.display = 'flex';
}

function confirmarEliminar() {
    if (contenedorAEliminarId) {
        eliminarContenedor(contenedorAEliminarId);
    }
    cerrarModalConfirmacion();
}

function cancelarEliminar() {
    contenedorAEliminarId = null;
    cerrarModalConfirmacion();
}

function cerrarModalConfirmacion() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'none';
}

//============================================================================
//============================================================================
function showCustomAlert(message, duration = 3000) {
    const alertContainer = document.getElementById('customAlertContainer');
    if (!alertContainer) {
        console.error('No se encontró el contenedor de alertas');
        return null;
    }
    
    const alertElement = document.createElement('div');
    alertElement.className = 'custom-alert';
    alertElement.innerHTML = `<p>${message}</p>`;
    alertContainer.appendChild(alertElement);
    
    // Mostrar alerta
    setTimeout(() => {
        alertElement.style.opacity = '1';
    }, 10);
    
    // Ocultar después de la duración (si no es 0)
    if (duration > 0) {
        setTimeout(() => {
            alertElement.style.opacity = '0';
            setTimeout(() => {
                alertElement.remove();
            }, 500);
        }, duration);
    }
    
    console.log('ALERT:', message);
    return alertElement; // Devolvemos el elemento para poder eliminarlo después
}

//============================================================================
//============================================================================
function colocarUnicoMarcador(location, map) {
    if (marcadorActual) {
        marcadorActual.setMap(null);
    }

    marcadorActual = new google.maps.Marker({
        position: location,
        map: map,
        title: "Ubicación del Contenedor"
    });
}

//============================================================================
//============================================================================
function mostrarCoordenadas(latLng) {
    const lat = latLng.lat().toFixed(6);
    const lng = latLng.lng().toFixed(6);
    document.getElementById('coordenadas').textContent = `Latitud: ${lat} | Longitud: ${lng}`;
}

//============================================================================
//============================================================================
function obtenerDireccion(geocoder, latLng) {
    const direccionContenedor = document.getElementById("direccion");
    if (!direccionContenedor) {
        console.error("El elemento con id 'direccion' no fue encontrado en el DOM.");
        return;
    }

    geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK") {
            if (results[0]) {
                direccionContenedor.textContent = `📍 Dirección: ${results[0].formatted_address}`;
            } else {
                direccionContenedor.textContent = "No se encontró dirección para esta ubicación.";
            }
        } else {
            direccionContenedor.textContent = "Error al obtener dirección.";
            console.error("Geocoder falló por: " + status);
        }
    });
}

//============================================================================
//============================================================================
function getEstilosConZoom(zoom) {
    return [
        {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#ffffff" }]
        },
        {
            featureType: "all",
            elementType: "labels.text",
            stylers: [
                {
                    weight: 0.5
                },
                {
                    visibility: "on"
                }
            ]
        },
        {
            featureType: "all",
            elementType: "labels.icon",
            stylers: [
                {
                    visibility: "on"
                }
            ]
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }]
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }]
        }
    ];
}
<<<<<<< HEAD

// Manejar el evento de retroceso/avance del navegador
window.addEventListener('popstate', function(event) {
    window.location.reload();
});
=======
>>>>>>> 9efcc08db1bb2afaa22a061659d638f8823123ca
