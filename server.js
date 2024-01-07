const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

// Konfiguracija MySQL baze podataka
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Vaše korisničko ime
  password: 'ajla', // Vaša lozinka
  database: 'ris' // Naziv vaše baze podataka
});

db.connect((err) => {
  if (err) {
    console.error('Greška prilikom povezivanja s bazom podataka:', err);
  } else {
    console.log('Uspješno povezano s bazom podataka');
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta za dodavanje događaja
app.post('/dodaj-dogadjaj', (req, res) => {
    const { nazivDogadjaja, mjesto, datum } = req.body;

    if (nazivDogadjaja && mjesto && datum) {
        const sql = 'INSERT INTO dogadjaji (nazivDogadjaja, mjesto, datum) VALUES (?, ?, ?)';
        db.query(sql, [nazivDogadjaja, mjesto, datum], (err, result) => {
            if (err) {
                console.error('Greška prilikom dodavanja događaja u bazu podataka:', err);
                res.status(500).json({ error: 'Greška prilikom dodavanja događaja.' });
            } else {
                console.log('Događaj uspješno dodan u bazu podataka');
                res.status(200).json({ message: 'Događaj uspješno dodan.' });
            }
        });
    } else {
        res.status(400).json({ error: 'Molimo ispunite sva polja.' });
    }
});


// Ruta za dohvaćanje svih događaja
app.get('/dohvati-dogadjaje', (req, res) => {
  const sql = 'SELECT * FROM dogadjaji';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Greška prilikom dohvaćanja događaja iz baze podataka:', err);
      res.status(500).send('Greška prilikom dohvaćanja događaja.');
    } else {
      res.status(200).json(result);
    }
  });
});

app.listen(port, () => {
  console.log(`Server pokrenut na portu ${port}`);
});
