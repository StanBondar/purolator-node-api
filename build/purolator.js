"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const soap = __importStar(require("soap"));
const config = __importStar(require("./config.js"));
const helpers_js_1 = require("./helpers.js");
const prefix = (obj = {}, frontmatter = '') => {
    const reassignKeyValue = (input) => Object.entries(input).reduce((output, [key, value]) => Object.assign(output, {
        [`${frontmatter}:${key}`]: typeof value === 'object'
            ? reassignKeyValue(value)
            : value,
    }), {});
    return reassignKeyValue(obj);
};
class PurolatorAPI {
    constructor(key, password, isSandbox = true) {
        this.namespace = 'ns1';
        this.authToken = new soap.BasicAuthSecurity(key, password);
        this.isSandbox = isSandbox;
    }
    $appendHeaders(e, apiVersion) {
        const [majorVersion = 2, minorVersion = 0] = apiVersion.split('.');
        const ns1 = `${config.datatypes}/v${majorVersion}`;
        const headers = prefix({
            RequestContext: {
                Version: `${majorVersion}.${minorVersion}`,
                Language: 'en',
                GroupID: 'xxx',
                RequestReference: this.constructor.name,
            },
        }, this.namespace);
        e.wsdl.definitions.xmlns.ns1 = ns1;
        e.wsdl.xmlnsInEnvelope = e.wsdl._xmlnsMap();
        e.setSecurity(this.authToken);
        e.addSoapHeader(headers);
        return e;
    }
    async $req(serviceName, body) {
        const payload = prefix(body, this.namespace);
        const name = config.getWSDL(serviceName.split('.')[0], this.isSandbox);
        const [responseKind, responseType] = serviceName.split('.');
        const { method, responseKey, apiVersion } = config.responses[responseKind][responseType];
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
            .then((0, helpers_js_1.invoke)(`${method}Async`, payload))
            .then(resp => {
            const [deepKey, deeperKey] = responseKey.split('.');
            const response = resp[0][deepKey][deeperKey];
            console.log(`${method}:`, response);
            return response;
        })
            .catch(err => {
            console.error(err);
        });
    }
    async createShipment(body) {
        return this.$req('Shipping.Create', body);
    }
    async estimateRate(body, serviceCode) {
        const availableRates = await this.$req('Estimating.Quick', body);
        if (serviceCode) {
            return availableRates.find((rate) => rate.ServiceID === serviceCode);
        }
        return availableRates;
    }
    async retrieveDocuments(body) {
        return this.$req('ShippingDocuments.Retrieve', body);
    }
    async validateAddress(body) {
        return this.$req('ServiceAvailability.Validate', body);
    }
}
exports.default = PurolatorAPI;
//# sourceMappingURL=purolator.js.map