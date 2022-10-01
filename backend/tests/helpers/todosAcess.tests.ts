import { TodosAccess } from "../../src/helpers/todosAcess"
import { TodoItem } from "../../src/models/TodoItem"
import { createLogger } from "../../src/utils/logger"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import * as AWS from "aws-sdk"
import { Request, Service } from "aws-sdk"

jest.mock('aws-xray-sdk')
jest.mock('aws-sdk')
jest.mock('aws-sdk/clients/dynamodb')

const documentClient: DocumentClient = new DocumentClient()

const todosAccess = new TodosAccess(documentClient, "tableTodos", createLogger("ToDoAcessTest"))
const currentDate = new Date()
const toDoName = "todoName"
const userId = "user"
const awsRequest: AWS.Request<AWS.DynamoDB.DocumentClient.QueryOutput, AWS.AWSError> = new Request(new Service(), '');

describe('Testing getTodosForUser', () => {

    test('Success get ToDos for user', async () => {
        const expectedTodoItem: TodoItem = {
            userId: userId,
            todoId: "todoId",
            createdAt: currentDate.toISOString(),
            name: toDoName,
            dueDate: currentDate.toISOString(),
            done: false,
            attachmentUrl: "https://somepicture.com"
        }
        const expectedToDoItems: TodoItem[] = [expectedTodoItem];
        const QueryOutput = {
            Items: expectedToDoItems
        };
        (documentClient.query as jest.Mock).mockReturnValue(awsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(QueryOutput);
        try {
            const result = await todosAccess.getTodosForUser(userId)
            expect(result.length).toEqual(expectedToDoItems.length)
            expect(result[0]).toEqual(expectedToDoItems[0])
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });
});