const getStructure = (obj, depth = 0) => {
    if (typeof obj !== "object" || obj === null) return typeof obj;
  
    if (Array.isArray(obj)) {
      return [`Array<${getStructure(obj[0], depth + 1)}>`];
    }
  
    const structure = {};
    for (let key in obj) {
      structure[key] = getStructure(obj[key], depth + 1);
    }
    return structure;
  };
  

export {getStructure}