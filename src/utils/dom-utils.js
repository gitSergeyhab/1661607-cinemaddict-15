export const renderAll = (data = [], templateFunction = () => '') => data.map((item) => templateFunction(item || '')).join('\n').trim();
