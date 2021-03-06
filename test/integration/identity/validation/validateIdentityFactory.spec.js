const createAjv = require('../../../../lib/ajv/createAjv');

const getIdentityFixture = require('../../../../lib/test/fixtures/getIdentityFixture');

const JsonSchemaValidator = require(
  '../../../../lib/validation/JsonSchemaValidator',
);

const { expectValidationError, expectJsonSchemaError } = require(
  '../../../../lib/test/expect/expectError',
);

const validateIdentityFactory = require(
  '../../../../lib/identity/validation/validateIdentityFactory',
);

const JsonSchemaError = require(
  '../../../../lib/errors/JsonSchemaError',
);

const ValidationResult = require('../../../../lib/validation/ValidationResult');

describe('validateIdentityFactory', () => {
  let rawIdentity;
  let validateIdentity;
  let identity;
  let validatePublicKeysMock;

  beforeEach(function beforeEach() {
    const schemaValidator = new JsonSchemaValidator(createAjv());

    validatePublicKeysMock = this.sinonSandbox.stub().returns(new ValidationResult());

    validateIdentity = validateIdentityFactory(
      schemaValidator,
      validatePublicKeysMock,
    );

    identity = getIdentityFixture();

    rawIdentity = identity.toObject();
  });

  describe('id', () => {
    it('should be present', () => {
      rawIdentity.id = undefined;

      const result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('');
      expect(error.params.missingProperty).to.equal('id');
      expect(error.keyword).to.equal('required');

      expect(validatePublicKeysMock).to.not.be.called();
    });

    it('should be a byte array', () => {
      rawIdentity.id = new Array(32).fill('string');

      const result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result, 2);

      const [error, byteArrayError] = result.getErrors();

      expect(error.dataPath).to.equal('.id[0]');
      expect(error.keyword).to.equal('type');

      expect(byteArrayError.keyword).to.equal('byteArray');

      expect(validatePublicKeysMock).to.not.be.called();
    });

    it('should not be less than 32 bytes', () => {
      rawIdentity.id = Buffer.alloc(31);

      const result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.keyword).to.equal('minItems');
      expect(error.dataPath).to.equal('.id');

      expect(validatePublicKeysMock).to.not.be.called();
    });

    it('should not be more than 32 bytes', () => {
      rawIdentity.id = Buffer.alloc(33);

      const result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.keyword).to.equal('maxItems');
      expect(error.dataPath).to.equal('.id');

      expect(validatePublicKeysMock).to.not.be.called();
    });
  });

  describe('balance', () => {
    it('should be present', async () => {
      rawIdentity.balance = undefined;

      const result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('');
      expect(error.params.missingProperty).to.equal('balance');
      expect(error.keyword).to.equal('required');

      expect(validatePublicKeysMock).to.not.be.called();
    });

    it('should be an integer', async () => {
      rawIdentity.balance = 1.2;

      const result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.keyword).to.equal('type');
      expect(error.dataPath).to.equal('.balance');

      expect(validatePublicKeysMock).to.not.be.called();
    });

    it('should be greater or equal 0', async () => {
      rawIdentity.balance = -1;

      let result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.keyword).to.equal('minimum');
      expect(error.dataPath).to.equal('.balance');

      expect(validatePublicKeysMock).to.not.be.called();

      rawIdentity.balance = 0;

      result = validateIdentity(rawIdentity);

      expect(result.isValid()).to.be.true();
    });
  });

  describe('publicKeys', () => {
    it('should be present', () => {
      rawIdentity.publicKeys = undefined;

      const result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('');
      expect(error.params.missingProperty).to.equal('publicKeys');
      expect(error.keyword).to.equal('required');

      expect(validatePublicKeysMock).to.not.be.called();
    });

    it('should be an array', () => {
      rawIdentity.publicKeys = 1;

      const result = validateIdentity(rawIdentity);

      expectValidationError(result, JsonSchemaError, 1);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('.publicKeys');
      expect(error.keyword).to.equal('type');

      expect(validatePublicKeysMock).to.not.be.called();
    });

    it('should not be empty', () => {
      rawIdentity.publicKeys = [];

      const result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.keyword).to.equal('minItems');
      expect(error.dataPath).to.equal('.publicKeys');

      expect(validatePublicKeysMock).to.not.be.called();
    });

    it('should be unique', async () => {
      rawIdentity.publicKeys.push(rawIdentity.publicKeys[0]);

      const result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.keyword).to.equal('uniqueItems');
      expect(error.dataPath).to.equal('.publicKeys');

      expect(validatePublicKeysMock).to.not.be.called();
    });

    it('should throw an error if publicKeys have more than 100 keys', () => {
      const [key] = rawIdentity.publicKeys;

      rawIdentity.publicKeys = [];
      for (let i = 0; i < 101; i++) {
        rawIdentity.publicKeys.push(key);
      }

      const result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.keyword).to.equal('maxItems');
      expect(error.dataPath).to.equal('.publicKeys');

      expect(validatePublicKeysMock).to.not.be.called();
    });
  });

  describe('revision', () => {
    it('should be present', async () => {
      rawIdentity.revision = undefined;

      const result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.dataPath).to.equal('');
      expect(error.params.missingProperty).to.equal('revision');
      expect(error.keyword).to.equal('required');

      expect(validatePublicKeysMock).to.not.be.called();
    });

    it('should be an integer', async () => {
      rawIdentity.revision = 1.2;

      const result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.keyword).to.equal('type');
      expect(error.dataPath).to.equal('.revision');

      expect(validatePublicKeysMock).to.not.be.called();
    });

    it('should be greater or equal 0', async () => {
      rawIdentity.revision = -1;

      let result = validateIdentity(rawIdentity);

      expectJsonSchemaError(result);

      const [error] = result.getErrors();

      expect(error.keyword).to.equal('minimum');
      expect(error.dataPath).to.equal('.revision');

      expect(validatePublicKeysMock).to.not.be.called();

      rawIdentity.revision = 0;

      result = validateIdentity(rawIdentity);

      expect(result.isValid()).to.be.true();
    });
  });

  it('should return valid result if a raw identity is valid', () => {
    const result = validateIdentity(rawIdentity);

    expect(validatePublicKeysMock).to.be.calledOnceWithExactly(rawIdentity.publicKeys);

    expect(result.isValid()).to.be.true();
  });

  it('should return valid result if an identity model is valid', () => {
    const result = validateIdentity(rawIdentity);

    expect(validatePublicKeysMock).to.be.calledOnceWithExactly(rawIdentity.publicKeys);

    expect(result.isValid()).to.be.true();
  });
});
