export const renderAll = (data = [], templateFunction = () => '') => data.map(templateFunction).join('\n').trim();
