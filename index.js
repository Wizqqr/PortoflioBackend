import express from 'express';
import transporter from './config/nodemailer.js';
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();

const app = express();

app.use(express.json());

app.use(
	cors({
        origin: "https://portfolio-frontend-dusky.vercel.app", // Укажите правильный URL фронтенда
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);


app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `New contact form submission from ${name}`,
        text: `
            Name: ${name}
            Email: ${email}
            Message: ${message}
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send the message' });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
