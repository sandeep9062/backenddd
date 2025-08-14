import mongoose from "mongoose";

const uniformTypes = [
  "School",
  "Womens",
  "Mens",
  "Company",
  "Hospital",
  "Hotel",
  "Other",
];

const uniformSubtypes = {
  School: [
    "CBSE School Uniforms",
    "Private School Uniforms",
    "Government School Uniforms",
    "Uniform Shirtings",
    "Uniform Suitings",
    "Plain School Uniforms",
  ],
  Womens: [
    "Teachers Uniform Sarees",
    "Staff Uniform Sarees",
    "Cotton Uniform Sarees",
    "Wedding Uniform Sarees",
    "Plain Uniform Sarees",
    "Set Sarees",
    "Uniform Chudithars",
    "Saree Chudithar Combo",
    "Malgudi Silk Uniform Sarees",
    "Turkey Crape Uniform Sarees",
    "Silk Crape Uniform Sarees",
    "Silk Cotton Uniform Sarees",
    "Peach Crape Uniform Sarees",
    "Silk Touch Uniform Sarees",
  ],
  Mens: [
    "Uniform Shirts",
    "Uniform Pants",
    "Uniform Blazers",
    "Uniform Tshirts",
    "Uniform Waist Coats",
  ],
  Company: [
    "Company Uniforms",
    "Staff Uniforms",
    "Industrial Uniforms",
    "Mechanic Uniforms",
  ],
  Hospital: [
    "Hospital Uniforms",
    "Doctor Coats",
    "Operation Theatre Uniforms",
    "Nurse Uniforms",
    "Doctor Uniform Sarees",
    "Staff Uniform Chudidhars",
    "Mens Staff Uniforms",
    "Hospital Uniform Shirts",
    "Hospital Uniform Pants",
    "Hospital Uniform Sarees",
  ],
  // Hotel and Other have no subtypes
};

const UniformSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    uniformType: {
      type: String,
      required: true,
      enum: uniformTypes,
    },
    uniformSubtype: {
      type: String,
      required: function () {
        // subtype is required only if the type has defined subtypes
        return (
          this.uniformType &&
          uniformSubtypes[this.uniformType] &&
          uniformSubtypes[this.uniformType].length > 0
        );
      },
      validate: {
        validator: function (value) {
          if (!this.uniformType) return false;
          const subtypes = uniformSubtypes[this.uniformType];
          if (!subtypes || subtypes.length === 0) return true; // no subtype restriction
          return subtypes.includes(value);
        },
        message: (props) =>
          `${props.value} is not a valid subtype for uniform type ${props.instance.uniformType}`,
      },
    },
    uniformCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Uniform", UniformSchema);
