<<<<<<< HEAD
# ECOLOOP ♻️

¡Bienvenido a Ecoloop! Un proyecto dedicado a facilitar la participación ciudadana en el reciclaje, proporcionando herramientas y recursos para tomar decisiones informadas y sostenibles.

---

### 👥 Equipo de Trabajo

* **Diego Joaquín del Canto** - joaquinundec@gmail.com
* **Genesis Marlen Sardinas Arguello** - genesissardinas04@gmail.com

---

### 💡 Descripción del Proyecto

Ecoloop es una iniciativa que busca optimizar la gestión de contenedores de basura a través de una **API de Google Maps** para la visualización de ubicaciones. La interfaz de usuario está desarrollada con **HTML, CSS y JavaScript**, mientras que la lógica de backend se construye con **Python y Flask**. Los datos de los contenedores se almacenan en una base de datos **NoSQL MongoDB** (orientada a documentos) y todo el entorno se ejecuta en **contenedores Docker**.

---

### 🚀 Características

* **Mapa Interactivo:** Visualización de la ubicación de los contenedores mediante la API de Google Maps.
* **CRUD de Contenedores:** Gestión completa (Crear, Leer, Actualizar, Eliminar) de datos de contenedores con Flask.
* **Interfaz Web Responsiva:** Diseño adaptable a diferentes dispositivos, desarrollado con HTML, CSS y JavaScript.
* **Persistencia de Datos:** Almacenamiento eficiente de información con MongoDB.
* **Contenedores Docker:** Implementación de Docker para MongoDB y la aplicación Flask, asegurando un entorno consistente.
* **Acceso Local:** Gestión disponible a través de `localhost:5000` o `127.0.0.1:5000` (puerto 5000 por defecto de Flask).

---

### 👨‍💻 Tecnologías Utilizadas

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Python 3, Flask
* **Base de Datos:** MongoDB, MongoClient (para la conexión con MongoDB), PyMongo
* **Contenedores:** Docker Compose (para virtualizar imágenes de MongoDB y Python)
* **API:** Google Maps API

---

### 🛫 Instalación (Para Windows)

Sigue estos pasos para poner en marcha Ecoloop en tu sistema Windows:

1.  **Instalar los programas necesarios:**
    * [Python](https://www.python.org/downloads/)
    * [Docker Desktop](https://www.docker.com/products/docker-desktop/)
    * [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (opcionalmente MongoDB Compass para una interfaz gráfica)

2.  **Abrir la línea de comandos (CMD).**

3.  **Crear una carpeta en el escritorio y clonar el repositorio dentro de ella:**
    a) Crea la carpeta:
        ```bash
        mkdir ecoloop
        ```
    b) Ingresa a la carpeta:
        ```bash
        cd ecoloop
        ```
    c) Clona el repositorio:
        ```bash
        git clone [https://github.com/JoacDc/Ecoloop-.git](https://github.com/JoacDc/Ecoloop-.git)
        ```

4.  **Ejecutar los contenedores Docker:**
    ```bash
    docker compose up -d
    ```

5.  **Verificar que los contenedores de Python y Mongo estén funcionando:**
    ```bash
    docker ps
    ```

6.  **Ejecutar el archivo `app.py`:**
    ```bash
    python app.py
    ```

7.  **Finalmente, verifica el funcionamiento en tu navegador:**
    * `http://localhost:5000`
    * o
    * `http://127.0.0.1:5000`
=======
# ECOLOOP ♻️

Ecoloop es Un proyecto dedicado a facilitar la participación ciudadana en el reciclaje, proporcionando herramientas y recursos para tomar decisiones informadas y sostenibles.

---

### 👥 Equipo de Trabajo

* **Diego Joaquín del Canto** - joaquinundec@gmail.com
* **Genesis Marlen Sardinas Arguello** - genesissardinas04@gmail.com

---

### 💡 Descripción del Proyecto

Ecoloop es una iniciativa que busca optimizar la gestión de contenedores de basura a través de una **API de Google Maps** para la visualización de ubicaciones. La interfaz de usuario está desarrollada con **HTML, CSS y JavaScript**, mientras que la lógica de backend se construye con **Python y Flask**. Los datos de los contenedores se almacenan en una base de datos **NoSQL MongoDB** (orientada a documentos) y todo el entorno se ejecuta en **contenedores Docker**.

---

### 🚀 Características

* **Mapa Interactivo:** Visualización de la ubicación de los contenedores mediante la API de Google Maps.
* **CRUD de Contenedores:** Gestión completa (Crear, Leer, Actualizar, Eliminar) de datos de contenedores con Flask.
* **Interfaz Web Responsiva:** Diseño adaptable a diferentes dispositivos, desarrollado con HTML, CSS y JavaScript.
* **Persistencia de Datos:** Almacenamiento eficiente de información con MongoDB.
* **Contenedores Docker:** Implementación de Docker para MongoDB y la aplicación Flask, asegurando un entorno consistente.
* **Acceso Local:** Gestión disponible a través de `localhost:5000` o `127.0.0.1:5000` (puerto 5000 por defecto de Flask).

---

### 👨‍💻 Tecnologías Utilizadas

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Python 3, Flask
* **Base de Datos:** MongoDB, MongoClient (para la conexión con MongoDB), PyMongo
* **Contenedores:** Docker Compose (para virtualizar imágenes de MongoDB y Python)
* **API:** Google Maps API

---

### 🛫 Instalación (Para Windows)

Sigue estos pasos para poner en marcha Ecoloop en tu sistema Windows:

1.  **Instalar los programas necesarios:**
    * [Python](https://www.python.org/downloads/)
    * [Docker Desktop](https://www.docker.com/products/docker-desktop/)
    * [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (opcionalmente MongoDB Compass para una interfaz gráfica)

2.  **Abrir la línea de comandos (CMD).**

3.  **Crear una carpeta en el escritorio y clonar el repositorio dentro de ella:
   **
    
    a) Crea la carpeta:
        ```bash
        mkdir ecoloop
        ```

     b) Ingresa a la carpeta:
        ```bash
        cd ecoloop
        ```

    c) Clona el repositorio:
        ```bash
        git clone [https://github.com/JoacDc/Ecoloop-.git](https://github.com/JoacDc/Ecoloop-.git)
        ```

5.  **Ejecutar los contenedores Docker:**
    ```bash
    docker compose up -d
    ```

6.  **Verificar que los contenedores de Python y Mongo estén funcionando:**
    ```bash
    docker ps
    ```

7.  **Ejecutar el archivo `app.py`:**
    ```bash
    python app.py
    ```

8.  **Finalmente, verifica el funcionamiento en tu navegador:**
    * `http://localhost:5000`
    * o
    * `http://127.0.0.1:5000`
>>>>>>> 9efcc08db1bb2afaa22a061659d638f8823123ca
