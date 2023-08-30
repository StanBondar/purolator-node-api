const path = require('path');

const datatypes = 'http://purolator.com/pws/datatypes';

const responses = {
  Estimating: {
    Quick: {
      method: 'GetQuickEstimate',
      responseKey: 'ShipmentEstimates.ShipmentEstimate',
      apiVersion: "2.0"
    },
    Full: {
      method: 'GetFullEstimate',
      responseKey: 'ShipmentEstimates.ShipmentEstimate',
      apiVersion: "2.0"
    },
  },
  Shipping: {
    Create: {
      method: 'CreateShipment',
      responseKey: 'ShipmentPIN.Value',
      apiVersion: "2.0"
    }
  },
  ShippingDocuments: {
    Retrieve: {
      method: 'GetDocuments',
      responseKey: 'Documents.Document',
      apiVersion: "1.3"
    }
  },
};

const getWSDL = (n, isSandbox) =>
  path.join(
    process.cwd(),
    'node_modules/nodejs_purolator_api/',
    isSandbox
      ? `./wsdl/Development/${n}Service.wsdl`
      : `./wsdl/Production/${n}Service.wsdl`
  );

  module.exports = {
    datatypes,
    responses,
    getWSDL
  }