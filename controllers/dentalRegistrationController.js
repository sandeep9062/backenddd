import DentalRegistration from '../models/DentalRegistration_model.js';
import sendEmail from '../utils/sendEmail.js';

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      state,
      gradCollege,
      gradYear,
      gradReg,
      postCollege,
      postYear,
      postSpec,
      otherQual,
      hasClinic,
      agreeDisclaimer,
      ClinicName,
      ClinicPhoneNumber,
      ClinicAddress,
      ClinicInstagram,
      ClinicWebsite,
      ClinicYoutube,
      problems,
    } = req.body;

    const file = req.files.file ? req.files.file[0].path : null;
    const ClinicFile = req.files.ClinicFile ? req.files.ClinicFile[0].path : null;

    const newRegistration = new DentalRegistration({
      name,
      email,
      phoneNumber,
      state,
      gradCollege,
      gradYear,
      gradReg,
      postCollege,
      postYear,
      postSpec,
      otherQual,
      hasClinic,
      agreeDisclaimer,
      ClinicName,
      ClinicPhoneNumber,
      ClinicAddress,
      ClinicInstagram,
      ClinicWebsite,
      ClinicYoutube,
      file,
      ClinicFile,
      problems: problems ? problems.split(',') : [],
    });

    await newRegistration.save();

    // Send email notification
    await sendEmail({
      to: process.env.OWNER_RECEIVER_EMAIL,
      subject: 'New Dental Practitioner Registration',
      html: `
        <h2>New Dental Practitioner Registration</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>State:</strong> ${state}</p>
        <p><strong>Graduation College:</strong> ${gradCollege}</p>
        <p><strong>Clinic Name:</strong> ${ClinicName}</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Dental practitioner registered successfully',
      data: newRegistration,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const registrations = await DentalRegistration.find();
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
