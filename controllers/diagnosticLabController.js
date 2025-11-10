import DiagnosticLabs from "../models/DiagnosticLabs.js";
import sendEmail from "../utils/sendEmail.js";

// ✅ Add a new Diagnostic Lab
export const addDiagnosticLab = async (req, res) => {
  try {
    const labData = req.body;

    if (req.file) {
      labData.img = req.file.path; // assuming file upload middleware
    }

    labData.user = req.user._id; // current authenticated user

    const lab = new DiagnosticLabs(labData);
    const savedLab = await lab.save();

    // Send notification to owner
    try {
      const ownerEmail = process.env.OWNER_RECEIVER_EMAIL;
      if (ownerEmail) {
        const message = `
          <h3>New Diagnostic Lab Added</h3>
          <p>A new diagnostic lab has been added to the platform:</p>
          <ul>
            <li><strong>Name:</strong> ${savedLab.name}</li>
            <li><strong>Location:</strong> ${savedLab.location}</li>
            <li><strong>State:</strong> ${savedLab.state}</li>
          </ul>
        `;
        await sendEmail({
          to: ownerEmail,
          subject: "New Diagnostic Lab Added Notification",
          html: message,
        });
      }
    } catch (emailError) {
      console.error("Error sending owner notification email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Diagnostic Lab added successfully",
      data: savedLab,
    });
  } catch (error) {
    console.error("Error adding lab:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get all Diagnostic Labs
export const getAllDiagnosticLabs = async (req, res) => {
  try {
    const labs = await DiagnosticLabs.find().populate("user", "name email");
    res.status(200).json({ success: true, data: labs });
  } catch (error) {
    console.error("Error fetching labs:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get a single Diagnostic Lab by ID
export const getDiagnosticLabById = async (req, res) => {
  try {
    const lab = await DiagnosticLabs.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!lab)
      return res
        .status(404)
        .json({ success: false, message: "Diagnostic Lab not found" });

    res.status(200).json({ success: true, data: lab });
  } catch (error) {
    console.error("Error fetching lab:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Update Diagnostic Lab
export const updateDiagnosticLab = async (req, res) => {
  try {
    const { id } = req.params;
    const lab = await DiagnosticLabs.findById(id);

    if (!lab)
      return res
        .status(404)
        .json({ success: false, message: "Diagnostic Lab not found" });

    if (req.file) {
      req.body.img = req.file.path;
    }

    const updatedLab = await DiagnosticLabs.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Diagnostic Lab updated successfully",
      data: updatedLab,
    });
  } catch (error) {
    console.error("Error updating lab:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Delete Diagnostic Lab
export const deleteDiagnosticLab = async (req, res) => {
  try {
    const lab = await DiagnosticLabs.findById(req.params.id);
    if (!lab)
      return res
        .status(404)
        .json({ success: false, message: "Diagnostic Lab not found" });

    await lab.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Diagnostic Lab deleted successfully" });
  } catch (error) {
    console.error("Error deleting lab:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
