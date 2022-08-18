import requests
import boto3
import json


def main(event, context):
    try:
        body = json.loads(event['body'])
        print(body)
    except:
        return{
            'statusCode': 200,
            'body': "unable to read event body"
        }

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('FoundationTable')

    table.put_item(
        Item={
            'foundation_name': body['name'],
            'foundation_description': body['description'],
            'foundation_website': body['website'],
            'foundation_email': body['email'],
            'foundation_phone': body['phone'],
            'foundation_address': body['address'],
        }
    )

    return {
        "statusCode": 200,
        'body': "Successfully created item in table"
    }
