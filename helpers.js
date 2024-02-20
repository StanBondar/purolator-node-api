const isObject = (o) => o && typeof o === "object";

const hasProperty = (target, prop) => isObject(target) && prop in target;

const invoke = (methodName, payload) => (client) => {
  if (
    !hasProperty(client, methodName) ||
    typeof client[methodName] !== "function"
  )
    throw new Error("Method not available through this adapter");

  const fn = client[methodName];
  return fn(payload);
};

function objectToXML(obj) {
  let xml = "";

  for (let key in obj) {
    if (Array.isArray(obj[key])) {
      xml += `<${key}>`;
      obj[key].forEach((item, index, array) => {
        if (typeof item === "string") {
          xml += `${item}${
            index < array.length - 1 ? `</${key}><${key}>` : ""
          }`;
        } else {
          xml += `${objectToXML(item)}`;
        }
      });
      xml += `</${key}>`;
    } else if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      typeof obj[key] !== "string"
    ) {
      xml += `<${key}>${objectToXML(obj[key])}</${key}>`;
    } else {
      xml += `<${key}>${obj[key]}</${key}>`;
    }
  }

  return xml;
}

module.exports = { invoke, objectToXML };
