CREATE TABLE IF NOT EXISTS client (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(100),
    telephone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS chambre (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    prix DECIMAL(10, 2),
    disponible BOOLEAN
);

CREATE TABLE IF NOT EXISTS reservation (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES client(id),
    chambre_id INTEGER REFERENCES chambre(id),
    date_debut DATE,
    date_fin DATE,
    preferences TEXT
);

-- Insert sample data
INSERT INTO client (nom, prenom, email, telephone) VALUES 
('Doe', 'John', 'john.doe@example.com', '1234567890'),
('Smith', 'Jane', 'jane.smith@example.com', '0987654321');

INSERT INTO chambre (type, prix, disponible) VALUES 
('Simple', 100.00, true),
('Double', 150.00, true),
('Suite', 300.00, true);
