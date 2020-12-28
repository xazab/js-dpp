const Ajv = require('ajv');

const XazabPlatformProtocol = require('../../lib/XazabPlatformProtocol');
const JsonSchemaValidator = require('../../lib/validation/JsonSchemaValidator');

const createStateRepositoryMock = require('../../lib/test/mocks/createStateRepositoryMock');

describe('XazabPlatformProtocol', () => {
  let dpp;
  let stateRepositoryMock;
  let jsonSchemaValidatorMock;
  let skipAssetLockProofSignatureVerification;

  beforeEach(function beforeEach() {
    stateRepositoryMock = createStateRepositoryMock(this.sinonSandbox);
    jsonSchemaValidatorMock = {};
    skipAssetLockProofSignatureVerification = true;

    dpp = new XazabPlatformProtocol({
      stateRepository: stateRepositoryMock,
      jsonSchemaValidator: jsonSchemaValidatorMock,
      identities: {
        skipAssetLockProofSignatureVerification,
      },
    });
  });

  describe('constructor', () => {
    it('should create JsonSchemaValidator if not passed in options', () => {
      dpp = new XazabPlatformProtocol();

      const jsonSchemaValidator = dpp.getJsonSchemaValidator();

      expect(jsonSchemaValidator).to.be.instanceOf(JsonSchemaValidator);
      expect(jsonSchemaValidator.ajv).to.be.instanceOf(Ajv);
    });
  });

  describe('getStateRepository', () => {
    it('should return StateRepository', () => {
      const result = dpp.getStateRepository();

      expect(result).to.equal(stateRepositoryMock);
    });
  });

  describe('getJsonSchemaValidator', () => {
    it('should return JsonSchemaValidator', () => {
      const result = dpp.getJsonSchemaValidator();

      expect(result).to.equal(jsonSchemaValidatorMock);
    });
  });
});
