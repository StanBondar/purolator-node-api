import { ICreateShipmentRequest, IEstimateRateRequest, IRate, IRetrieveDocumentsRequest, IValidateAddressRequest } from './types/index.js';
export default class PurolatorAPI {
    private namespace;
    private authToken;
    private isSandbox;
    constructor(key: string, password: string, isSandbox?: boolean);
    private $appendHeaders;
    private $req;
    createShipment(body: ICreateShipmentRequest): Promise<any>;
    estimateRate(body: IEstimateRateRequest, serviceCode?: string): Promise<IRate | IRate[]>;
    retrieveDocuments(body: IRetrieveDocumentsRequest): Promise<any>;
    validateAddress(body: IValidateAddressRequest): Promise<any>;
}
