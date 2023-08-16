import soap from 'soap';
import * as config from './config.js'
import { invoke } from "./helpers.js";

// const KEY = "1c3d5cf62bda4648a370f5b3cd4edff0";
// const PASS = "(Hxl9{LN";
// const ACCOUNT_NUMBER = "9999999999";

const prefix = (obj = {}, frontmatter = '') => {
  const reassignKeyValue = (input) =>
    Object.entries(input).reduce(
      (output, [key, value]) =>
        Object.assign(output, {
          [`${frontmatter}:${key}`]:
            typeof value === 'object'
              ? reassignKeyValue(value)
              : value,
        }),
      {},
    );

  return reassignKeyValue(obj);
};

export class PurolatorAPI {
  constructor(key, password, isSandbox = true) {
    this.version = 2;
    this.namespace = 'ns1';
    this.authToken = new soap.BasicAuthSecurity(
      key,
      password,
    );
    this.isSandbox = isSandbox;
  }

  $appendHeaders(e, apiVersion) {
    const [majorVersion = 2, minorVersion = 0] = apiVersion.split('.');
    const ns1 = `${config.datatypes}/v${majorVersion}`;
    const headers = prefix(
      {
        RequestContext: {
          Version: `${majorVersion}.${minorVersion}`,
          Language: 'en',
          GroupID: 'xxx',
          RequestReference: this.constructor.name,
        },
      },
      this.namespace,
    );

    e.wsdl.definitions.xmlns.ns1 = ns1;
    e.wsdl.xmlnsInEnvelope = e.wsdl._xmlnsMap();
    e.setSecurity(this.authToken);
    e.addSoapHeader(headers);
    return e;
  }

  async createShipment(body) {
    return this.$req('Shipping.Create', body);
  }

  async estimateRate(body) {
    return this.$req('Estimating.Quick', body);
  }

  async retrieveDocuments(body) {
    return this.$req('ShippingDocuments.Retrieve', body);
  }

  async $req(serviceName, body) {
    const payload = prefix(body, this.namespace);
    const name = config.getWSDL(serviceName.split('.')[0], this.isSandbox);
    const [responseKind, responseType] = serviceName.split('.')

    const { method, responseKey, apiVersion } = config.responses[responseKind][responseType]

    const params = {
      returnFault: true,
      envelopeKey: 'SOAP-ENV',
      xmlKey: this.namespace,
      overrideRootElement: {
        namespace: this.namespace,
      },
    };

    return soap
      .createClientAsync(name, params)
      .then((e) => this.$appendHeaders(e, apiVersion))
      .then(invoke(`${method}Async`, payload))
      .then(resp => {
        const [deepKey, deeperKey] = responseKey.split('.')
        const response = resp[0][deepKey][deeperKey];
        console.log(`${method}:`, response);
        return response;
      })
      .catch(err => {
        console.error(err)
      });
  }
}

// const client = new PurolatorAPI(KEY, PASS)

// client.estimateRate({
//     BillingAccountNumber: ACCOUNT_NUMBER,
//     SenderPostalCode: "L4W5M8",
//     ReceiverAddress: {
//       City: "Burnaby",
//       Province: "BC",
//       Country: "CA",
//       PostalCode: "V5C5A9",
//     },
//     PackageType: "CustomerPackaging",
//     TotalWeight: {
//       Value: 10,
//       WeightUnit: "lb",
//     },
//   }
// )

// client.createShipment({
//       "Shipment": {
//         "SenderInformation": {
//           "Address": {
//             "Name": "Sender Name",
//             "Company": "United Chargers",
//             "Department": "Web Services",
//             "StreetNumber": "1234",
//             "StreetName": "25 POLLARD",
//             "StreetType": "Street",
//             "City": "RICHMOND HILL",
//             "Province": "ON",
//             "Country": "CA",
//             "PostalCode": "L4B 1A8",
//             "PhoneNumber": {
//               "CountryCode": "1",
//               "AreaCode": "905",
//               "Phone": "5555555"
//             }
//           }
//         },
//         "ReceiverInformation": {
//           "Address": {
//             "Name": "Receiver Name",
//             "Company": "Purolator Ltd",
//             "Department": "Web Services",
//             "StreetNumber": "2245",
//             "StreetName": "Suite 509, 14-1860 Appleby Line",
//             "StreetType": "Drive",
//             "City": "MISSISSAUGA",
//             "Province": "ON",
//             "Country": "CA",
//             "PostalCode": "L5N3B5",
//             "PhoneNumber": {
//               "CountryCode": "1",
//               "AreaCode": "604",
//               "Phone": "2982181"
//             }
//           }
//         },
//         "PackageInformation": {
//           "ServiceID": "PurolatorExpressEnvelope",
//           "TotalWeight": {
//             "Value": 1,
//             "WeightUnit": "lb"
//           },
//           "TotalPieces": 1,
//         },
//         "PaymentInformation": {
//           "PaymentType": "Sender",
//           "RegisteredAccountNumber": ACCOUNT_NUMBER,
//           "BillingAccountNumber": ACCOUNT_NUMBER
//         },
//         "PickupInformation": {
//           "PickupType": "DropOff"
//         },
//         "TrackingReferenceInformation": {
//           "Reference1": "Reference For Shipment"
//         }
//       },
//       "PrinterType": "Thermal"
//     });

// client.retrieveDocuments({
//   "DocumentCriterium": {
//     "DocumentCriteria": {
//       "PIN": {
//         "Value": "329037227900"
//       },
//       "DocumentTypes": {
//         "DocumentType": "DomesticBillOfLading"
//       }
//     }
//   },
//   "OutputType": "ZPL",
//   "Synchronous": true,
//   "SynchronousSpecified": true
// })