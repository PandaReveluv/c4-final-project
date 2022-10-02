module.exports = {
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    testEnvironment: 'node',
    testRegex: '/tests/.*\\.(tests|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    restoreMocks: true
};
process.env = Object.assign(process.env, {
    ATTACHMENT_S3_BUCKET: 'S3-Test-Bucket',
    AWS_REGION: 'us-east-1'
  });