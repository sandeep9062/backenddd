import CbctOpgLabs from "../models/CbctOpgLabs.js";
import sendEmail from "../utils/sendEmail.js";

// @desc    Add new CBCT & OPG Lab
// @route   POST /api/cbct-opg-labs
export const addCbctOpgLab = async (req, res) => {
  try {
    const {
      state,
      name,
      location,
      rating,

      website,
      whatsapp,
      mapUrl,
    } = req.body;

    const labExists = await CbctOpgLabs.findOne({ user: req.user._id });
    if (labExists) {
      return res
        .status(400)
        .json({ success: false, message: "You already have a lab profile." });
    }

    const lab = new CbctOpgLabs({
      user: req.user._id,
      img: req.file ? req.file.path : "",
      state,
      name,
      location,
      rating: rating || 0,
  
      website,
      whatsapp,
      mapUrl,
    });

    const savedLab = await lab.save();

    // Send notification to owner
    try {
      const ownerEmail = process.env.OWNER_RECEIVER_EMAIL;
      if (ownerEmail) {
        const message = `
          <h3>New CBCT/OPG Lab Added</h3>
          <p>A new CBCT/OPG lab has been added to the platform:</p>
          <ul>
            <li><strong>Name:</strong> ${savedLab.name}</li>
            <li><strong>Location:</strong> ${savedLab.location}</li>
            <li><strong>State:</strong> ${savedLab.state}</li>
          </ul>
        `;
        await sendEmail({
          to: ownerEmail,
          subject: "New CBCT/OPG Lab Added Notification",
          html: message,
        });
      }
    } catch (emailError) {
      console.error("Error sending owner notification email:", emailError);
    }

    res
      .status(201)
      .json({ success: true, message: "Lab added successfully", data: savedLab });
  } catch (error) {
    console.error("Error adding lab:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all labs
// @route   GET /api/cbct-opg-labs
export const getAllCbctOpgLabs = async (req, res) => {
  try {
    const labs = await CbctOpgLabs.find().populate("user", "name email");
    res.json({ success: true, count: labs.length, data: labs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get lab by ID
// @route   GET /api/cbct-opg-labs/:id
export const getCbctOpgLabById = async (req, res) => {
  try {
    const lab = await CbctOpgLabs.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!lab)
      return res.status(404).json({ success: false, message: "Lab not found" });
    res.json({ success: true, data: lab });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lab
// @route   PUT /api/cbct-opg-labs/:id
export const updateCbctOpgLab = async (req, res) => {
  try {
    const lab = await CbctOpgLabs.findById(req.params.id);
    if (!lab)
      return res.status(404).json({ success: false, message: "Lab not found" });

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to update this lab" });
    }

    const updates = { ...req.body };
    if (req.file) updates.img = req.file.path;

    const updatedLab = await CbctOpgLabs.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    res.json({
      success: true,
      message: "Lab updated successfully",
      data: updatedLab,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete lab
// @route   DELETE /api/cbct-opg-labs/:id
export const deleteCbctOpgLab = async (req, res) => {
  try {
    const lab = await CbctOpgLabs.findById(req.params.id);
    if (!lab)
      return res.status(404).json({ success: false, message: "Lab not found" });

    if (
      req.user.role !== "admin" &&
      lab.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await lab.deleteOne();
    res.json({ success: true, message: "Lab deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
