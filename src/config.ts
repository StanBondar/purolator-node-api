import path from 'path';

const datatypes = 'http://purolator.com/pws/datatypes';

interface IResponseConfig {
  [key: string]: {
    [key: string]: {
      method: string;
      responseKey: string;
      apiVersion: string;
    };
  };
}

const responses: IResponseConfig = {
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
  ServiceAvailability: {
    Validate: {
      method: 'ValidateCityPostalCodeZip',
      responseKey: 'SuggestedAddresses.SuggestedAddress',
      apiVersion: "2.0"
    }
  },
};

const getWSDL = (n: string, isSandbox: boolean) =>
  path.join(
    process.cwd(),
    'node_modules/nodejs_purolator_api/build/',
    isSandbox
      ? `./wsdl/Development/${n}Service.wsdl`
      : `./wsdl/Production/${n}Service.wsdl`
  );

// module.exports = {
//   datatypes,
//   responses,
//   getWSDL
// }

export { datatypes, responses, getWSDL };