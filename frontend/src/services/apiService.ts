import axios from 'axios';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export interface Reservation {
    id?: number;
    client: { id: number, nom?: string };
    chambre: { id: number, type?: string };
    dateDebut: string;
    dateFin: string;
    preferences: string;
}

// REST Client
const restClient = axios.create({ baseURL: 'http://localhost:8081/api/reservations' });

// GraphQL Client
const graphQLClient = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache(),
});

export const apiService = {
    // REST Operations
    rest: {
        getAll: async () => (await restClient.get<Reservation[]>('')).data,
        create: async (res: Reservation) => (await restClient.post<Reservation>('', res)).data,
        delete: async (id: number) => (await restClient.delete(`/${id}`)).data,
    },
    // GraphQL Operations
    graphql: {
        getAll: async () => {
            const result = await graphQLClient.query({
                query: gql`query { reservations { id client { id nom } chambre { id type } dateDebut dateFin preferences } }`
            });
            return result.data.reservations;
        },
        create: async (res: Reservation) => {
            const result = await graphQLClient.mutate({
                mutation: gql`mutation Create($clientId: ID!, $chambreId: ID!, $dateDebut: String!, $dateFin: String!, $pref: String) {
                    createReservation(clientId: $clientId, chambreId: $chambreId, dateDebut: $dateDebut, dateFin: $dateFin, preferences: $pref) {
                        id
                    }
                }`,
                variables: {
                    clientId: res.client.id,
                    chambreId: res.chambre.id,
                    dateDebut: res.dateDebut,
                    dateFin: res.dateFin,
                    pref: res.preferences
                }
            });
            return result.data.createReservation;
        }
    }
};
