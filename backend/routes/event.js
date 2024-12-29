const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware'); // Ensure this middleware is correctly imported
const Event = require('../models/Event'); // Ensure the Event model is correctly imported
const router = express.Router();

// Route to get all events
router.get('/', verifyToken, async (req, res) => {
    try {
        const events = await Event.find().populate('attendees', 'name email');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch events' });
    }
});

// Route to create a new event
router.post('/create', verifyToken, async (req, res) => {
    const { title, description, date, location, category, visibility } = req.body;

    try {
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            category,
            visibility,
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create event' });
    }
});

// Edit Event
router.put('/edit/:eventId', async (req, res) => {
    const { title, description, date, location, category, visibility } = req.body;
    const { eventId } = req.params;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        // Update event details
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;
        event.category = category || event.category;
        event.visibility = visibility || event.visibility;

        await event.save();

        res.status(200).send({ message: 'Event updated successfully!', event });
    } catch (error) {
        res.status(500).send({ message: 'Failed to update event', error: error.message });
    }
});

// Delete Event
router.delete('/delete/:eventId', async (req, res) => {
    const { eventId } = req.params;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        await event.remove();

        res.status(200).send({ message: 'Event deleted successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete event', error: error.message });
    }
});

// Route for RSVP
router.post('/rsvp/:eventId', verifyToken, async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;

    try {
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check if user already RSVP'd
        if (event.attendees.includes(userId)) {
            return res.status(400).json({ message: 'You have already RSVP’d to this event' });
        }

        event.attendees.push(userId);
        await event.save();

        res.status(200).json({ message: 'RSVP successful', attendees: event.attendees });
    } catch (error) {
        res.status(500).json({ message: 'Failed to RSVP' });
    }
});

module.exports = router;
