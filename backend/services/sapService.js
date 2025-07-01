// backend/services/sapService.js
const axios = require('axios');

async function callSAP(wsdlUrl, xmlPayload) {
  const response = await axios.post(wsdlUrl, xmlPayload, {
    headers: {
      'Content-Type': 'text/xml',
      'SOAPAction': ''
    }
  });
  return response.data;
}

module.exports = { callSAP };
