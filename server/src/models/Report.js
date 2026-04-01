import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    filename: String,
    url: String
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Academic", "Staff Behavior", "Facilities", "Mental Pressure", "Harassment", "Other"],
      required: true
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 5000
    },
    images: [imageSchema],
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true
    },
    severityScore: {
      type: Number,
      required: true
    },
    severityReasons: {
      type: [String],
      default: []
    },
    upvotes: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isFlaggedSpam: {
      type: Boolean,
      default: false
    },
    reportCode: {
      type: String,
      unique: true,
      index: true,
      required: true
    },
    parentReportCode: {
      type: String,
      default: null,
      index: true
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED"],
      default: "PENDING"
    },
    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      default: null
    }
  },
  {
    timestamps: false
  }
);

export const Report = mongoose.model("Report", reportSchema);
