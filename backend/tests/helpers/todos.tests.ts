import { AttachmentUtils } from "../../src/helpers/attachmentUtils";
import { createAttachmentPresignedUrl, createTodo, deleteTodo, getTodosForUser, updateTodo } from "../../src/helpers/todos";
import { TodosAccess } from "../../src/helpers/todosAcess"
import { TodoItem } from "../../src/models/TodoItem";
import { CreateTodoRequest } from "../../src/requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../../src/requests/UpdateTodoRequest";
import * as AWSXRay from 'aws-xray-sdk';
import * as AWS from 'aws-sdk'

jest.mock('../../src/helpers/todosAcess')
jest.mock('../../src/helpers/attachmentUtils')
jest.spyOn(AWSXRay, 'captureAWS')

const XAWS = AWSXRay.captureAWS(AWS)
const S3 = new XAWS.S3({
    signatureVersion: 'v4'
})
const attachmentUtils = new AttachmentUtils(S3)
const currentDate = new Date()
const toDoName = "todoName"
const userId = "user"
const expectedTodoItem: TodoItem = {
    userId: userId,
    todoId: "todoId",
    createdAt: currentDate.toISOString(),
    name: toDoName,
    dueDate: currentDate.toISOString(),
    done: false,
    attachmentUrl: "https://somepicture.com"
}

describe('Testing getToDos', () => {

    test('Success get todos', async () => {
        const expectedToDoItems: TodoItem[] = [expectedTodoItem];
        (TodosAccess.prototype.getTodosForUser as jest.Mock).mockReturnValue(expectedToDoItems)
        try {
            const result = await getTodosForUser(userId)
            expect(result.length).toEqual(expectedToDoItems.length)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });

    test('Success get empty todos array with new user', async () => {
        const emptyToDoItems: TodoItem[] = [];
        (TodosAccess.prototype.getTodosForUser as jest.Mock).mockReturnValue(emptyToDoItems)
        try {
            const result = await getTodosForUser("new_user")
            console.log(result.length)
            console.log(result)
            expect(result.length).toEqual(0)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });
});

describe('Testing createTodo', () => {

    test('Success create todo', async () => {
        const createTodoRequest: CreateTodoRequest = {
            name: toDoName,
            dueDate: currentDate.toISOString()
        };
        (TodosAccess.prototype.createTodosForUser as jest.Mock).mockReturnValue(expectedTodoItem)
        try {
            const result = await createTodo(createTodoRequest, userId)
            expect(result).toEqual(expectedTodoItem)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });

    test('Success create todo with empty parameter', async () => {
        const emptyCreateTodoRequest: CreateTodoRequest = {
            name: '',
            dueDate: ''
        };
        (TodosAccess.prototype.createTodosForUser as jest.Mock).mockReturnValue(expectedTodoItem)
        try {
            const result = await createTodo(emptyCreateTodoRequest, userId)
            expect(result).toEqual(expectedTodoItem)
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });
});

describe('Testing updateToDo', () => {

    test('Success update todo', async () => {
        const updateTodoRequest: UpdateTodoRequest = {
            name: toDoName,
            dueDate: currentDate.toISOString(),
            done: true
        };
        const todoId = "toDoId";
        (TodosAccess.prototype.updateTodosForUser as jest.Mock).mockReturnValue('')
        try {
            const result = await updateTodo(updateTodoRequest, todoId, userId)
            expect(result).toEqual('')
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });

    test('Fail to update todo', async () => {
        const updateTodoRequest: UpdateTodoRequest = {
            name: toDoName,
            dueDate: currentDate.toISOString(),
            done: true
        };
        const todoId = "toDoId";
        const error = new Error(`Not found todo item id for user ${userId}`);
        (TodosAccess.prototype.updateTodosForUser as jest.Mock).mockRejectedValue(error)
        try {
            const result = await updateTodo(updateTodoRequest, todoId, userId)
            expect(result).toEqual('It should not reach here')
        } catch (exception) {
            expect(exception.message).toBe(error.message);
        }
    });
});

describe('Testing deleteToDo', () => {

    test('Success delete todo', async () => {
        const todoId = "toDoId";
        (TodosAccess.prototype.deleteTodosForUser as jest.Mock).mockReturnValue('')
        try {
            const result = await deleteTodo(todoId, userId)
            expect(result).toEqual('')
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });
});

describe('Testing createAttachmentPresignedUrl', () => {

    test('Success create AttachmentPresignedUrl', async () => {
        const todoId = "toDoId";
        const attachmentId = "attachmentId";
        const attachmentUrl = "https://somepicture.com";
        (attachmentUtils.getUploadUrl as jest.Mock).mockReturnValue(attachmentUrl);
        (TodosAccess.prototype.generateUploadUrl as jest.Mock).mockReturnValue('');
        try {
            const result = await createAttachmentPresignedUrl(todoId, attachmentId, userId)
            expect(result).toEqual('')
        } catch (exception) {
            expect(exception.message).toBe('It should not reach here');
        }
    });

    test('Fail to create AttachmentPresignedUrl', async () => {
        const todoId = "toDoId";
        const attachmentId = "attachmentId";
        const attachmentUrl = "https://somepicture.com";
        const error = new Error(`Not found todo item id for user ${userId}`);
        (attachmentUtils.getUploadUrl as jest.Mock).mockReturnValue(attachmentUrl);
        (TodosAccess.prototype.generateUploadUrl as jest.Mock).mockRejectedValue(error);
        try {
            const result = await createAttachmentPresignedUrl(todoId, attachmentId, userId)
            expect(result).toEqual('It should not reach here')
        } catch (exception) {
            expect(exception.message).toBe(error.message);
        }
    });
});