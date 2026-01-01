import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Reservation } from "./Reservation"

@Entity()
export class Chambre {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @Column("decimal")
    prix: number

    @Column()
    disponible: boolean

    @OneToMany(() => Reservation, (reservation) => reservation.chambre)
    reservations: Reservation[]
}
