import FixMyTeeth from "../models/FixMyTeeth.js";

export const submitFixMyTeethCase = async (req, res) => {
  try {
    const {
      user,
      name,
      email,
      selectedType,
      teethProblems,
      otherProblemText,
      selectedState,
    } = req.body;

    const photos = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => photos.push(file.path));
    }

    const fixCase = new FixMyTeeth({
      user,
      name,
      email,
      selectedType,
      teethProblems: teethProblems,
      otherProblemText,
      selectedState,
      photos,
    });

    await fixCase.save();
    res.status(201).json({ message: "Case submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
