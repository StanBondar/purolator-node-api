const isObject = (o) => o && typeof o === 'object';

const hasProperty = (target, prop) =>
  isObject(target) && prop in target;

export const invoke = (methodName, payload) => (client) => {
  if (
    !hasProperty(client, methodName) ||
    typeof client[methodName] !== 'function'
  )
    throw new Error(
      'Method not available through this adapter',
    );

  const fn = client[methodName];
  return fn(payload);
};