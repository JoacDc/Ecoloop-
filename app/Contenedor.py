class Contenedor:
    # Constructor corregido: acepta todos los argumentos
    
    def __init__(self, id, nombre, lat, long, color, tamaño, tipoResiduo, cantidadMax, cantidadMin):
        self.id = id
        self.nombre = nombre
        self.lat = lat
        self.long = long
        self.color = color
        self.tamaño = tamaño
        self.tipoResiduo = tipoResiduo
        self.cantidadMax = cantidadMax
        self.cantidadMin = cantidadMin

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "lat": self.lat,
            "long": self.long,
            "color": self.color,
            "tamaño": self.tamaño,
            "tipoResiduo": self.tipoResiduo,
            "cantidadMax": self.cantidadMax,
            "cantidadMin": self.cantidadMin
        }

    def __str__(self):
        return f"Contenedor({self.nombre}, {self.lat}, {self.long})"
    # Getters y Setters

    @property
    def nombre(self):
        return self._nombre

    @nombre.setter
    def nombre(self, valor):
        self._nombre = valor

    @property
    def lat(self):
        return self._lat

    @lat.setter
    def lat(self, valor):
        self._lat = valor

    @property
    def long(self):
        return self._long

    @long.setter
    def long(self, valor):
        self._long = valor

    @property
    def color(self):
        return self._color

    @color.setter
    def color(self, valor):
        self._color = valor

    @property
    def tamaño(self):
        return self._tamaño

    @tamaño.setter
    def tamaño(self, valor):
        self._tamaño = valor

    @property
    def tipoResiduo(self):
        return self._tipoResiduo

    @tipoResiduo.setter
    def tipoResiduo(self, valor):
        self._tipoResiduo = valor

    @property
    def cantidadMax(self):
        return self._cantidadMax

    @cantidadMax.setter
    def cantidadMax(self, valor):
        self._cantidadMax = valor

    @property
    def cantidadMin(self):
        return self._cantidadMin

    @cantidadMin.setter
    def cantidadMin(self, valor):
        self._cantidadMin = valor

    def prueba(self):
        print("funciona")

   
    
    def __str__(self):
        return f"{self.nombre} - {self.tipoResiduo} ({self.color}), lat: {self.lat}, lon: {self.long}"

