import logging

from flask import Flask, render_template, request, jsonify
import random as rd
from Contenedor import Contenedor 
from connection import getConnection
from bson.objectid import ObjectId, InvalidId 


log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

db = getConnection()

app = Flask(__name__)


contenedores = []
#=========================================================#

#=========================================================#
@app.route('/agregar_contenedor') 
def agregar_contenedor():
    return render_template('agregar_contenedor.html')

@app.route('/crear_contenedor', methods=['POST'])
def crear_contenedor():
    print("📥 Solicitud recibida para crear contenedor")

    try:
        data = request.get_json()
        print("🔍 Datos recibidos:", data)
        
        latitud = float(data['ubicacion']['lat'])
        longitud = float(data['ubicacion']['lng'])

        nuevo_contenedor = Contenedor(
            id=rd.randint(100, 100000),
            nombre=data['nombre'],
            lat=latitud, 
            long=longitud, 
            color=data['color'],
            tamanio=float(data['tamanio']),
            tipoResiduo=data['tipoResiduo'],
            cantidadMax=100,
            cantidadMin=0
        )

        contenedores.append(nuevo_contenedor)

        contenedor_dict = {
            "id": nuevo_contenedor.id,
            "nombre": nuevo_contenedor.nombre,
            "ubicacion": { 
                "lat": nuevo_contenedor.lat,
                "lng": nuevo_contenedor.long 
            },
            "color": nuevo_contenedor.color,
            "tamanio": nuevo_contenedor.tamanio, 
            "tipoResiduo": nuevo_contenedor.tipoResiduo,
            "cantidadMax": nuevo_contenedor.cantidadMax,
            "cantidadMin": nuevo_contenedor.cantidadMin
        }
        
        db.contenedores.insert_one(contenedor_dict)

    except KeyError as e:
        # Mensaje de error más específico si falta un campo esperado
        return jsonify({"error": f"Falta el campo: {e}. Asegúrate de que el JSON enviado contiene todos los campos requeridos, incluyendo 'ubicacion.lat' y 'ubicacion.lng'."}), 400
    except ValueError as e:
        return jsonify({"error": f"Tipo de dato inválido: {e}"}), 400
    except Exception as e:
        # Captura cualquier otra excepción inesperada
        return jsonify({"error": f"Error inesperado en el servidor: {str(e)}"}), 500

    print("\n" + "="*50)
    print("📦 NUEVO CONTENEDOR CREADO:")
    print(f"ID: {nuevo_contenedor.id}")
    print(f"Nombre: {nuevo_contenedor.nombre}")
    print(f"Ubicación: Lat {nuevo_contenedor.lat}, Long {nuevo_contenedor.long}")
    print(f"Tipo: {nuevo_contenedor.tipoResiduo}")
    print("="*50 + "\n")

    return jsonify({
        "mensaje": f"Contenedor {nuevo_contenedor.id} creado con éxito",
        "data": data 
    })

#=========================================================#

@app.route('/eliminar_contenedor') 
def eliminar_contenedor():
    print("☑️ Panel de eliminar un contenedor")
    return render_template('eliminar_contenedor.html')
# NUEVO ENDPOINT: Eliminar un contenedor específico (DELETE)
@app.route('/api/contenedores/<id>', methods=['DELETE'])
def delete_contenedor(id):
    try:
        # Usar ObjectId para buscar por ID en MongoDB
        result = db.contenedores.delete_one({'_id': ObjectId(id)})

        if result.deleted_count == 0:
            return jsonify({"message": "Contenedor no encontrado."}), 404
        
        return jsonify({"message": "Contenedor eliminado exitosamente!"}), 200
    except InvalidId:
        return jsonify({"message": "ID de contenedor inválido."}), 400
    except Exception as e:
        print(f"Error al eliminar contenedor {id}: {e}")
        return jsonify({"message": "Error al eliminar contenedor", "error": str(e)}), 500
#=========================================================#
@app.route('/editar_contenedor')
def editar_contenedor():
    print("☑️ Panel de Editar contenedor")
    return render_template('editar_contenedor.html')

# NUEVO ENDPOINT: Obtener todos los contenedores para la lista (GET)
@app.route('/api/contenedores', methods=['GET'])
def get_all_contenedores():
    try:
        contenedores_db = list(db.contenedores.find({}))
        for contenedor in contenedores_db:
            contenedor['_id'] = str(contenedor['_id'])
            # Asegurar que siempre haya un campo 'ubicacion' con 'lat' y 'lng'
            if 'lat' in contenedor and 'long' in contenedor:
                # Si existen 'lat' y 'long' en la raíz, moverlos a 'ubicacion' y eliminarlos de la raíz
                if not isinstance(contenedor.get('ubicacion'), dict):
                    contenedor['ubicacion'] = {'lat': contenedor.pop('lat'), 'lng': contenedor.pop('long')}
                else: # Si ya tiene 'ubicacion' pero también 'lat'/'long' en la raíz, eliminarlos
                    contenedor.pop('lat', None) # Usar .pop(key, None) para evitar KeyError si la clave no existe
                    contenedor.pop('long', None)
            elif 'ubicacion' not in contenedor:
                # Si no hay 'ubicacion' y tampoco 'lat'/'long', añadir un placeholder
                contenedor['ubicacion'] = {'lat': 0, 'lng': 0}
        return jsonify(contenedores_db), 200
    except Exception as e:
        print(f"Error al obtener contenedores: {e}")
        return jsonify({"message": "Error al obtener contenedores", "error": str(e)}), 500

# NUEVO ENDPOINT: Actualizar un contenedor específico (PUT)
@app.route('/api/contenedores/<id>', methods=['PUT'])
def update_contenedor(id):
    try:
        data = request.get_json()
        print(f"🔍 Recibida solicitud PUT para ID: {id}, Datos: {data}")

        # Eliminar el campo _id de los datos si viene, ya que no se puede actualizar
        data.pop('_id', None) 

        # Realizar la actualización en MongoDB
        result = db.contenedores.update_one(
            {'_id': ObjectId(id)}, # Usar ObjectId para buscar por ID
            {'$set': data} # $set actualiza solo los campos proporcionados
        )

        if result.matched_count == 0:
            return jsonify({"message": "Contenedor no encontrado."}), 404
        if result.modified_count == 0:
            return jsonify({"message": "No se realizaron cambios en el contenedor."}), 200 # O 304 Not Modified
        
        return jsonify({"message": "Contenedor actualizado exitosamente!"}), 200
    except Exception as e:
        print(f"Error al actualizar contenedor {id}: {e}")
        return jsonify({"message": "Error al actualizar contenedor", "error": str(e)}), 500

#=========================================================#

@app.route("/")
def mapa():
    contenedores = list(db.contenedores.find())
    for c in contenedores:
        c["_id"] = str(c["_id"])
        # Asegurar que 'ubicacion' siempre esté presente y bien estructurada para el frontend
        if 'lat' in c and 'long' in c and 'ubicacion' not in c:
            c['ubicacion'] = {'lat': c.pop('lat'), 'lng': c.pop('long')}
        elif 'ubicacion' not in c: # Fallback para documentos sin información de ubicación
            c['ubicacion'] = {'lat': 0, 'lng': 0}
    return render_template("index.html", contenedores=contenedores)

if __name__ == "__main__":
    app.run(debug=True)
