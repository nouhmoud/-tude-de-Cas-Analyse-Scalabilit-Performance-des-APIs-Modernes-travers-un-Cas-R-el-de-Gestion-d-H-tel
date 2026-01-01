
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 100 },
        { duration: '30s', target: 0 },
    ],
};

const BASE_URL = 'http://localhost:8081/api/reservations';

export default function () {
    const payload = JSON.stringify({
        client: { id: 1 },
        chambre: { id: 1 },
        dateDebut: '2024-01-01',
        dateFin: '2024-01-05',
        preferences: 'Vue mer',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // POST
    let res = http.post(BASE_URL, payload, params);
    check(res, { 'created status was 200': (r) => r.status === 200 });

    if (res.status === 200) {
        const id = res.json('id');

        // GET
        res = http.get(`${BASE_URL}/${id}`);
        check(res, { 'retrieved status was 200': (r) => r.status === 200 });
    }

    sleep(1);
}
