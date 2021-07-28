// export const connectElements = (data, createElemFunction) => data.reduce((acc, elem) => acc + createElemFunction(elem), '');
export const renderAll = (data = [], templateFunction = () => '') => data.map(templateFunction).join('\n').trim();

