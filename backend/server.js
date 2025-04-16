import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB error:', err));

const registrationSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    mobile: String,
    gender: String,
    location: String,
    university: String,
    course: String,
    year: String,
    cgpa: String,
    interests: [String],
    domains: [String],
    resumeUrl: String,
    portfolio: String,
    availability: String,
    workType: String,
    whyJoin: String,
    questions: String,
    createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

app.use(cors({ origin: process.env.NODE_ENV === "development" ? 'http://localhost:5173' : process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.post('/api/register', upload.single('resume'), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        console.log("body", req.body);


        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'raw' }, async (error, result) => {
            if (error) {
                return res.status(500).json({ message: 'Cloudinary upload failed', error });
            }

            const resumeUrl = result.secure_url;

            const registration = new Registration({ ...req.body, resumeUrl });
            await registration.save();

            res.status(201).json({ message: 'Registration successful' });
        });

        const readable = new Readable();
        readable._read = () => { };
        readable.push(fileBuffer);
        readable.push(null);
        readable.pipe(uploadStream);

    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

app.listen(port || 3000, () => {
    console.log(`Server running on port ${port}`);
});
