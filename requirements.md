# Requirements

Your task is to create API endpoints that can do the following: 
* An endpoint that creates and saves nonprofits information and their metadata (name, address, and email)
* An endpoint that creates and saves foundations and their metadata (email)
* An endpoint that takes in a sender email, a list of destination nonprofit emails, and a templated message (i.e. "Sending money to nonprofit { name } at address { address }") and sends the email with the templated fields populated

For the email endpoint, we want to have an audit trail of all the emails we have sent to our nonprofits for our own record keeping.

You can make the following assumptions
* Email is a unique identifier for both nonprofits and foundations
* Assume the data passed into the endpoints will be valid (i.e. you don't need to check for bad request data)

These APIs should persist the data into a database (in-memory would be ideal). For sending email, you typically would rely on using a third-party email sending client such as sendgrid. However, in this exercise, simply mock the email client on the backend and have it print out what the email will look like when someon makes an API request.

don't hesitate to email ruthwick@trytemelio.com for further clarification.
