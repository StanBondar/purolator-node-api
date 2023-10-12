declare const datatypes = "http://purolator.com/pws/datatypes";
interface IResponseConfig {
    [key: string]: {
        [key: string]: {
            method: string;
            responseKey: string;
            apiVersion: string;
        };
    };
}
declare const responses: IResponseConfig;
declare const getWSDL: (n: string, isSandbox: boolean) => string;
export { datatypes, responses, getWSDL };
