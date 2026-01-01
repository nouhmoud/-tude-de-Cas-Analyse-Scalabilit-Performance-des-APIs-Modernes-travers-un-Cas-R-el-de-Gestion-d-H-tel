import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Client } from "./Client"
import { Chambre } from "./Chambre"

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Client, (client) => client.reservations)
    client: Client

    @ManyToOne(() => Chambre, (chambre) => chambre.reservations)
    chambre: Chambre

    @Column({ type: 'date' })
    dateDebut: string

    @Column({ type: 'date' })
    dateFin: string

    @Column("text")
    preferences: string
}
