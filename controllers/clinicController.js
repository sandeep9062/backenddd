import Clinic from "../models/Clinics.js";
import sendEmail from "../utils/sendEmail.js";

// @desc Add a new clinic
// @route POST /api/clinics
export const addClinic = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user ID is missing" });
    }

    let {
      name,
      description,
      location,
      state,
      problems,
      offers,
      specialities,
      rating,
      appointmentCharges,
      noOfDoctors,
      numberOfDoctors,
      website,
      whatsapp,
      instagramId,
      mapUrl,
      isActive,
      phoneNumbers,
      subscribedPlans,
      areasServed,
      mainDoctorContact,
      bestTimeToConnect,
      socialMediaLinks,
    } = req.body;

    // Helper function to parse JSON strings
    const parseJsonIfString = (data) => {
      if (typeof data === 'string') {
        try {
          return JSON.parse(data);
        } catch (e) {
          return data;
        }
      }
      return data;
    };

    // Parse array and object fields
    problems = parseJsonIfString(problems) || [];
    offers = parseJsonIfString(offers) || [];
    specialities = parseJsonIfString(specialities) || [];
    phoneNumbers = parseJsonIfString(phoneNumbers) || [];
    subscribedPlans = parseJsonIfString(subscribedPlans) || [];
    areasServed = parseJsonIfString(areasServed) || [];
    mainDoctorContact = parseJsonIfString(mainDoctorContact) || {};
    bestTimeToConnect = parseJsonIfString(bestTimeToConnect) || [];
    socialMediaLinks = parseJsonIfString(socialMediaLinks) || {};

    const clinicData = {
      name,
      description,
      location,
      state,
      problems,
      offers,
      specialities,
      rating: Number(rating) || 0,
      appointmentCharges: Number(appointmentCharges) || 0,
      noOfDoctors: Number(noOfDoctors) || 0,
      numberOfDoctors: Number(numberOfDoctors) || 0,
      website,
      whatsapp,
      instagramId,
      mapUrl,
      phoneNumbers,
      subscribedPlans,
      areasServed,
      mainDoctorContact,
      bestTimeToConnect,
      socialMediaLinks,
      user: req.user._id,
    };

    if (isActive !== undefined) {
      clinicData.isActive = isActive === "true" || isActive === true;
    }

    if (req.files) {
      // Handle both images and videos
      clinicData.images = req.files
        .filter((file) => file.fieldname === 'image' || !file.fieldname)
        .map((file) => file.path);

      const videoFiles = req.files.filter((file) => file.fieldname === 'video');
      if (videoFiles.length > 0) {
        clinicData.videos = videoFiles.map((file) => file.path);
      }
    }

    const newClinic = new Clinic(clinicData);
    const savedClinic = await newClinic.save();

    // Send notification to owner
    try {
      const ownerEmail = process.env.OWNER_RECEIVER_EMAIL;
      if (ownerEmail) {
        const message = `
          <h3>New Clinic Added</h3>
          <p>A new clinic has been added to the platform:</p>
          <ul>
            <li><strong>Name:</strong> ${savedClinic.name}</li>
            <li><strong>Location:</strong> ${savedClinic.location}</li>
            <li><strong>State:</strong> ${savedClinic.state}</li>
          </ul>
        `;
        await sendEmail({
          to: ownerEmail,
          subject: "New Clinic Added Notification",
          html: message,
        });
      }
    } catch (emailError) {
      console.error("Error sending owner notification email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Clinic added successfully!",
      data: savedClinic,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
        error: error.message,
      });
    }
    res.status(500).json({
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
    const clinics = await Clinic.find()
      .populate({
        path: "user",
        populate: {
          path: "profile",
          model: "DentistProfile",
        },
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: clinics });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch clinics",
      error: error.message,
    });
  }
};

// @desc Get a single clinic by ID
// @route GET /api/clinics/:id
export const getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id).populate({
      path: "user",
      populate: {
        path: "profile",
        model: "DentistProfile",
      },
    });
    if (!clinic) {
      return res
        .status(404)
        .json({ success: false, message: "Clinic not found" });
    }
    res.status(200).json({ success: true, data: clinic });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch clinic",
      error: error.message,
    });
  }
};

// @desc Update a clinic
// @route PUT /api/clinics/:id
export const updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res
        .status(404)
        .json({ success: false, message: "Clinic not found" });
    }

    // Authorization check: User must own the clinic or be an admin
    if (
      clinic.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ success: false, message: "User not authorized" });
    }

    const updateData = { ...req.body };

    // Helper function to parse JSON strings
    const parseJsonIfString = (data) => {
      if (typeof data === 'string') {
        try {
          return JSON.parse(data);
        } catch (e) {
          return data;
        }
      }
      return data;
    };

    // Parse array and object fields
    if (updateData.problems) updateData.problems = parseJsonIfString(updateData.problems);
    if (updateData.offers) updateData.offers = parseJsonIfString(updateData.offers);
    if (updateData.specialities) updateData.specialities = parseJsonIfString(updateData.specialities);
    if (updateData.phoneNumbers) updateData.phoneNumbers = parseJsonIfString(updateData.phoneNumbers);
    if (updateData.subscribedPlans) updateData.subscribedPlans = parseJsonIfString(updateData.subscribedPlans);
    if (updateData.areasServed) updateData.areasServed = parseJsonIfString(updateData.areasServed);
    if (updateData.mainDoctorContact) updateData.mainDoctorContact = parseJsonIfString(updateData.mainDoctorContact);
    if (updateData.bestTimeToConnect) updateData.bestTimeToConnect = parseJsonIfString(updateData.bestTimeToConnect);
    if (updateData.socialMediaLinks) updateData.socialMediaLinks = parseJsonIfString(updateData.socialMediaLinks);

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      // Handle images - merge with existing ones
      const imageFiles = req.files.filter((file) => file.fieldname === 'image' || !file.fieldname);
      if (imageFiles.length > 0) {
        const newImagePaths = imageFiles.map((file) => file.path);
        // If existing images are provided in the form, use those, otherwise add to current images
        if (req.body.existingImages) {
          const existingImages = Array.isArray(req.body.existingImages)
            ? req.body.existingImages
            : [req.body.existingImages];
          updateData.images = [...existingImages, ...newImagePaths];
        } else {
          updateData.images = [...(clinic.images || []), ...newImagePaths];
        }
      } else if (req.body.existingImages) {
        // Only existing images provided
        updateData.images = Array.isArray(req.body.existingImages)
          ? req.body.existingImages
          : [req.body.existingImages];
      } else {
        // No images specified, remove images field to avoid clearing them
        delete updateData.images;
      }

      // Handle videos
      const videoFiles = req.files.filter((file) => file.fieldname === 'video');
      if (videoFiles.length > 0) {
        updateData.videos = videoFiles.map((file) => file.path);
      } else {
        delete updateData.videos;
      }
    } else {
      // No files uploaded - handle existingImages from form data
      if (req.body.existingImages !== undefined) {
        updateData.images = Array.isArray(req.body.existingImages)
          ? req.body.existingImages
          : [req.body.existingImages];
      } else {
        // No images specified, don't update
        delete updateData.images;
      }
      delete updateData.videos;
    }

    // Handle boolean conversion for isActive
    if (updateData.isActive === "true") {
      updateData.isActive = true;
    } else if (updateData.isActive === "false") {
      updateData.isActive = false;
    }

    // The 'user' field should not be updated from the body, it's immutable.
    // We delete it to prevent any accidental changes. The owner is already established.
    delete updateData.user;

    const updatedClinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Clinic updated successfully",
      data: updatedClinic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update clinic",
      error: error.message,
    });
  }
};

// @desc Delete a clinic
// @route DELETE /api/clinics/:id
export const deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res
        .status(404)
        .json({ success: false, message: "Clinic not found" });
    }
    // Authorization is handled by checkAdmin middleware
    await Clinic.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Clinic deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete clinic",
      error: error.message,
    });
  }
};

// @desc Get clinics by user
// @route GET /api/clinics/user
export const getClinicsByUser = async (req, res) => {
  try {
    const clinics = await Clinic.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: clinics });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch clinics",
      error: error.message,
    });
  }
};
