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

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('NonprofitTable')

    table.put_item(
        Item={
            'nonprofit_name': body['name'],
            'nonprofit_description': body['description'],
            'nonprofit_website': body['website'],
            'nonprofit_email': body['email'],
            'nonprofit_phone': body['phone'],
            'nonprofit_address': body['address'],
        }
    )

    return {
        "statusCode": 200,
        'body': "Successfully created item in table"
    }
