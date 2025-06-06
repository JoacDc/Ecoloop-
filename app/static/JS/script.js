let marcadorActual = null;
let ultimaUbicacion = null;
let mapaGoogle;
let infoWindowContenedores;
let contenedorAEliminarId = null;
let marcadorClickProximidad = null; // Marcador para el punto de búsqueda por clic

// Array para mantener una referencia a los marcadores, los datos y las tarjetas
let marcadoresConDatos = []; 

//============================================================================
//FUNCION DE LA PANTALLA PRINCIPAL PARA EL INICIALIZACION DEL MAPA CON LA
//DE LOS CONTENEDORES Y LOS MARCADADORES
//============================================================================
function iniciarMap() {
    const coord = { lat: -29.16434370771048, lng: -67.49589881729844 };
    mapaGoogle = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: coord,
        mapTypeId: 'hybrid',
        styles: getEstilosConZoom(13)
    });

    infoWindowContenedores = new google.maps.InfoWindow();
    const containerCardsContainer = document.getElementById('container-cards-container');
    
    // Limpiamos el array antes de llenarlo
    marcadoresConDatos = [];

    if (typeof datosContenedores !== 'undefined' && datosContenedores.length > 0) {
        datosContenedores.forEach(contenedor => {
            const latLng = new google.maps.LatLng(contenedor.ubicacion.lat, contenedor.ubicacion.lng);
            const marker = new google.maps.Marker({
                position: latLng,
                map: mapaGoogle,
                title: contenedor.nombre
            });

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
            
            // guarda el marcador, los datos y la tarjeta para el filtrado
            marcadoresConDatos.push({ marker: marker, datos: contenedor, card: card });
        });
    } else {
        console.warn("No se encontraron contenedores para mostrar en el mapa inicial o datosContenedores no está definido.");
    }
    
    // se añade el listener para filtrar por proximidad al hacer clic en el mapa
    mapaGoogle.addListener('click', (event) => {
        filtrarPorProximidad(event.latLng);
    });
}


//============================================================================
// FUNCION PARA FILTRAR CONTENEDORES POR PROXIMIDAD
//============================================================================
function filtrarPorProximidad(posicionClick) {
    const RADIO_BUSQUEDA_METROS = 1000; // Define el radio de búsqueda en 1 km

    // Limpia el campo de búsqueda por texto para evitar conflictos
    document.getElementById('filtroBusqueda').value = '';

    // Coloca un marcador visual en el punto del clic
    if (marcadorClickProximidad) {
        marcadorClickProximidad.setMap(null);
    }
    marcadorClickProximidad = new google.maps.Marker({
        position: posicionClick,
        map: mapaGoogle,
        title: 'Punto de búsqueda',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff"
        }
    });

    marcadoresConDatos.forEach(item => {
        const posicionContenedor = item.marker.getPosition();
        // Calcula la distancia entre el punto de clic y cada contenedor
        const distancia = google.maps.geometry.spherical.computeDistanceBetween(posicionClick, posicionContenedor);

        const estaCerca = distancia <= RADIO_BUSQUEDA_METROS;

        // Muestra u oculta el marcador y la tarjeta según la distancia
        item.marker.setVisible(estaCerca);
        item.card.style.display = estaCerca ? '' : 'none';
    });
}


//============================================================================
// FUNCION PARA FILTRAR POR TEXTO EN CUALQUIER PÁGINA
//============================================================================
function filtrarContenedores() {
    // Si hay un marcador de proximidad, se desactiva para no confundir
    if (marcadorClickProximidad) {
        marcadorClickProximidad.setMap(null);
        marcadorClickProximidad = null;
    }

    const textoBusqueda = document.getElementById('filtroBusqueda').value.toLowerCase();

    // Comprobar si esta ubicado en la página principal (que usa marcadoresConDatos)
    if (typeof marcadoresConDatos !== 'undefined' && marcadoresConDatos.length > 0) {
        // Lógica para la página principal (filtrar lista y marcadores del mapa)
        marcadoresConDatos.forEach(item => {
            const contenedor = item.datos;
            const textoContenedor = (
                contenedor.nombre +
                contenedor.color +
                contenedor.tamanio.toString() +
                contenedor.tipoResiduo
            ).toLowerCase();
            const coincide = textoContenedor.includes(textoBusqueda);
            item.marker.setVisible(coincide);
            if (item.card) { // Asegura que la tarjeta existe antes de intentar ocultarla
                item.card.style.display = coincide ? '' : 'none';
            }
        });
    } else {
        // Lógica para otras páginas (editar, eliminar) que solo filtran la lista de tarjetas
        const cards = document.querySelectorAll('#containerList .container-card');
        cards.forEach(card => {
            const textoContenedor = card.textContent.toLowerCase();
            const coincide = textoContenedor.includes(textoBusqueda);
            card.style.display = coincide ? '' : 'none';
        });
    }
}


//============================================================================
//FUNCION QUE PERMIETE EL AGREGADO DE CONTENEDORES NUEVOS
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
        });
    });

    // Contenedor donde se insertarán las tarjetas
    const containerCardsContainer = document.getElementById('container-cards-container');
    const markers = [];

    // Crear los marcadores existentes de los contenedores y sus tarjetas
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
    }

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
//FUNCION QUE PERMITE VALIDAD QUE NINGUNO DE LOS CAMPOS ESTE VACIO
//============================================================================
function validarFormulario() {
    return document.getElementById('nombre').value.trim() !== '' && 
            document.getElementById('color').value.trim() !== '' &&
            document.getElementById('tamanio').value.trim() !== '' &&
            document.getElementById('tipoResiduo').value.trim() !== '';
}

//============================================================================
// FUNCION QUE PERMITE ENVIAR LA INFORMACION DE CADA FORMULARIO A LA API FLASK
//  PARA SU ALMACENAJE
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
        showCustomAlert(` Contenedor "${data.nombre || datos.nombre}" creado con éxito`, 3000);
        
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
        document.getElementById('direccion').textContent = ' Dirección: —';
        
        // Actualizar la página después de 1 segundo (para que se vea el mensaje)
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    })
    .catch(error => {
        console.error('Error al enviar datos:', error);
        if (loadingAlert) loadingAlert.remove();
        
        const errorMsg = error.message || error.error || 'Error desconocido al crear el contenedor';
        showCustomAlert(` Error: ${errorMsg}`, 5000);
        botonEnviar.disabled = false;
    });
}

//============================================================================
//FUNCION PARA EDITAR UN CONTENEDOR SELECCIONADO
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
        console.log("colocar marcador, Coordenadas:", event.latLng.lat(), event.latLng.lng());
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
// FUNCION DE ENVIAR DATOS EDITADOS QUE ACOMPAÑA LA FUNCION DE EDITAR CONTE-
// NEDOR (ES DISTINTA A LA DE AGREGAR, PORQUE UNA USA POST Y OTRA PUT)
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
        showCustomAlert(`Cambios guardados: ${data.message}`, 1000);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
    } catch (error) {
        console.error('Error al enviar datos:', error);
        showCustomAlert(`Error al guardar: ${error.message}`, 3000);
    } finally {
        botonEnviar.disabled = false;
    }
}

//============================================================================
// FUNCION QUE PERMITE CARGAR LOS CONTENEDORES DENTRO DEL FRONT, TRAIDOS DESDE
// FLASK
//============================================================================
async function cargarContenedores(mode = 'normal') {
    const containerListDiv = document.getElementById('containerList');
    const loadingMessage = document.getElementById('loadingMessage');
    
    // Limpiamos el contenido anterior excepto la barra de búsqueda y el título
    containerListDiv.querySelectorAll('.container-card, p:not(#loadingMessage)').forEach(el => el.remove());
    loadingMessage.style.display = 'block';


    try {
        const response = await fetch('/api/contenedores');
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error desconocido al cargar contenedores.');
        }
        const contenedores = await response.json();
        
        loadingMessage.style.display = 'none';

        if (contenedores.length === 0) {
            const noContenedoresMsg = document.createElement('p');
            noContenedoresMsg.textContent = 'No hay contenedores cargados aún.';
            containerListDiv.appendChild(noContenedoresMsg);
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
        loadingMessage.style.display = 'none';
        const errorMsg = document.createElement('p');
        errorMsg.style.color = 'red';
        errorMsg.textContent = `Error al cargar contenedores: ${error.message}`;
        containerListDiv.appendChild(errorMsg);
        console.error('Error de red al cargar contenedores:', error);
    }
}

//============================================================================
// PERMITE SELECCIONAR LOS CONTENEDORES EN CADA SECCION, COMO EN LA PANTALLA   
// PRINCIPAL, EDITAR Y ELIMINAR (CADA CONTENEDOR APARECE COMO SI FUESE UNA CARD)
// CON LA INFORMACION DE CADA UNO
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
// HACE LO MISMO PERO PARA LA SECCION DE ELIMINAR UN CONTENEDOR
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
//FUNCION QUE PERMITE ELIMINAR UN CONTENEDOR
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
        showCustomAlert(`Contenedor eliminado: ${data.message}`);
        
        // Recargar la página completa para asegurar que todo se actualice correctamente
        window.location.reload();

    } catch (error) {
        console.error('Error al eliminar datos:', error);
        showCustomAlert(`Hubo un error al eliminar el contenedor: ${error.message}. Por favor, inténtalo de nuevo.`);
    }
}

//============================================================================
// FUNCION QUE INICIALIZAR EL MAPA Y LOS CONTENEDORES EN LA SECCION DE 
// ELIMINAR UN CONTENEDOR   
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
// FUNCIONAR QUE PERMITE MOSTRAR UN CARTEL PAR ACEPTAR LA ELIMINACION DE UN 
// CONTENEDOR
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
// FUNCION QUE PERMITE COLOCAR UN UNICO MARCADO DENTRO DEL MAPA
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
// FUNCION QUE PERMITE MOSTRAR LAS COORDENADAS DE UN MARCADOR COLOCADO
//============================================================================
function mostrarCoordenadas(latLng) {
    const lat = latLng.lat().toFixed(6);
    const lng = latLng.lng().toFixed(6);
    document.getElementById('coordenadas').textContent = `Latitud: ${lat} | Longitud: ${lng}`;
}

//============================================================================
// UNA VEZ COLOCADO EL MARCADOR, OBTENER LAS COORDENADS DE ESE PUNTO
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
//FUNCION QUE PERMITE DARLE ESTILOS A LOS MAPAS DE DISTITNAS SECCIONES
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

// Manejar el evento de retroceso/avance del navegador
window.addEventListener('popstate', function(event) {
    window.location.reload();
});
