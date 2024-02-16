const path = require("path");

const datatypes = "http://purolator.com/pws/datatypes";

const responses = {
  Estimating: {
    Quick: {
      method: "GetQuickEstimate",
      responseKey: "ShipmentEstimates.ShipmentEstimate",
      apiVersion: "2.0",
    },
    Full: {
      method: "GetFullEstimate",
      responseKey: "ShipmentEstimates.ShipmentEstimate",
      apiVersion: "2.0",
    },
  },
  Shipping: {
    Create: {
      method: "CreateShipment",
      responseKey: "ShipmentPIN.Value",
      apiVersion: "2.2",
    },
    Void: {
      method: "VoidShipment",
      responseKey: "ShipmentPIN.Value",
      apiVersion: "2.0",
    },
  },
  ShippingDocuments: {
    Retrieve: {
      method: "GetDocuments",
      responseKey: "Documents.Document",
      apiVersion: "1.3",
    },
  },
  ServiceAvailability: {
    Validate: {
      method: "ValidateCityPostalCodeZip",
      responseKey: "SuggestedAddresses.SuggestedAddress",
      apiVersion: "2.0",
    },
  },
};

const getWSDL = (serviceName, isSandbox) =>
  path.join(
    process.cwd(),
    'node_modules/nodejs_purolator_api/',
    isSandbox
      ? `./wsdl/Development/${serviceName}Service.wsdl`
      : `./wsdl/Production/${serviceName}Service.wsdl`
  );

module.exports = {
  datatypes,
  responses,
  getWSDL,
};
