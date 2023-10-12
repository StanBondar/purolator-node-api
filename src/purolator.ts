
import * as soap from 'soap';
import * as config from './config.js';
import { invoke } from "./helpers.js";
import { ICreateShipmentRequest, IEstimateRateRequest, IRate, IRetrieveDocumentsRequest, IValidateAddressRequest } from './types/index.js';

const prefix = (obj = {}, frontmatter = '') => {
  const reassignKeyValue = (input: object): object =>
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

export default class PurolatorAPI {
  private namespace: string;
  private authToken: any;
  private isSandbox: boolean;

  constructor(key: string, password: string, isSandbox = true) {
    this.namespace = 'ns1';
    this.authToken = new soap.BasicAuthSecurity(
      key,
      password,
    );
    this.isSandbox = isSandbox;
  }

  private $appendHeaders(e: any, apiVersion: string) {
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

  private async $req(serviceName: string, body: any) {
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

  async createShipment(body: ICreateShipmentRequest) {
    return this.$req('Shipping.Create', body);
  }

  async estimateRate(body: IEstimateRateRequest, serviceCode?: string): Promise<IRate | IRate[]> {
    const availableRates = await this.$req('Estimating.Quick', body);
    if(serviceCode) {
      return availableRates.find((rate: IRate) => rate.ServiceID === serviceCode);
    }
    return availableRates;
  }

  async retrieveDocuments(body: IRetrieveDocumentsRequest) {
    return this.$req('ShippingDocuments.Retrieve', body);
  }

  async validateAddress(body: IValidateAddressRequest) {
    return this.$req('ServiceAvailability.Validate', body);
  }
}
