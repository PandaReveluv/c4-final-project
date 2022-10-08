import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../../src/auth/utils";
import { getUserId } from "../../src/lambda/utils";

jest.mock('../../src/auth/utils')

const mockEvent: APIGatewayProxyEvent = {
    body: "",
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
describe('Testing getUserId', () => {

    test('Success get UserId', async () => {
        const expectedUserId = "userId";
        (parseUserId as jest.Mock).mockReturnValue(expectedUserId);
        try {
            const result = getUserId(mockEvent)
            expect(result).toEqual(expectedUserId)
        } catch (exception) {
            expect(exception.message).toEqual('It should not reach here');
        }
    });
});