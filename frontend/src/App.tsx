import { useEffect, useState } from 'react'
import { apiService, Reservation } from './services/apiService'
import './App.css'

function App() {
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [mode, setMode] = useState<'rest' | 'graphql'>('rest')

    const fetchReservations = async () => {
        try {
            const data = mode === 'rest' ? await apiService.rest.getAll() : await apiService.graphql.getAll();
            setReservations(data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchReservations();
    }, [mode])

    return (
        <div className="container">
            <h1>Hotel Reservation - Protocol Comparison</h1>
            <div className="controls">
                <label>
                    Mode:
                    <select value={mode} onChange={(e) => setMode(e.target.value as any)}>
                        <option value="rest">REST</option>
                        <option value="graphql">GraphQL</option>
                    </select>
                </label>
                <button onClick={fetchReservations}>Refresh</button>
            </div>

            <div className="list">
                {reservations.map(r => (
                    <div key={r.id} className="card">
                        <h3>Reservation #{r.id}</h3>
                        <p>Client ID: {r.client.id}</p>
                        <p>Room ID: {r.chambre.id}</p>
                        <p>{r.dateDebut} to {r.dateFin}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App
