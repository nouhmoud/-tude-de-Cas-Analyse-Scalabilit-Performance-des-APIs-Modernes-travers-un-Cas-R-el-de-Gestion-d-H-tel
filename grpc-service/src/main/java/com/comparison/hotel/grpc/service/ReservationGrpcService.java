package com.comparison.hotel.grpc.service;

import com.comparison.hotel.grpc.gen.*;
import com.comparison.hotel.grpc.model.*;
import com.comparison.hotel.grpc.repository.*;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDate;

@GrpcService
public class ReservationGrpcService extends ReservationServiceGrpc.ReservationServiceImplBase {

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private ChambreRepository chambreRepository;

    @Override
    public void createReservation(CreateReservationRequest request,
            StreamObserver<ReservationResponse> responseObserver) {
        Client client = clientRepository.findById(request.getClientId()).orElseThrow();
        Chambre chambre = chambreRepository.findById(request.getChambreId()).orElseThrow();

        Reservation reservation = new Reservation();
        reservation.setClient(client);
        reservation.setChambre(chambre);
        reservation.setDateDebut(LocalDate.parse(request.getDateDebut()));
        reservation.setDateFin(LocalDate.parse(request.getDateFin()));
        reservation.setPreferences(request.getPreferences());

        Reservation saved = reservationRepository.save(reservation);
        responseObserver.onNext(mapToResponse(saved));
        responseObserver.onCompleted();
    }

    @Override
    public void getReservation(GetReservationRequest request, StreamObserver<ReservationResponse> responseObserver) {
        reservationRepository.findById(request.getId()).ifPresentOrElse(
                reservation -> {
                    responseObserver.onNext(mapToResponse(reservation));
                    responseObserver.onCompleted();
                },
                () -> responseObserver.onError(new RuntimeException("Reservation not found")));
    }

    @Override
    public void deleteReservation(DeleteReservationRequest request,
            StreamObserver<DeleteReservationResponse> responseObserver) {
        reservationRepository.deleteById(request.getId());
        responseObserver.onNext(DeleteReservationResponse.newBuilder().setSuccess(true).build());
        responseObserver.onCompleted();
    }

    // Update omitted for brevity but follows same pattern

    private ReservationResponse mapToResponse(Reservation reservation) {
        return ReservationResponse.newBuilder()
                .setId(reservation.getId())
                .setClientId(reservation.getClient().getId())
                .setChambreId(reservation.getChambre().getId())
                .setDateDebut(reservation.getDateDebut().toString())
                .setDateFin(reservation.getDateFin().toString())
                .setPreferences(reservation.getPreferences())
                .build();
    }
}
