FROM python:slim

WORKDIR /app

COPY requirements.txt .

COPY server.py .

COPY .env .

COPY email_sender.py .

COPY models/ ./models/ 

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["gunicorn", "--workers", "4", "--bind", "0.0.0.0:5000", "server:app"]


