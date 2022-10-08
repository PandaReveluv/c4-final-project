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
const mockAwsRequest: AWS.Request<AWS.DynamoDB.DocumentClient.QueryOutput, AWS.AWSError> = new Request(new Service(), '');

afterEach(() => {
    jest.clearAllMocks();
});

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
        const expectedQueryOutput = {
            Items: expectedToDoItems
        };
        (documentClient.query as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            const result = await todosAccess.getTodosForUser(userId)
            expect(result.length).toEqual(expectedToDoItems.length)
            expect(result[0]).toEqual(expectedToDoItems[0])
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });

    test('Success get empty ToDos list for user', async () => {
        const expectedEmptyToDoItems: TodoItem[] = [];
        const expectedQueryOutput = {
            Items: expectedEmptyToDoItems
        };
        (documentClient.query as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            const result = await todosAccess.getTodosForUser(userId)
            expect(result.length).toEqual(0)
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });
});

describe('Testing createTodosForUser', () => {

    test('Success create ToDos for user', async () => {
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
        const expectedQueryOutput = {
            Items: expectedToDoItems
        };
        (documentClient.put as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            const result = await todosAccess.getTodosForUser(userId)
            expect(result.length).toEqual(expectedToDoItems.length)
            expect(result[0]).toEqual(expectedToDoItems[0])
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });
});

describe('Testing updateTodosForUser', () => {

    test('Success update ToDos for user', async () => {
        const expectedTodoItem: TodoItem = {
            userId: userId,
            todoId: "todoId",
            createdAt: currentDate.toISOString(),
            name: toDoName,
            dueDate: currentDate.toISOString(),
            done: false,
            attachmentUrl: "https://somepicture.com"
        };
        const expectedToDoItems: TodoItem[] = [expectedTodoItem];
        const expectedQueryOutput = {
            Items: expectedToDoItems
        };
        (documentClient.query as jest.Mock).mockReturnValue(mockAwsRequest);
        (documentClient.update as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            await todosAccess.updateTodosForUser(expectedTodoItem, "todoId", userId)
            expect(documentClient.query).toBeCalled()
            expect(documentClient.update).toBeCalled()
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });

    test('Fail to update ToDos for user', async () => {
        const expectedTodoItem: TodoItem = {
            userId: userId,
            todoId: "todoId",
            createdAt: currentDate.toISOString(),
            name: toDoName,
            dueDate: currentDate.toISOString(),
            done: false,
            attachmentUrl: "https://somepicture.com"
        };
        const expectedToDoItems: TodoItem[] = [];
        const expectedQueryOutput = {
            Items: expectedToDoItems
        };
        (documentClient.query as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            await todosAccess.updateTodosForUser(expectedTodoItem, "todoId", userId)
        } catch (exception) {
            expect(documentClient.query).toBeCalled()
            expect(documentClient.update).not.toBeCalled()
            expect(exception.message).toEqual(`Not found todo item id for user ${userId}`);
        }
    });
});

describe('Testing deleteTodosForUser', () => {

    test('Success delete ToDos for user', async () => {
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
        const expectedQueryOutput = {
            Items: expectedToDoItems
        };
        (documentClient.delete as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            await todosAccess.deleteTodosForUser("todoId", userId)
            expect(documentClient.delete).toBeCalled()
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });
});

describe('Testing generateUploadUrl', () => {

    test('Success generate UploadUrl', async () => {
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
        const expectedQueryOutput = {
            Items: expectedToDoItems
        };
        (documentClient.query as jest.Mock).mockReturnValue(mockAwsRequest);
        (documentClient.update as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            await todosAccess.generateUploadUrl("attachmentId", "todoId", userId)
            expect(documentClient.query).toBeCalled()
            expect(documentClient.update).toBeCalled()
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });

    test('Fail to generate UploadUrl', async () => {
        const expectedToDoItems: TodoItem[] = [];
        const expectedQueryOutput = {
            Items: expectedToDoItems
        };
        (documentClient.query as jest.Mock).mockReturnValue(mockAwsRequest);
        (AWS.Request.prototype.promise as jest.Mock).mockReturnValue(expectedQueryOutput);
        try {
            await todosAccess.generateUploadUrl("attachmentId", "todoId", userId)
        } catch (exception) {
            expect(documentClient.query).toBeCalled()
            expect(documentClient.update).not.toBeCalled()
            expect(exception.message).toEqual('It should not reach here');
        }
    });
});