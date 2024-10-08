import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import parseaddr

from dotenv import load_dotenv
from string import Template
import re

load_dotenv()


def is_valid_email(email):
    # Extract the email address using parseaddr
    parsed_email = parseaddr(email)[1]

    # Define a regular expression for basic validation
    regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

    # Check if the parsed email matches the regex pattern
    if re.match(regex, parsed_email):
        return True
    else:
        return False


def send_email_with_ses(name, to_address, email_type, link=None):

    if not is_valid_email(to_address):
        raise Exception('Invalid email address')

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
    elif email_type == "verify":
        subject = "Please verify your email"
        with open("app/email_templates/verify_email.html", 'r', encoding='utf-8') as file:
            html_template = Template(file.read())
        body = html_template.safe_substitute(name=name, link=link)

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


