import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from itsdangerous import URLSafeSerializer  # Use URLSafeSerializer instead of URLSafeTimedSerializer
import os
from flask import url_for

load_dotenv()
# Gmail SMTP configuration


# Create a serializer with a secret key (no expiration time)
serializer = URLSafeSerializer(os.getenv('SERIALIZER'))  # Replace with a strong secret key

def generate_verification_token(email):
    """Generate a verification token for the given email."""
    return serializer.dumps(email, salt='email-verification-salt')

def verify_verification_token(token):
    """Verify the token and return the email if valid."""
    try:
        email = serializer.loads(token, salt='email-verification-salt')
        return email
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None
    
# print(generate_verification_token('tidepodking420@gmail.com'))
# print(verify_verification_token('InRpZGVwb2RraW5nNDIwQGdtYWlsLmNvbSI.u9ajDEjghj7UXLu6Jj-_bpqK8Hs'))

def send_email(receiver_email, token):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = os.getenv('SENDER_EMAIL')
    sender_password = os.getenv('SENDER_PASSWORD')
    # verification_link = url_for('verify_email', token=token, _external=True)
    verification_link = 'https://bodega-cats-nyc.com:5000/verify-email/' + token
    print('verification_link', verification_link)
    # Create the email
    subject = "🐈 Verification from bodega-cats-nyc.com 🐈"
    body = f"Click this link to verify your email: {verification_link}"
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    # Send the email
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()  # Upgrade the connection to secure
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, message.as_string())
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error: {e}")

