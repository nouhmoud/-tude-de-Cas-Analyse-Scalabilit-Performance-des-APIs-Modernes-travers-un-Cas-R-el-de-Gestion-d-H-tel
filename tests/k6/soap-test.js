
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 100 },
        { duration: '30s', target: 0 },
    ],
};

const BASE_URL = 'http://localhost:8082/ws';

export default function () {
    const payload = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gen="http://comparison.com/hotel/soap/gen">
       <soapenv:Header/>
       <soapenv:Body>
          <gen:createReservationRequest>
             <gen:clientId>1</gen:clientId>
             <gen:chambreId>1</gen:chambreId>
             <gen:dateDebut>2024-01-01</gen:dateDebut>
             <gen:dateFin>2024-01-05</gen:dateFin>
             <gen:preferences>Vue mer</gen:preferences>
          </gen:createReservationRequest>
       </soapenv:Body>
    </soapenv:Envelope>
  `;

    const params = {
        headers: {
            'Content-Type': 'text/xml',
        },
    };

    let res = http.post(BASE_URL, payload, params);
    check(res, { 'soap response 200': (r) => r.status === 200 });

    sleep(1);
}
