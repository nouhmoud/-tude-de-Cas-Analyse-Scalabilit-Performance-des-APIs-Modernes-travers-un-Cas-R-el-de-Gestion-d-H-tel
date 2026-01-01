package com.comparison.hotel.soap.endpoint;

import com.comparison.hotel.soap.gen.*;
import com.comparison.hotel.soap.model.Reservation;
import com.comparison.hotel.soap.model.Client;
import com.comparison.hotel.soap.model.Chambre;
import com.comparison.hotel.soap.repository.ReservationRepository;
import com.comparison.hotel.soap.repository.ClientRepository;
import com.comparison.hotel.soap.repository.ChambreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.time.LocalDate;
import java.util.Optional;

@Endpoint
public class ReservationEndpoint {
    private static final String NAMESPACE_URI = "http://comparison.com/hotel/soap/gen";

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private ChambreRepository chambreRepository;

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getReservationRequest")
    @ResponsePayload
    public GetReservationResponse getReservation(@RequestPayload GetReservationRequest request) {
        GetReservationResponse response = new GetReservationResponse();
        Optional<Reservation> reservationOpt = reservationRepository.findById(request.getId());

        if (reservationOpt.isPresent()) {
            response.setReservation(mapReservation(reservationOpt.get()));
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "createReservationRequest")
    @ResponsePayload
    public CreateReservationResponse createReservation(@RequestPayload CreateReservationRequest request) {
        CreateReservationResponse response = new CreateReservationResponse();

        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        Chambre chambre = chambreRepository.findById(request.getChambreId())
                .orElseThrow(() -> new RuntimeException("Chambre not found"));

        Reservation reservation = new Reservation();
        reservation.setClient(client);
        reservation.setChambre(chambre);
        reservation.setDateDebut(LocalDate.parse(request.getDateDebut()));
        reservation.setDateFin(LocalDate.parse(request.getDateFin()));
        reservation.setPreferences(request.getPreferences());

        Reservation saved = reservationRepository.save(reservation);
        response.setReservation(mapReservation(saved));

        return response;
    }

    private ReservationInfo mapReservation(Reservation reservation) {
        ReservationInfo info = new ReservationInfo();
        info.setId(reservation.getId());
        info.setClientName(reservation.getClient().getNom() + " " + reservation.getClient().getPrenom());
        info.setRoomType(reservation.getChambre().getType());
        info.setDateDebut(reservation.getDateDebut().toString());
        info.setDateFin(reservation.getDateFin().toString());
        info.setPreferences(reservation.getPreferences());
        return info;
    }
}
