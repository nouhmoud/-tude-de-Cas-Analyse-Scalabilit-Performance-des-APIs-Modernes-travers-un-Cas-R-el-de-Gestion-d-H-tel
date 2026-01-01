
import grpc from 'k6/net/grpc';
import { check, sleep } from 'k6';

const client = new grpc.Client();
client.load(['../../grpc-service/src/main/proto'], 'reservation.proto');

export const options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 100 },
        { duration: '30s', target: 0 },
    ],
};

export default function () {
    client.connect('localhost:9090', {
        plaintext: true
    });

    const data = {
        client_id: 1,
        chambre_id: 1,
        date_debut: '2024-01-01',
        date_fin: '2024-01-05',
        preferences: 'Vue mer'
    };

    const response = client.invoke('com.comparison.hotel.grpc.ReservationService/CreateReservation', data);

    check(response, {
        'status is OK': (r) => r && r.status === grpc.StatusOK,
    });

    client.close();
    sleep(1);
}
