import express from 'express';
import cors from 'cors';    
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import { Url } from './models/url.model.js'; // Adjust the path as needed
import QRCode from 'qrcode'; // Import the QRCode library
dotenv.config();

const app= express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log("Connection failed",err));



app.post('/api/short',async (req, res) => {     
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).json({ error: 'Original URL is required' });
        }
        const shortUrl = nanoid(8); // Generate a short URL using nanoid
        const url = new Url({ originalUrl, shortUrl });
        const myUrl= `http://localhost:3000/${shortUrl}`
        const qrCode = await QRCode.toDataURL(myUrl); // Generate QR code
        await url.save();
        res.status(201).json({ message:"Url Generated", shortUrl: myUrl, qrCode });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }


})

app.get('/:shortUrl', async(req, res) => {
    try {
        const { shortUrl } = req.params;
        const url= await Url.findOne({ shortUrl });
        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }
        console.log("url found",url);
        url.clicks += 1; // Increment the click count
        await url.save();
        return res.redirect(url.originalUrl); // Redirect to the original URL
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})