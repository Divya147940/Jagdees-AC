require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve existing HTML/CSS/JS files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Storage configuration with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|mp4|mov|avi/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Only Images and Videos are allowed!'));
        }
    }
});

// API Routes
const DATA_FILE = path.join(__dirname, 'gallery_data.json');

// Get all gallery items
app.get('/api/gallery', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data' });
        res.json(JSON.parse(data));
    });
});

// Upload new item
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (req.body.pin !== '1234') return res.status(403).json({ error: 'Invalid PIN' });

    const newItem = {
        id: Date.now(),
        path: '/uploads/' + req.file.filename,
        type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
        caption: req.body.caption || 'New Work Image',
        timestamp: new Date().toISOString()
    };

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        const gallery = JSON.parse(data || '[]');
        gallery.unshift(newItem); // Add to the top
        fs.writeFile(DATA_FILE, JSON.stringify(gallery, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Failed to save data' });
            res.json({ success: true, item: newItem });
        });
    });
});

// Delete item
app.delete('/api/gallery/:id', (req, res) => {
    if (req.body.pin !== '1234') return res.status(403).json({ error: 'Invalid PIN' });
    
    const id = parseInt(req.params.id);
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let gallery = JSON.parse(data || '[]');
        const itemToDelete = gallery.find(item => item.id === id);
        
        if (itemToDelete) {
            // Delete actual file
            const filePath = path.join(__dirname, itemToDelete.path);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch (e) {
                    console.error("File deletion error:", e);
                }
            }
            
            // Update database
            gallery = gallery.filter(item => item.id !== id);
            fs.writeFile(DATA_FILE, JSON.stringify(gallery, null, 2), (err) => {
                if (err) return res.status(500).json({ error: 'Failed to update data' });
                res.json({ success: true });
            });
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;
