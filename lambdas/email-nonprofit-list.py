import requests
import boto3
import json


def main(event, context):
    try:
        body = json.loads(event['body'])
        print(body)
    except:
        return {
            'statusCode': 200,
            'body': "unable to read event body"
        }

    
    #get sender email address
    sender = body['sender']
    # get list of recipient email addresses
    recipients = body['recipients']

    # set nonprofit name
    nonprofit_name = body['nonprofit_name']

    # set nonprofit address 
    nonprofit_address = body['nonprofit_address']

    # set up the email
    subject = "Donations to " + nonprofit_name
    
    # get the body of the email
    email_body = f'Sending money to nonprofit { nonprofit_name } at address { nonprofit_address }.'

    # set up the email message
    # message = f'Subject: { subject }\n\n{ email_body }'

    # set up the email
    email = {
        'Subject': subject,
        'Body': {
            'Text': {
                'Data': email_body
            }
        },
        'Source': sender,
        'Destinations': recipients
    }

    # # set up the client
    # client = boto3.client('ses')

    # # send the email
    # response = client.send_email(
    #     Source=sender,
    #     Destination={
    #         'ToAddresses': recipients
    #     },
    #     Message=email
    # )



    return {
        "statusCode": 200,
        'body': json.dumps(email)
    }
