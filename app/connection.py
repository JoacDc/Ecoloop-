import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

def getConnection():
    host = os.getenv("MONGO_HOST", "localhost")  # default localhost para pruebas
    try:
        cliente = MongoClient(f"mongodb://{host}:27017/", serverSelectionTimeoutMS=3000)
        cliente.admin.command("ping")
        print("✅ Conexión a MongoDB establecida correctamente.")
        
        # Seleccionar o crear la base de datos 'contenedores'
        db = cliente["Ecoloop"]
        
        # Para asegurar que la DB exista, crea una colección y un documento dummy si está vacía
        if "contenedores" not in db.list_collection_names():
            db.contenedores.insert_one({"init": True})
            # Opcionalmente, elimina el documento para limpiar
            db.contenedores.delete_many({})

        return db
    except ConnectionFailure as e:
        print("Error de conexión a MongoDB:", e)
        return None



