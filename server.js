import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const port = 8888;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/marcas', (req, res) => {
    fs.readFile(path.join(__dirname, 'marcas.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo marcas.txt', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }

        const marcas = data.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        res.json(marcas);
    });
});

app.get('/modelos/:marca', (req, res) => {
    const marcaParam = req.params.marca;

    fs.readFile(path.join(__dirname, 'modelos.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo modelos.txt', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }

        const modelos = data.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

        const modelosFiltrados = modelos
            .map(line => {
                const parts = line.split(' - ');
                return parts.length >= 2 ? { marca: parts[0].trim(), modelo: parts.slice(1).join(' - ').trim() } : null;
            })
            .filter(Boolean)
            .filter(item => item.marca.toLowerCase() === decodeURIComponent(marcaParam).toLowerCase())
            .map(item => item.modelo);

        if (modelosFiltrados.length === 0) {
            res.status(404).json({ error: 'No se encontraron modelos para la marca especificada' });
        } else {
            res.json(modelosFiltrados);
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor Express ejecutándose en el puerto ${port}`);
});