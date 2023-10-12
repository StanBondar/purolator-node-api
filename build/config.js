"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWSDL = exports.responses = exports.datatypes = void 0;
const path_1 = __importDefault(require("path"));
const datatypes = 'http://purolator.com/pws/datatypes';
exports.datatypes = datatypes;
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
    ServiceAvailability: {
        Validate: {
            method: 'ValidateCityPostalCodeZip',
            responseKey: 'SuggestedAddresses.SuggestedAddress',
            apiVersion: "2.0"
        }
    },
};
exports.responses = responses;
const getWSDL = (n, isSandbox) => path_1.default.join(process.cwd(), 'node_modules/nodejs_purolator_api/build/', isSandbox
    ? `./wsdl/Development/${n}Service.wsdl`
    : `./wsdl/Production/${n}Service.wsdl`);
exports.getWSDL = getWSDL;
//# sourceMappingURL=config.js.map