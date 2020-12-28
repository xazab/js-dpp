const Identifier = require('../identifier/Identifier');

const AbstractDocumentTransition = require('../document/stateTransition/documentTransition/AbstractDocumentTransition');

const DataTrigger = require('./DataTrigger');

const rejectDataTrigger = require('./rejectDataTrigger');
const createDomainDataTrigger = require('./dpnsTriggers/createDomainDataTrigger');
const createContactRequestDataTrigger = require('./xazabDataTriggers/createContactRequestDataTrigger');

/**
 * Get respective data triggers (factory)
 *
 * @return {getDataTriggers}
 */
function getDataTriggersFactory() {
  let dpnsDataContractId = Buffer.alloc(0);
  if (process.env.DPNS_CONTRACT_ID) {
    dpnsDataContractId = Identifier.from(process.env.DPNS_CONTRACT_ID);
  }

  let dpnsTopLevelIdentityId = Buffer.alloc(0);
  if (process.env.DPNS_TOP_LEVEL_IDENTITY) {
    dpnsTopLevelIdentityId = Identifier.from(process.env.DPNS_TOP_LEVEL_IDENTITY);
  }

  let xazabPayDataContractId = Buffer.alloc(0);
  if (process.env.XAZAB_CONTRACT_ID) {
    xazabPayDataContractId = Identifier.from(process.env.XAZAB_CONTRACT_ID);
  }

  const dataTriggers = [
    new DataTrigger(
      dpnsDataContractId,
      'domain',
      AbstractDocumentTransition.ACTIONS.CREATE,
      createDomainDataTrigger,
      dpnsTopLevelIdentityId,
    ),
    new DataTrigger(
      dpnsDataContractId,
      'domain',
      AbstractDocumentTransition.ACTIONS.REPLACE,
      rejectDataTrigger,
      dpnsTopLevelIdentityId,
    ),
    new DataTrigger(
      dpnsDataContractId,
      'domain',
      AbstractDocumentTransition.ACTIONS.DELETE,
      rejectDataTrigger,
      dpnsTopLevelIdentityId,
    ),
    new DataTrigger(
      dpnsDataContractId,
      'preorder',
      AbstractDocumentTransition.ACTIONS.REPLACE,
      rejectDataTrigger,
      dpnsTopLevelIdentityId,
    ),
    new DataTrigger(
      dpnsDataContractId,
      'preorder',
      AbstractDocumentTransition.ACTIONS.DELETE,
      rejectDataTrigger,
      dpnsTopLevelIdentityId,
    ),
    new DataTrigger(
      xazabPayDataContractId,
      'contactRequest',
      AbstractDocumentTransition.ACTIONS.CREATE,
      createContactRequestDataTrigger,
    ),
    new DataTrigger(
      xazabPayDataContractId,
      'contactRequest',
      AbstractDocumentTransition.ACTIONS.REPLACE,
      rejectDataTrigger,
    ),
    new DataTrigger(
      xazabPayDataContractId,
      'contactRequest',
      AbstractDocumentTransition.ACTIONS.DELETE,
      rejectDataTrigger,
    ),
  ];

  /**
   * Get respective data triggers
   *
   * @typedef getDataTriggers
   *
   * @param {Identifier|Buffer} dataContractId
   * @param {string} documentType
   * @param {number} transitionAction
   *
   * @returns {DataTrigger[]}
   */
  function getDataTriggers(dataContractId, documentType, transitionAction) {
    return dataTriggers.filter(
      (dataTrigger) => dataTrigger.isMatchingTriggerForData(
        dataContractId,
        documentType,
        transitionAction,
      ),
    );
  }

  return getDataTriggers;
}

module.exports = getDataTriggersFactory;
