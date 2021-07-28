export const connectElements = (data, createElemFunction) => data.reduce((acc, elem) => acc + createElemFunction(elem), '');
