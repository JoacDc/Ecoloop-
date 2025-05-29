# Usa una imagen base de Python. Siempre es bueno especificar la versión.
FROM python:3.12-slim-buster

WORKDIR /app

COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app .

CMD ["flask", "--app", "app", "run", "--host=0.0.0.0"]