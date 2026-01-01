
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 100 },
        { duration: '30s', target: 0 },
    ],
};

const BASE_URL = 'http://localhost:4000/';

export default function () {
    const mutation = `
    mutation {
      createReservation(clientId: "1", chambreId: "1", dateDebut: "2024-01-01", dateFin: "2024-01-05", preferences: "Vue mer") {
        id
      }
    }
  `;

    const headers = {
        'Content-Type': 'application/json',
    };

    let res = http.post(BASE_URL, JSON.stringify({ query: mutation }), { headers: headers });
    check(res, { 'created status was 200': (r) => r.status === 200 });

    // Extract ID if needed for query (simplified for now)
    sleep(1);
}
