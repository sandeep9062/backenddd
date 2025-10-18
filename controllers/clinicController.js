import Clinic from '../models/Clinics.js';

// @desc Add a new clinic
// @route POST /api/clinics
export const addClinic = async (req, res) => {
  try {
    const {
      name,
      location,
      state,
      problems,
      rating,
      bookUrl,
      website,
      whatsapp,
      mapUrl,
    } = req.body;

    const clinicData = {
      name,
      location,
      state,
      problems,
      rating,
      bookUrl,
      website,
      whatsapp,
      mapUrl,
      user: req.user._id,
    };

    if (req.file) {
      clinicData.img = req.file.path;
    }

    const newClinic = new Clinic(clinicData);
    const savedClinic = await newClinic.save();
    res.status(201).json({
      success: true,
      message: "Clinic added successfully!",
      data: savedClinic,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to add clinic",
        error: error.message,
      });
  }
};

// @desc Get all clinics
// @route GET /api/clinics
export const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find().populate({
      path: 'user',
      populate: {
        path: 'profile',
        model: 'DentistProfile'
      }
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: clinics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch clinics', error: error.message });
  }
};

// @desc Get a single clinic by ID
// @route GET /api/clinics/:id
export const getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    res.status(200).json({ success: true, data: clinic });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch clinic', error: error.message });
  }
};

// @desc Update a clinic
// @route PUT /api/clinics/:id
export const updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    if (clinic.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }
    const updateData = req.body;
    if (req.file) {
      updateData.img = req.file.path;
    }
    const updatedClinic = await Clinic.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ success: true, message: 'Clinic updated successfully', data: updatedClinic });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update clinic', error: error.message });
  }
};

// @desc Delete a clinic
// @route DELETE /api/clinics/:id
export const deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    if (clinic.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }
    await Clinic.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Clinic deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete clinic', error: error.message });
  }
};
