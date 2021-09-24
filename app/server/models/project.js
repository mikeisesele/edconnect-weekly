import mongoose from 'mongoose';
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    abstract: {
      type: String,
      required: true,
    },
    authors: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

projectSchema.index(
  {
    name: 'text',
    abstract: 'text',
    tags: 'text',
    authors: 'text',
    createdBy: 'text'
  },
  { name: 'Project Text Index', 
  weights: {
    name: 10,
    abstract: 5,
    tags: 2,
    authors: 2,
    createdBy: 2
  }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;

