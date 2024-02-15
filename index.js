const soap = require("soap");
const config = require("./config.js");
const { invoke } = require("./helpers.js");

const prefix = (obj = {}, frontmatter = "") => {
  const reassignKeyValue = (input, isArray = false) => {
    if (isArray) {
      return input.map((value) => {
        return typeof value === "object"
          ? reassignKeyValue(value, Array.isArray(value))
          : value;
      });
    } else {
      return Object.entries(input).reduce((output, [key, value]) => {
        return Object.assign(output, {
          [`${frontmatter}:${key}`]:
            typeof value === "object"
              ? reassignKeyValue(value, Array.isArray(value))
              : value,
        });
      }, {});
    }
  };
  const payload = reassignKeyValue(obj);
  console.log(payload);
  return payload;
};

class PurolatorAPI {
  constructor(key, password, isSandbox = true) {
    this.version = 2;
    this.namespace = "ns1";
    this.authToken = new soap.BasicAuthSecurity(key, password);
    this.isSandbox = isSandbox;
  }

  $appendHeaders(e, apiVersion) {
    const [majorVersion = 2, minorVersion = 0] = apiVersion.split(".");
    const ns1 = `${config.datatypes}/v${majorVersion}`;
    const headers = prefix(
      {
        RequestContext: {
          Version: `${majorVersion}.${minorVersion}`,
          Language: "en",
          GroupID: "xxx",
          RequestReference: this.constructor.name,
        },
      },
      this.namespace
    );

    e.wsdl.definitions.xmlns.ns1 = ns1;
    e.wsdl.xmlnsInEnvelope = e.wsdl._xmlnsMap();
    e.setSecurity(this.authToken);
    e.addSoapHeader(headers);
    return e;
  }

  async createShipment(body) {
    return this.$req("Shipping.Create", body);
  }

  async cancelShipment(body) {
    return this.$req("Shipping.Void", body);
  }

  async estimateRate(body, serviceCode) {
    const availableRates = await this.$req("Estimating.Quick", body);
    if (serviceCode) {
      return availableRates.find((rate) => rate.ServiceID === serviceCode);
    }
    return availableRates;
  }

  async retrieveDocuments(body) {
    return this.$req("ShippingDocuments.Retrieve", body);
  }

  async validateAddress(body) {
    return this.$req("ServiceAvailability.Validate", body);
  }

  async $req(serviceName, body) {
    const payload = prefix(body, this.namespace);
    const name = config.getWSDL(serviceName.split(".")[0], this.isSandbox);
    const [responseKind, responseType] = serviceName.split(".");

    const { method, responseKey, apiVersion } =
      config.responses[responseKind][responseType];

    const params = {
      returnFault: true,
      envelopeKey: "SOAP-ENV",
      xmlKey: this.namespace,
      overrideRootElement: {
        namespace: this.namespace,
      },
    };

    return soap
      .createClientAsync(name, params)
      .then((e) => this.$appendHeaders(e, apiVersion))
      .then(invoke(`${method}Async`, payload))
      .then((resp) => {
        const [deepKey, deeperKey] = responseKey.split(".");
        const response = resp[0][deepKey][deeperKey];
        console.log(`${method}:`, response);
        return response;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

module.exports = { PurolatorAPI };
