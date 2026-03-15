const express = require('express');
const router = express.Router();
const generatorController = require('../controllers/generadorController');

// Ruta principal para registrar generación en Solana
router.post('/generate', generatorController.updateGeneration);

// Placeholders para evitar que el servidor falle al iniciar
router.get('/tokens/:userId', (req, res) => res.json({ message: "Sincronizando con Solana..." }));
router.get('/users', (req, res) => res.json([]));
router.get('/users/country/:country', (req, res) => res.json([]));
router.get('/users/departament/:departament', (req, res) => res.json([]));
router.post('/users', (req, res) => res.json({ message: "Función en migración" }));
router.delete('/users/:id', (req, res) => res.json({ message: "Función en migración" }));
router.put('/users/:id', (req, res) => res.json({ message: "Función en migración" }));
router.get('/byinstaller/:installation_company', (req, res) => res.json([]));

module.exports = router;
