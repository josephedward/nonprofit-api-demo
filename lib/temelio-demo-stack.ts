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

export class TemelioDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const NonprofitTable = new Table(this, "NonprofitTable", {
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
          fs.readFileSync("./lambdas/get-all-nonprofit.py", { encoding: "utf-8" })
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
          fs.readFileSync("./lambdas/get-all-foundation.py", { encoding: "utf-8" })
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

    NonprofitTable.grantReadWriteData(getNonprofitsLambda);
    NonprofitTable.grantReadWriteData(createNonprofitLambda);
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

    const nonprofitData = api.root.addResource("NonprofitTable");
    nonprofitData.addMethod("POST", createNonprofitIntegration);
    addCorsOptions(nonprofitData);

    const allNonprofits = nonprofitData.addResource("all");
    allNonprofits.addMethod("GET", getNonprofitsIntegration);
    addCorsOptions(allNonprofits);

    const foundationData = api.root.addResource("FoundationTable");
    foundationData.addMethod("POST", createFoundationIntegration);
    addCorsOptions(foundationData);

    const allFoundations = foundationData.addResource("all");
    allFoundations.addMethod("GET", getFoundationsIntegration);
    addCorsOptions(allFoundations);

    const emailNonprofitList = api.root.addResource("email");
    emailNonprofitList.addMethod("POST", emailNonprofitListIntegration);
    addCorsOptions(emailNonprofitList);
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
