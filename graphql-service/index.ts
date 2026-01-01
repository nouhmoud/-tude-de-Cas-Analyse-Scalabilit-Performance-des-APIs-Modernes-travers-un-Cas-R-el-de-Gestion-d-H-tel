import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { DataSource } from 'typeorm';
import { Client } from './entity/Client';
import { Chambre } from './entity/Chambre';
import { Reservation } from './entity/Reservation';

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "hoteluser",
  password: "hotelpassword",
  database: "hoteldb",
  entities: [Client, Chambre, Reservation],
  synchronize: false,
  logging: false,
});

const resolvers = {
  Query: {
    reservations: async () => await AppDataSource.getRepository(Reservation).find({ relations: ["client", "chambre"] }),
    reservation: async (_, { id }) => await AppDataSource.getRepository(Reservation).findOne({ where: { id: parseInt(id) }, relations: ["client", "chambre"] }),
  },
  Mutation: {
    createReservation: async (_, args) => {
      const client = await AppDataSource.getRepository(Client).findOneBy({ id: parseInt(args.clientId) });
      const chambre = await AppDataSource.getRepository(Chambre).findOneBy({ id: parseInt(args.chambreId) });

      const reservation = new Reservation();
      reservation.client = client;
      reservation.chambre = chambre;
      reservation.dateDebut = args.dateDebut;
      reservation.dateFin = args.dateFin;
      reservation.preferences = args.preferences;

      return await AppDataSource.getRepository(Reservation).save(reservation);
    },
    deleteReservation: async (_, { id }) => {
      const result = await AppDataSource.getRepository(Reservation).delete(id);
      return result.affected > 0;
    },
    updateReservation: async (_, args) => {
      const repo = AppDataSource.getRepository(Reservation);
      let reservation = await repo.findOneBy({ id: parseInt(args.id) });
      if (!reservation) return null;

      if (args.clientId) reservation.client = await AppDataSource.getRepository(Client).findOneBy({ id: parseInt(args.clientId) });
      if (args.chambreId) reservation.chambre = await AppDataSource.getRepository(Chambre).findOneBy({ id: parseInt(args.chambreId) });
      if (args.dateDebut) reservation.dateDebut = args.dateDebut;
      if (args.dateFin) reservation.dateFin = args.dateFin;
      if (args.preferences) reservation.preferences = args.preferences;

      return await repo.save(reservation);
    }
  },
};

AppDataSource.initialize().then(async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}).catch(error => console.log(error));
