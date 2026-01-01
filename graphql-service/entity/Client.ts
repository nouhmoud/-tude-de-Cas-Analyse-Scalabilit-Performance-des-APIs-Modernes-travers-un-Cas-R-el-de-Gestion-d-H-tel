import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Reservation } from "./Reservation"

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nom: string

    @Column()
    prenom: string

    @Column()
    email: string

    @Column()
    telephone: string

    @OneToMany(() => Reservation, (reservation) => reservation.client)
    reservations: Reservation[]
}
