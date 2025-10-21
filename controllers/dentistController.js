import DentistProfile from "../models/DentistProfile.js";
import User from "../models/User.js";

export const getDentistProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user || user.role !== "dentist") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const profile = await DentistProfile.findOne({ user: userId });
    res.json({ user, profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const toggleDentistActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const dentist = await DentistProfile.findById(id);
    if (!dentist) {
      return res.status(404).json({ message: "Dentist not found" });
    }

    dentist.isActive = isActive;
    await dentist.save();

    res.json({ message: "Dentist status updated successfully", dentist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const adminUpdateDentistProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const dentist = await DentistProfile.findByIdAndUpdate(id, data, { new: true });
    if (!dentist) {
      return res.status(404).json({ message: "Dentist not found" });
    }

    res.json({ message: "Profile updated successfully", dentist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getDentistById = async (req, res) => {
  try {
    const dentist = await DentistProfile.findById(req.params.id).populate(
      "user",
      "name email role"
    );
    if (!dentist) {
      return res.status(404).json({ message: "Dentist not found" });
    }
    res.json(dentist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getDentistsByProblem = async (req, res) => {
  try {
    const { problem } = req.query;
    if (!problem) {
      return res.status(400).json({ message: "Problem query is required" });
    }

    const dentists = await DentistProfile.find({
      problems: { $in: [new RegExp(problem, "i")] },
    }).populate("user", "name email role");

    res.json(dentists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllDentists = async (req, res) => {
  try {
    const { speciality } = req.query;
    let query = {};

    if (speciality) {
      query.specialization = { $in: [new RegExp(speciality, "i")] };
    }

    const dentists = await DentistProfile.find(query).populate(
      "user",
      "name email role"
    );
    res.json(dentists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateDentistProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || user.role !== "dentist") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const {
      name,
      phone,
      clinicName,
      problems,
      specialization,
      experienceYears,
      certifications,
      clinicAddress,
      states,
      about,
      gradCollege,
      gradYear,
      gradReg,
      postCollege,
      postYear,
      postSpec,
      otherQual,
      hasClinic,
      agreeDisclaimer,
    } = req.body;

    const image = req.file ? req.file.path : req.body.image;

    // Update base user data
    user.name = name || user.name;
    user.phone = phone || user.phone;
    await user.save();

    // Update or create profile
    let profile = await DentistProfile.findOne({ user: userId });
    if (!profile) {
      profile = new DentistProfile({ user: userId });
    }

    profile.clinicName = clinicName;
    profile.problems = problems.split(",");
    profile.specialization = specialization;
    profile.experienceYears = experienceYears;
    profile.certifications = certifications.split(",");
    profile.clinicAddress = clinicAddress;
    profile.states = states;
    profile.about = about;
    profile.image = image;
    profile.gradCollege = gradCollege;
    profile.gradYear = gradYear;
    profile.gradReg = gradReg;
    profile.postCollege = postCollege;
    profile.postYear = postYear;
    profile.postSpec = postSpec;
    profile.otherQual = otherQual;
    profile.hasClinic = hasClinic;
    profile.agreeDisclaimer = agreeDisclaimer;

    await profile.save();

    res.json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
