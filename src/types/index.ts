export interface IPurolatorClient {
	namespace: string;
  authToken: any;
  isSandbox: boolean;
	$appendHeaders: (e: any, apiVersion: string) => any;
}

export interface IValidateAddressRequest {
	Addresses: {
		ShortAddress: {
			City: string;
			Province: string;
			Country: string;
			PostalCode: string;
		}
	}
}

export interface ICreateShipmentRequest {
	"Shipment": {
		"SenderInformation": {
			"Address": {
				"Name": string;
				"Company": string;
				"StreetNumber": string;
				"StreetName": string;
				"StreetType": string;
				"City": string;
				"Province": string;
				"Country": string;
				"PostalCode": string;
				"PhoneNumber": {
					"CountryCode": string;
					"AreaCode": string;
					"Phone": string;
				}
			}
		},
		"ReceiverInformation": {
			"Address": {
				"Name": string;
				"StreetNumber": string;
				"StreetName": string;
				"City": string;
				"Province": string;
				"Country": string;
				"PostalCode": string;
				"PhoneNumber": {
					"CountryCode": string;
					"AreaCode": string;
					"Phone": string;
				}
			}
		},
		"PackageInformation": {
			"ServiceID": string;
			"TotalWeight": {
				"Value": number;
				"WeightUnit": "kg" | "lb";
			}
			"TotalPieces": number;
		},
		"PaymentInformation": {
			"PaymentType": "Sender" | "Receiver" | "ThirdParty";
			"RegisteredAccountNumber": string;
			"BillingAccountNumber": string;
		},
		"PickupInformation": {
			"PickupType": "DropOff" | "PreScheduled";
		},
		"TrackingReferenceInformation": {
			"Reference1": string;
		}
	};
	"PrinterType": string;
}

export interface IRetrieveDocumentsRequest {
	"DocumentCriterium": {
		"DocumentCriteria": {
			"PIN": {
				"Value": string;
			},
			"DocumentTypes": {
				"DocumentType": string;
			}
		}
	},
	"OutputType": string,
	"Synchronous": boolean,
	"SynchronousSpecified": boolean
}

export interface IEstimateRateRequest {
	BillingAccountNumber: string;
	SenderPostalCode: string;
	ReceiverAddress: {
		City: string;
		Province: string;
		Country: string;
		PostalCode: string;
	};
	PackageType: string;
	TotalWeight: {
		Value: number;
		WeightUnit: "kg" | "lb";
	}
}

export interface IRate {
	ServiceID: string;
	TotalPrice: number;
}