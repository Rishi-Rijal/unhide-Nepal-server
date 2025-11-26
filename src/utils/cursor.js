
const encodeCursor = (data) => {
  return Buffer.from(JSON.stringify(data)).toString('base64');
};


const decodeCursor = (cursor) => {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
  } catch (e) {
    return null;
  }
};


export { encodeCursor, decodeCursor };