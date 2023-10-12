const isObject = (o: any) => o && typeof o === 'object';

const hasProperty = (target: object, prop: string) =>
  isObject(target) && prop in target;

export const invoke = (methodName: string, payload: any) => (client: any) => {
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