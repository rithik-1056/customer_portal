const express = require('express');
const router = express.Router();
const { callSAP } = require('./sapService');
const xml2js = require('xml2js');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const xmlPayload = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
      <urn:ZFM_VALIDATE_LOGIN>
        <I_USERNAME>${username}</I_USERNAME>
        <I_PASSWORD>${password}</I_PASSWORD>
      </urn:ZFM_VALIDATE_LOGIN>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    const raw = await callSAP('http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/wsdl/flv_10002P111AD1/sdef_url/ZWS_CUSTLOGIN?sap-client=100', xmlPayload);

    xml2js.parseString(raw, (err, result) => {
      if (err) return res.status(500).json({ message: 'XML parse error' });

      const body = result['soapenv:Envelope']['soapenv:Body'][0];
      const response = body['n0:ZFM_VALIDATE_LOGINResponse'][0];

      const success = response['E_SUCCESS'][0];
      const customerId = response['E_CUSTOMER_ID'][0];

      if (success === 'X') {
        res.json({ success: true, customerId });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'SAP call failed', error: error.message });
  }
});

module.exports = router;
