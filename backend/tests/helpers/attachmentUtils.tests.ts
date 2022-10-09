import { AttachmentUtils } from "../../src/helpers/DataAccess/attachmentUtils";
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

jest.mock('aws-sdk')
jest.spyOn(AWSXRay, 'captureAWS')

const attachmentId = "attachmentId"
const XAWS = AWSXRay.captureAWS(AWS)
const S3 = new XAWS.S3({
    signatureVersion: 'v4'
})
const attachmentUtils = new AttachmentUtils(S3)

describe('Testing getUploadUrl', () => {

    test('Success get UploadUrl', async () => {
        const result = await attachmentUtils.getUploadUrl(attachmentId)
        expect(result).toEqual(`https://${process.env.ATTACHMENT_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${attachmentId}`)
    });
});

describe('Testing createPresignedUrl', () => {

    test('Success create PresignedUrl', async () => {
        const expectedPresignedUrl = "http://presignedUrl";
        (S3.getSignedUrl as jest.Mock).mockReturnValue(expectedPresignedUrl)
        const result = await attachmentUtils.createPresignedUrl(attachmentId)
        expect(result).toEqual(expectedPresignedUrl)
    });
});