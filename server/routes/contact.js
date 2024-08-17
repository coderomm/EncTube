const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { z } = require('zod');

const contactValidationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  mobileNumber: z.string().min(10, { message: 'Mobile number must be at least 10 digits' }).regex(/^\d+$/, 'Mobile number must contain only digits'),
  email: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  message: z.string().min(1, { message: 'Message is required' }),
});

router.post('/query', async (req, res) => {
  try {
    const validationResult = contactValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error.errors });
    }

    const newContact = new Contact(validationResult.data);
    await newContact.save();

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Failed to submit contact form' });
  }
});

module.exports = router;