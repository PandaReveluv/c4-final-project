import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import * as AWS from 'aws-sdk';

const dynamoDBClient = new AWS.DynamoDB.DocumentClient

// TODO: Implement businessLogic
export async function getTodosForUser(userId: string) {
    let result:TodoItem[]
    const items = await dynamoDBClient
    .query({
      TableName: 'Items',
      IndexName: 'index-name',
      KeyConditionExpression: 'paritionKey = :paritionKey',
      ExpressionAttributeValues: {
        ':paritionKey': userId
      }
    })
    .promise()

    items.Items.forEach(item => {
        let toDoItem: TodoItem
        toDoItem.userId = item.userId
        toDoItem.todoId = item.todoId
        toDoItem.createdAt = item.createdAt
        toDoItem.name = item.name
        toDoItem.dueDate = item.dueDate
        toDoItem.done = item.done
        toDoItem.attachmentUrl = item.attachmentUrl
        result.push()
    })
    return result
}