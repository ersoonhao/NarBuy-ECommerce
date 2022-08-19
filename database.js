const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const dynamoose = require("dynamoose");


dynamoose.aws.sdk.config.update({
    "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
    "region": "ap-southeast-1"
});

const ProductModel = require("./models/product");
const ProductCategoryModel = require("./models/productCategory");
const TransactionModel = require("./models/transaction");

const client = new DynamoDBClient();

module.exports = { client };
