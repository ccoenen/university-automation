module.exports = function (token) {
  if (token.type == 'Identifier') {
    token.value = 'BERND';
  }
  if (token.type == 'String') {
    token.value = 'BERND';
  }
  if (token.type == 'Numeric') {
    token.value = '42';
  }
  return token;
};
