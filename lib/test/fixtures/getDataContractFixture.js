const generateRandomIdentifier = require('../utils/generateRandomIdentifier');

const DataContractFactory = require('../../dataContract/DataContractFactory');

const randomOwnerId = generateRandomIdentifier();

const Identifier = require('../../identifier/Identifier');

/**
 *
 * @param {Buffer} [ownerId]
 * @return {DataContract}
 */
module.exports = function getDataContractFixture(ownerId = randomOwnerId) {
  const documents = {
    niceDocument: {
      properties: {
        name: {
          type: 'string',
        },
      },
      required: ['$createdAt'],
      additionalProperties: false,
    },
    prettyDocument: {
      properties: {
        lastName: {
          $ref: '#/definitions/lastName',
        },
      },
      required: ['lastName', '$updatedAt'],
      additionalProperties: false,
    },
    indexedDocument: {
      indices: [
        {
          properties: [
            { $ownerId: 'asc' },
            { firstName: 'desc' },
          ],
          unique: true,
        },
        {
          properties: [
            { $ownerId: 'asc' },
            { lastName: 'desc' },
          ],
          unique: true,
        },
        {
          properties: [
            { $id: 'asc' },
            { lastName: 'asc' },
          ],
        },
        {
          properties: [
            { $createdAt: 'asc' },
            { $updatedAt: 'asc' },
          ],
        },
        {
          properties: [
            { $updatedAt: 'asc' },
          ],
        },
      ],
      properties: {
        firstName: {
          type: 'string',
          maxLength: 256,
        },
        lastName: {
          type: 'string',
          maxLength: 256,
        },
      },
      required: ['firstName', '$createdAt', '$updatedAt', 'lastName'],
      additionalProperties: false,
    },
    noTimeDocument: {
      properties: {
        name: {
          type: 'string',
        },
      },
      additionalProperties: false,
    },
    uniqueDates: {
      indices: [
        {
          properties: [
            { $createdAt: 'asc' },
            { $updatedAt: 'asc' },
          ],
          unique: true,
        },
        {
          properties: [
            { $updatedAt: 'asc' },
          ],
        },
      ],
      properties: {
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
      },
      required: ['firstName', '$createdAt', '$updatedAt'],
      additionalProperties: false,
    },
    withByteArrays: {
      indices: [
        {
          properties: [
            { byteArrayField: 'asc' },
          ],
        },
      ],
      properties: {
        byteArrayField: {
          type: 'array',
          byteArray: true,
          maxItems: 16,
        },
        identifierField: {
          type: 'array',
          byteArray: true,
          contentMediaType: Identifier.MEDIA_TYPE,
          minItems: 32,
          maxItems: 32,
        },
      },
      required: ['byteArrayField'],
      additionalProperties: false,
    },
    optionalUniqueIndexedDocument: {
      properties: {
        firstName: {
          type: 'string',
          maxLength: 256,
        },
        lastName: {
          type: 'string',
          maxLength: 256,
        },
        country: {
          type: 'string',
          maxLength: 256,
        },
        city: {
          type: 'string',
          maxLength: 256,
        },
      },
      indices: [
        {
          properties: [
            { firstName: 'desc' },
          ],
          unique: true,
        },
        {
          properties: [
            { $id: 'asc' },
            { $ownerId: 'asc' },
            { firstName: 'asc' },
            { lastName: 'asc' },
          ],
          unique: true,
        },
        {
          properties: [
            { country: 'asc' },
            { city: 'asc' },
          ],
          unique: true,
        },
      ],
      required: ['firstName', 'lastName'],
      additionalProperties: false,
    },
  };

  const factory = new DataContractFactory(
    () => {},
  );

  const dataContract = factory.create(ownerId, documents);

  dataContract.setDefinitions({
    lastName: {
      type: 'string',
    },
  });

  return dataContract;
};
