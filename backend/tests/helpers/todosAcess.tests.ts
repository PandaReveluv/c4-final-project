import { TodosAccess } from "../../src/helpers/todosAcess"
import { TodoItem } from "../../src/models/TodoItem"
import { createLogger } from "../../src/utils/logger"
import * as AWS from "aws-sdk"

const AWSXRay = require('aws-xray-sdk')
const XAWS = (AWSXRay.captureAWS as jest.Mock).mockReturnValue(AWS)

jest.mock('aws-xray-sdk')
jest.mock('aws-sdk')

const documentClient = new XAWS.DynamoDB.DocumentClient()

const todosAccess = new TodosAccess(documentClient, "tableTodos", createLogger("ToDoAcessTest"))
const currentDate = new Date()
const toDoName = "todoName"
const userId = "user"

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
        (documentClient.query as jest.Mock).mockReturnValue(QueryOutput)
        try {
            const result = await todosAccess.getTodosForUser(userId)
            console.log(result)
            expect(result.length).toEqual(expectedToDoItems.length)
            expect(result[0]).toEqual(expectedToDoItems[0])
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });
});