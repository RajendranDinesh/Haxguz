const router = require('express').Router();
const jwt = require('jsonwebtoken');

const multer = require('multer'); // Importing the multer module for handling file uploads
const path = require('path'); // Importing the path module for working with file paths
const cloudinary = require('cloudinary').v2; // Importing the cloudinary module for cloud-based image management(profile_pic here)
const fs = require('fs'); // Importing the fs module for working with the file system

const { Event } = require('../model/event');
const { User } = require('../model/user');
const { Ticket } = require('../model/ticket');
const { Participant } = require('../model/eventParticipants');

// The following code loads the dotenv module from the node_modules directory
// and calls its config function to load environment variables from a .env file
require('dotenv').config();

// Authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token verification failed' });
        };

        req.user = user;
        next();
    });
};

// Configuring the cloudinary module with the provided environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET // Cloudinary API secret
});

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Specify the folder where uploaded images will be stored
      cb(null, './uploads/ticket_background');
    },
    filename: function (req, file, cb) {
      // Generate a unique filename for the uploaded image
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

const upload = multer({ storage: storage });

router.post('/ticket/create', authenticateToken, upload.single('background'),async (req, res) => {
    const { eventId } = req.body;
    const { path } = req.file;

    if (!eventId || !path) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    const backgroundUpload = await cloudinary.uploader.upload(path, { folder: 'ticket_background' });
    if (!backgroundUpload) {
        return res.status(500).json({ message: 'Error uploading background' });
    }

    fs.unlink(path, (err) => {
        if (err) {
            console.log(err);
            return
        }
    });

    const ticket = await new Ticket({
        eventId: eventId,
        backgroundImage: backgroundUpload.secure_url,
        backgroundImageId: backgroundUpload.public_id,
    });

    try{
    //if ticket already exists for this event, delete it and create a new one
    const existingTicket = await Ticket.findOne({ eventId: eventId });
    if (existingTicket) {
        await cloudinary.uploader.destroy(existingTicket.backgroundImageId);
        await Ticket.findByIdAndDelete(existingTicket._id);
    }

    const savedTicket = await ticket.save();
    if (!savedTicket) {
        return res.status(500).json({ message: 'Error saving ticket' });
    }

} catch(error){
    console.log(error);
    return res.status(500).json({ message: 'Error saving ticket' });
}
    return res.status(201).json({ message: 'Ticket created successfully' });
});


//get ticket for an event
router.get('/ticket/:eventId', authenticateToken, async (req, res) => {
    var { eventId } = req.params;
    const userId = req.user._id;

    if (!eventId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const event = await Event.findOne({ eventId: eventId });
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    eventId = event._id;

    const ticket = await Ticket.findOne({ eventId: eventId });
    if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
    }

    const backgroundImageUrl = ticket.backgroundImage;

    const participant = await Participant.findOne({ eventId: eventId });
    if (!participant) {
        return res.status(404).json({ message: 'Participant not found' });
    }

    const participantObject = participant.participants[0];
    const qrContent = participantObject[userId]

    res.status(200).json({ message: 'Ticket found', qrContent: qrContent, backgroundImageUrl: backgroundImageUrl});
});

module.exports = router;