import logging

from flask import Flask, render_template, request, jsonify
import random as rd
from Contenedor import Contenedor
from connection import getConnection

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

db = getConnection()

app = Flask(__name__)



contenedores = []
#=========================================================#

#=========================================================#
@app.route('/agregar_contenedor') # Le cambié el nombre para diferenciarlo
def agregar_contenedor():
    return render_template('agregar_contenedor.html')

@app.route('/crear_contenedor', methods=['POST'])
def crear_contenedor():
    print("📥 Solicitud recibida para crear contenedor")

    try:
        data = request.get_json()
        print("🔍 Datos recibidos:", data)

        nuevo_contenedor = Contenedor(
            id=rd.randint(100, 100000),
            nombre=data['nombre'],
            lat=float(data['latitud']),
            long=float(data['longitud']),  # Usamos 'long' como pide tu clase
            color=data['color'],
            tamaño=float(data['tamanio']),
            tipoResiduo=data['tipoResiduo'],
            cantidadMax=100,
            cantidadMin=0
        )

        contenedores.append(nuevo_contenedor)


        contenedor_dict = {
            "id": nuevo_contenedor.id,
            "nombre": nuevo_contenedor.nombre,
            "lat": nuevo_contenedor.lat,
            "long": nuevo_contenedor.long,
            "color": nuevo_contenedor.color,
            "tamaño": nuevo_contenedor.tamaño,
            "tipoResiduo": nuevo_contenedor.tipoResiduo,
            "cantidadMax": nuevo_contenedor.cantidadMax,
            "cantidadMin": nuevo_contenedor.cantidadMin
        }
        
        db.contenedores.insert_one(contenedor_dict)

    except KeyError as e:
        return jsonify({"error": f"Falta el campo: {e}"}), 400
    except ValueError as e:
        return jsonify({"error": f"Tipo de dato inválido: {e}"}), 400
    except Exception as e:
        return jsonify({"error": f"Error inesperado: {str(e)}"}), 500

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

@app.route('/eliminar_contenedor') # Le cambié el nombre para diferenciarlo
def eliminar_contenedor():
    return render_template('eliminar_contenedor.html')

#=========================================================#

@app.route('/editar_contenedor')
def editar_contenedor():
    return render_template('editar_contenedor.html')
#=========================================================#

@app.route("/")
def mapa():

    contenedores = list(db.contenedores.find())
    for c in contenedores:
        c["_id"] = str(c["_id"])
    return render_template("index.html", contenedores=contenedores)

if __name__ == "__main__":
    app.run(debug=True)

