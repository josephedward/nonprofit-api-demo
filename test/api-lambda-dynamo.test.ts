// import * as cdk from "aws-cdk-lib";
// import { Template } from "aws-cdk-lib/assertions";
// import { Lambda } from "aws-cdk-lib/aws-ses-actions";
// import * as ApiLambdaDynamo from "../lib/temelio-demo-stack";

// const app = new cdk.App();
// // WHEN
// const stack = new ApiLambdaDynamo.ApiLambdaDynamoStack(app, "MyTestStack");
// // THEN
// const template = Template.fromStack(stack);

// test("Api Gateway Created", () => {

//   template.hasResourceProperties("AWS::ApiGateway::RestApi", {
//     Name: "stockDataApi",
//   });
// });

// test("DynamoDB Table Created", () => {

//   template.hasResourceProperties("AWS::DynamoDB::Table", {
//     TableName: "StockData",
//     AttributeDefinitions: [
//       {
//         AttributeName: "dateString",
//         AttributeType: "S",
//       },
//       {
//         AttributeName: "timeString",
//         AttributeType: "S",
//       },
//     ],
//     KeySchema: [
//       {
//         AttributeName: "dateString",
//         KeyType: "HASH",
//       },
//       {
//         AttributeName: "timeString",
//         KeyType: "RANGE",
//       },
//     ],
//   });
// });

// test("Lambda Function Created", () => {

//   template.hasResourceProperties("AWS::Lambda::Function", {
//     FunctionName: "createOneFunction",
//     Handler: "index.main",
//     MemorySize: 128,
//     Runtime: "python3.7",
//     Timeout: 300,
//     Environment: {
//       Variables: {
//         PRIMARY_KEY: "dateString",
//         SORT_KEY: "timeString",
//         TABLE_NAME: "StockData",
//       },
//     },
//   });
// });

// test("Lambda Function Created", () => {

//   template.hasResourceProperties("AWS::Lambda::Function", {
//     FunctionName: "getOneFunction",
//     Handler: "index.main",
//     MemorySize: 128,
//     Runtime: "python3.7",
//     Timeout: 300,
//     Environment: {
//       Variables: {
//         PRIMARY_KEY: "dateString",
//         SORT_KEY: "timeString",
//         TABLE_NAME: "StockData",
//       },
//     },
//   });
// });

// test("Lambda Function Created", () => {

//   template.hasResourceProperties("AWS::Lambda::Function", {
//     FunctionName: "getAllFunction",
//     Handler: "index.main",
//     MemorySize: 128,
//     Runtime: "python3.7",
//     Timeout: 300,
//     Environment: {
//       Variables: {
//         PRIMARY_KEY: "dateString",
//         SORT_KEY: "timeString",
//         TABLE_NAME: "StockData",
//       },
//     },
//   });
// });

// test("Cronjob Created", () => {
//   template.hasResourceProperties("AWS::Events::Rule", {
//     ScheduleExpression: "rate(1 hour)",
//   });

//   template.hasResourceProperties("AWS::Lambda::Function", {
//     FunctionName: "cronJobFunction",
//     Handler: "index.main",
//     MemorySize: 128,
//     Runtime: "python3.7",
//     Timeout: 300,
//     Environment: {
//       Variables: {
//         PRIMARY_KEY: "dateString",
//         SORT_KEY: "timeString",
//         TABLE_NAME: "StockData",
//       },
//     }
//   });
// });
