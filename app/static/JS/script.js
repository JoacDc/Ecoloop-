let marcadorActual = null;
let ultimaUbicacion = null;
let mapaGoogle; // Declaramos una variable global para el objeto mapa
let infoWindowContenedores;


function iniciarMap() {
    const coord = { lat: -29.16434370771048, lng: -67.49589881729844 };
    mapaGoogle = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: coord,
        mapTypeId: 'hybrid',
        styles: getEstilosConZoom(13) // Asegúrate de tener esta función definida en algún lugar
    });

    infoWindowContenedores = new google.maps.InfoWindow();    

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
        });

        containerCardsContainer.appendChild(card);
    });

}

function mapaAgregarContenedor(){
    const coord = { lat: -29.16434370771048, lng: -67.49589881729844 };
    mapaGoogle = new google.maps.Map(document.getElementById('map'), { // Asignamos el mapa a la variable global
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
        console.log("¡Click detectado para colocar marcador! Coordenadas:", event.latLng.lat(), event.latLng.lng()); // Para depuración
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

    botonEnviar.addEventListener('click', enviarDatos);
}

function validarFormulario() {
    // Usamos .trim() para asegurarnos de que los campos no estén vacíos o solo contengan espacios
    return document.getElementById('nombre').value.trim() !== '' && 
        document.getElementById('color').value.trim() !== '' &&
        document.getElementById('tamanio').value.trim() !== '' &&
        document.getElementById('tipoResiduo').value.trim() !== '';
}

function enviarDatos() {
    const botonEnviar = document.getElementById("enviarTodo");
    // Deshabilitar el botón inmediatamente para evitar envíos duplicados
    botonEnviar.disabled = true;

    if (!ultimaUbicacion || !validarFormulario()) {
        alert('Por favor, completa todos los campos y selecciona una ubicación en el mapa.');
        botonEnviar.disabled = false; // Volver a habilitar si la validación falla
        return;
    }

    const datos = {
        nombre: document.getElementById('nombre').value,
        color: document.getElementById('color').value,
        tamanio: parseFloat(document.getElementById('tamanio').value),
        tipoResiduo: document.getElementById('tipoResiduo').value,
        latitud: ultimaUbicacion.lat().toFixed(6),
        longitud: ultimaUbicacion.lng().toFixed(6)
    };

    fetch('/crear_contenedor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            // Si la respuesta no es OK (ej. 400, 500), lanzamos un error para el catch
            return response.json().then(errorData => {
                throw new Error(errorData.mensaje || 'Error desconocido en el servidor.');
            });
        }
        return response.json();
    })
    .then(data => {
        alert(`✅ Contenedor creado: ${data.mensaje}`);

        //LIMPIAR FORMULARIO usando el método reset() del formulario
        document.getElementById('contenedorForm').reset();

        //BORRAR MARCADOR del mapa
        if (marcadorActual) {
            marcadorActual.setMap(null);
            marcadorActual = null;
        }

        //REINICIAR LA ÚLTIMA UBICACIÓN SELECCIONADA
        ultimaUbicacion = null;

        //RESTABLECER EL TEXTO DE COORDENADAS Y DIRECCIÓN
        document.getElementById('coordenadas').textContent = 'Latitud: — | Longitud: —';
        document.getElementById('direccion').textContent = '📍 Dirección: —'; // Asegúrate de que este div exista

        //DESHABILITAR EL BOTÓN HASTA QUE SE INGRESE NUEVA INFORMACIÓN Y SELECCIONE UBICACIÓN
        botonEnviar.disabled = true;
    })
    .catch(error => {
        console.error('Error al enviar datos:', error);
        alert(`Hubo un error al crear el contenedor: ${error.message}. Por favor, inténtalo de nuevo.`);
        botonEnviar.disabled = false; // Habilitar el botón en caso de error para que el usuario pueda reintentar
    });
}

function colocarUnicoMarcador(location, map) {
    if (marcadorActual) {
        marcadorActual.setMap(null); // Elimina el marcador anterior si existe
    }

    marcadorActual = new google.maps.Marker({
        position: location,
        map: map,
        title: "Ubicación del Contenedor" // Título descriptivo para el marcador
    });
}

function mostrarCoordenadas(latLng) {
    const lat = latLng.lat().toFixed(6);
    const lng = latLng.lng().toFixed(6);
    document.getElementById('coordenadas').textContent = `Latitud: ${lat} | Longitud: ${lng}`;
}

function obtenerDireccion(geocoder, latLng) {
    const direccionContenedor = document.getElementById("direccion");
    // Verificamos si el elemento existe antes de intentar manipularlo
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

function getEstilosConZoom(zoom) {
    // Puedes ajustar estos estilos para personalizar aún más tu mapa
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
            stylers: [{ color: "#38414e" }] // Color de las calles
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }] // Color del agua
        }
    ];
}
