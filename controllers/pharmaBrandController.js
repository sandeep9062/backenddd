import PharmaBrand from '../models/PharmaBrand.model.js';
import sendEmail from '../utils/sendEmail.js';

export const registerPharmaBrand = async (req, res) => {
  try {
    const newBrand = new PharmaBrand(req.body);
    await newBrand.save();

    const message = `
      <h1>New Pharma/Brand Registration</h1>
      <p><strong>Brand Name:</strong> ${newBrand.brandName}</p>
      <p><strong>Owner Name:</strong> ${newBrand.OwnerName}</p>
      <p><strong>Email:</strong> ${newBrand.email}</p>
      <p><strong>Phone Number:</strong> ${newBrand.phoneNumber}</p>
      <p><strong>Alternative Number:</strong> ${newBrand.alternativeNumber}</p>
      <p><strong>Website URL:</strong> ${newBrand.websiteURL}</p>
    `;

    await sendEmail({
      to: process.env.OWNER_RECEIVER_EMAIL,
      subject: 'New Pharma/Brand Registration',
      html: message,
    });

    res.status(201).json({ success: true, message: 'Pharma brand created successfully', brand: newBrand });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create pharma brand', error: error.message });
  }
};

export const fetchPharmaBrands = async (req, res) => {
  try {
    const brands = await PharmaBrand.find({});
    res.status(200).json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch pharma brands', error: error.message });
  }
};
