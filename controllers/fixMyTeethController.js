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

export const getFixMyTeethCases = async (req, res) => {
  try {
    const cases = await FixMyTeeth.find();
    res.status(200).json(cases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFixMyTeethCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const fixMyTeethCase = await FixMyTeeth.findById(id);
    if (!fixMyTeethCase) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.status(200).json(fixMyTeethCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
