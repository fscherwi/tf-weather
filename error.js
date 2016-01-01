exports.error = function error(code) { /* istanbul ignore next */
  switch (code) {
    case 11:
      return 'Error: ALREADY CONNECTED';
    case 12:
      return 'Error: NOT CONNECTED';
    case 13:
      return 'Error: CONNECT FAILED';
    case 21:
      return 'Error: INVALID FUNCTION ID';
    case 31:
      return 'Error: TIMEOUT';
    case 41:
      return 'Error: INVALID PARAMETER';
    case 42:
      return 'Error: FUNCTION NOT SUPPORTED';
    default:
      return 'Error: UNKNOWN ERROR';
  }
};
