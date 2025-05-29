import requests

def obtener_ubicacion_ip():

    respuesta = requests.get("https://ipinfo.io/json")
    datos = respuesta.json()

    ip = datos.get("ip")
    ciudad = datos.get("city")
    region = datos.get("region")
    pais = datos.get("country")
    loc = datos.get("loc")  # Ejemplo: "-34.6037,-58.3816"
    lat, lon = map(float, loc.split(','))
   

    print("Ubiacion obtenida ✅")

    return lat, lon

    


