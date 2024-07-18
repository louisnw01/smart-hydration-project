import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv import load_dotenv
from string import Template

load_dotenv()


def send_email_with_ses(name, to_address, email_type):
    # getting the credentials from environment
    host = os.getenv("SES_HOST_ADDRESS")
    user = os.getenv("SES_USER_ID")
    password = os.getenv("SES_PASSWORD")
    from_address = "noreply-smarthydration@louisnw.com"

    if email_type == "delete":
        subject = "Confirmation of Account Deletion"
        with open("app/email_templates/delete_account.html", 'r', encoding='utf-8') as file:
            html_template = Template(file.read())

    body = html_template.safe_substitute(name=name)

    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['To'] = to_address
    msg['From'] = from_address

    msg.attach(MIMEText(body, 'html', 'utf-8'))

    try:
        with smtplib.SMTP(host, 587) as server:
            server.starttls()
            server.login(user, password)
            server.sendmail(from_address, to_address, msg.as_string())
            server.quit()
    except Exception as e:
        print(e)


send_email_with_ses("Hamish", "hamishpartington25@gmail.com", "delete")
