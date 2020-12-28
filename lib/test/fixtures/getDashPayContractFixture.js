const xazabSchema = require('@xazab/xazab-contract/schema/xazab.schema.json');
const DataContractFactory = require('../../dataContract/DataContractFactory');

const generateRandomIdentifier = require('../utils/generateRandomIdentifier');

const ownerId = generateRandomIdentifier();

/**
 * @return {DataContract}
 */
module.exports = function getDataContractFixture() {
  const factory = new DataContractFactory(() => {});
  return factory.create(ownerId, xazabPaySchema);
};
