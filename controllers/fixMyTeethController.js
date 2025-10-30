import FixMyTeeth from "../models/FixMyTeeth.js";

export const submitFixMyTeethCase = async (req, res) => {
  try {
    const {
      name,
      email,
      teethProblems,
      otherProblemText,
      selectedState,
      selectedType,
    } = req.body;
    const photos = req.files ? req.files.map((file) => file.path) : [];

    const newCase = new FixMyTeeth({
      user: req.user ? req.user._id : null,
      name,
      email,
      teethProblems: JSON.parse(teethProblems),
      otherProblemText,
      selectedState,
      selectedType,
      photos,
    });

    await newCase.save();
    res.status(201).json({ success: true, message: "Case submitted successfully." });
  } catch (error) {
    console.error("Error submitting case:", error);
    res.status(500).json({ message: "Server error while submitting case." });
  }
};

export const getFixMyTeethCases = async (req, res) => {
  try {
    const cases = await FixMyTeeth.find().sort({ createdAt: -1 });
    res.json({ success: true, cases });
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({ message: "Server error while fetching cases." });
  }
};

export const getFixMyTeethCaseById = async (req, res) => {
  try {
    const caseData = await FixMyTeeth.findById(req.params.id);
    if (!caseData) {
      return res.status(404).json({ message: "Case not found." });
    }
    res.json({ success: true, case: caseData });
  } catch (error) {
    console.error("Error fetching case:", error);
    res.status(500).json({ message: "Server error while fetching case." });
  }
};

export const getMyFixMyTeethSubmissions = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const submissions = await FixMyTeeth.find({
      $or: [{ user: user._id }, { email: user.email }],
    }).sort({ createdAt: -1 });

    res.json({ success: true, submissions });
  } catch (error) {
    console.error("Error fetching Fix My Teeth submissions:", error);
    res.status(500).json({ message: "Server error while fetching submissions." });
  }
};
