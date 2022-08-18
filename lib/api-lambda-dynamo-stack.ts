import { Stack, StackProps, Duration, App, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import lambda = require("aws-cdk-lib/aws-lambda");
import fs = require("fs");
import {
  IResource,
  LambdaIntegration,
  MockIntegration,
  PassthroughBehavior,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import events = require("aws-cdk-lib/aws-events");
import targets = require("aws-cdk-lib/aws-events-targets");

export class ApiLambdaDynamoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const nonprofitTable = new Table(this, "NonprofitTable", {
      partitionKey: {
        name: "nonprofit_email",
        type: AttributeType.STRING,
      },
      tableName: "NonprofitTable",
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const FoundationTable = new Table(this, "FoundationTable", {
      partitionKey: {
        name: "foundation_email",
        type: AttributeType.STRING,
      },
      tableName: "FoundationTable",
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const createNonprofitLambda = new lambda.Function(
      this,
      "createNonprofitFunction",
      {
        functionName: "createNonprofitFunction",
        code: new lambda.InlineCode(
          fs.readFileSync("./lambdas/create-nonprofit.py", {
            encoding: "utf-8",
          })
        ),
        handler: "index.main",
        timeout: Duration.seconds(300),
        runtime: lambda.Runtime.PYTHON_3_7,
        memorySize: 128,
        environment: {
          TABLE_NAME: "NonprofitTable",
        },
      }
    );

    const getNonprofitsLambda = new lambda.Function(
      this,
      "getNonprofitsFunction",
      {
        functionName: "getNonprofitsFunction",
        code: new lambda.InlineCode(
          fs.readFileSync("./lambdas/get-nonprofit.py", { encoding: "utf-8" })
        ),
        handler: "index.main",
        timeout: Duration.seconds(300),
        runtime: lambda.Runtime.PYTHON_3_7,
        memorySize: 128,
        environment: {
          TABLE_NAME: "NonprofitTable",
        },
      }
    );

    const createFoundationLambda = new lambda.Function(
      this,
      "createFoundationFunction",
      {
        functionName: "createFoundationFunction",
        code: new lambda.InlineCode(
          fs.readFileSync("./lambdas/create-foundation.py", {
            encoding: "utf-8",
          })
        ),
        handler: "index.main",
        timeout: Duration.seconds(300),
        runtime: lambda.Runtime.PYTHON_3_7,
        memorySize: 128,
        environment: {
          TABLE_NAME: "FoundationTable",
        },
      }
    );

    const getFoundationsLambda = new lambda.Function(
      this,
      "getFoundationsFunction",
      {
        functionName: "getFoundationsFunction",
        code: new lambda.InlineCode(
          fs.readFileSync("./lambdas/get-foundation.py", { encoding: "utf-8" })
        ),
        handler: "index.main",
        timeout: Duration.seconds(300),
        runtime: lambda.Runtime.PYTHON_3_7,
        memorySize: 128,
        environment: {
          TABLE_NAME: "FoundationTable",
        },
      }
    );

    //email nonprofit list lambda
    const emailNonprofitListLambda = new lambda.Function(
      this,
      "emailNonprofitListFunction",
      {
        functionName: "emailNonprofitListFunction",
        code: new lambda.InlineCode(
          fs.readFileSync("./lambdas/email-nonprofit-list.py", {
            encoding: "utf-8",
          })
        ),
        handler: "index.main",
        timeout: Duration.seconds(300),
        runtime: lambda.Runtime.PYTHON_3_7,
        memorySize: 128,
        environment: {
          TABLE_NAME: "NonprofitTable",
        },
      }
    );

    nonprofitTable.grantReadWriteData(getNonprofitsLambda);
    nonprofitTable.grantReadWriteData(createNonprofitLambda);
    FoundationTable.grantReadWriteData(getFoundationsLambda);
    FoundationTable.grantReadWriteData(createFoundationLambda);

    const createNonprofitIntegration = new LambdaIntegration(
      createNonprofitLambda
    );
    const getNonprofitsIntegration = new LambdaIntegration(getNonprofitsLambda);
    const createFoundationIntegration = new LambdaIntegration(
      createFoundationLambda
    );
    const getFoundationsIntegration = new LambdaIntegration(
      getFoundationsLambda
    );

    const emailNonprofitListIntegration = new LambdaIntegration(
      emailNonprofitListLambda
    );

    const api = new RestApi(this, "TemelioDemoApi", {
      restApiName: "TemelioDemoApi",
    });

    const NonprofitTable = api.root.addResource("NonprofitTable");
    NonprofitTable.addMethod("POST", createNonprofitIntegration);
    addCorsOptions(NonprofitTable);

    const NonprofitList = NonprofitTable.addResource("all");
    NonprofitList.addMethod("GET", getNonprofitsIntegration);
    addCorsOptions(NonprofitList);

    const FoundationTable = api.root.addResource("FoundationTable");
    FoundationTable.addMethod("POST", createFoundationIntegration);
    addCorsOptions(FoundationTable);

    const FoundationList = FoundationTable.addResource("all");
    FoundationList.addMethod("GET", getFoundationsIntegration);
    addCorsOptions(FoundationList);

    const EmailNonprofitList = NonprofitTable.addResource("email");
    EmailNonprofitList.addMethod("POST", emailNonprofitListIntegration);
    addCorsOptions(EmailNonprofitList);
  }
}

export function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod(
    "OPTIONS",
    new MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Methods":
              "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      passthroughBehavior: PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    }
  );
}
