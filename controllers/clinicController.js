import Clinic from "../models/Clinics.js";

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
      location,
      state,
      problems,
      offers,
      rating,
      appointmentCharges,
      website,
      whatsapp,
      mapUrl,
      isActive,
    } = req.body;

    // Ensure 'problems' is an array
    if (!problems) {
      problems = [];
    } else if (typeof problems === "string") {
      problems = [problems];
    }

    // Ensure 'offers' is an array
    if (!offers) {
      offers = [];
    } else if (typeof offers === "string") {
      offers = [offers];
    }

    const clinicData = {
      name,
      location,
      state,
      problems: problems || [],
      offers: offers,
      rating: Number(rating) || 0,
      appointmentCharges: Number(appointmentCharges) || 0,
      website,
      whatsapp,
      mapUrl,
      user: req.user._id,
    };

    if (isActive !== undefined) {
      clinicData.isActive = isActive === "true";
    }

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

    // If an image file is uploaded, add its path to the update data
    if (req.file) {
      updateData.img = req.file.path;
    } else {
      // If no new file is uploaded, don't try to update the image with a URL string
      delete updateData.img;
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

    // If 'problems' is sent as a JSON string, parse it into an array
    if (typeof updateData.problems === "string") {
      try {
        updateData.problems = JSON.parse(updateData.problems);
      } catch (e) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid format for problems" });
      }
    }

    if (typeof updateData.offers === "string") {
      try {
        updateData.offers = JSON.parse(updateData.offers);
      } catch (e) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid format for offers" });
      }
    }

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
