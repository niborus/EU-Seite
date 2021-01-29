'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

//um Dateien einlesen zu können
app.use('/', express.static(__dirname + '/static'));
//Decodiert die Übergabe von Parametern aus der URL (vermute ich)
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
