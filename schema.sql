CREATE TABLE IF NOT EXISTS utilisateurs (
    id TEXT PRIMARY KEY,
    google_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    nom TEXT,
    plan TEXT NOT NULL DEFAULT 'demarreur',
    statut_de_paiement TEXT DEFAULT 'en_attente',
    mode_de_paiement TEXT,
    identifiant_client_bande TEXT,
    cree_a TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    mis_a_jour_a TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON utilisateurs(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON utilisateurs(google_id);

CREATE TABLE IF NOT EXISTS avis (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    note INTEGER,
    commentaire TEXT,
    autorise_publication INTEGER NOT NULL DEFAULT 0,
    cree_a TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
