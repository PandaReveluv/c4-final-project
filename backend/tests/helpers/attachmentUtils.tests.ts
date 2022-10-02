import { getUploadUrl } from "../../src/helpers/attachmentUtils";

describe('Testing getUploadUrl', () => {

    test('Success get UploadUrl', async () => {
        const attachmentId = "attachmentId"
        const result = await getUploadUrl(attachmentId)
        expect(result).toEqual(`https://${process.env.ATTACHMENT_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${attachmentId}`)
    });
});