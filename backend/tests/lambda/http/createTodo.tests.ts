import { createTodo } from "../../../src/helpers/todos";
import { getUserId } from "../../../src/lambda/utils";
import { TodoItem } from "../../../src/models/TodoItem";
import { CreateTodoRequest } from "../../../src/requests/CreateTodoRequest";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handler } from "../../../src/lambda/http/createTodo";
import * as middy from "middy";

jest.mock('../../../src/lambda/utils');
jest.mock('../../../src/helpers/todos');
jest.mock('middy');

const userId = "userId"
const toDoName = "todoName"
const currentDate = new Date()
const expectedTodoItem: TodoItem = {
    userId: userId,
    todoId: "todoId",
    createdAt: currentDate.toISOString(),
    name: toDoName,
    dueDate: currentDate.toISOString(),
    done: false,
    attachmentUrl: "https://somepicture.com"
}
const createTodoRequest: CreateTodoRequest = {
    name: toDoName,
    dueDate: currentDate.toISOString()
};
const mockEvent: APIGatewayProxyEvent = {
    body: JSON.stringify(createTodoRequest),
    headers: {
        Authorization: "Bearer test-token"
    },
    multiValueHeaders: undefined,
    httpMethod: "",
    isBase64Encoded: false,
    path: "",
    pathParameters: undefined,
    queryStringParameters: undefined,
    multiValueQueryStringParameters: undefined,
    stageVariables: undefined,
    requestContext: undefined,
    resource: ""
};
const expectedResponse: APIGatewayProxyResult = {
    statusCode: 201,
    body: JSON.stringify({
        expectedTodoItem
      }),
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
};

describe('Testing createTodo handler', () => {

    test('Success get UserId', async () => {
        const mi: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = {
            use: function <C extends middy.MiddlewareObject<APIGatewayProxyEvent, APIGatewayProxyResult>>(middleware: C): middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> {
                throw new Error("Function not implemented.");
            },
            before: function (callbackFn: middy.MiddlewareFunction<APIGatewayProxyEvent, APIGatewayProxyResult>): middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> {
                throw new Error("Function not implemented.");
            },
            after: function (callbackFn: middy.MiddlewareFunction<APIGatewayProxyEvent, APIGatewayProxyResult>): middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> {
                throw new Error("Function not implemented.");
            },
            onError: function (callbackFn: middy.MiddlewareFunction<APIGatewayProxyEvent, APIGatewayProxyResult>): middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> {
                throw new Error("Function not implemented.");
            }
        };
        // (JSON.parse as jest.Mock).mockReturnValue(createTodoRequest)
        (getUserId as jest.Mock).mockReturnValue(userId);
        (createTodo as jest.Mock).mockReturnValue(expectedTodoItem);
        (middy as jest.Mock).mockReturnValue(expectedResponse)
        try {
            const result = await handler(mockEvent, null, null);
            expect(result).toBe(expectedResponse)
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });
});