import mongoose from 'mongoose';


const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    projectAbstract: { 
        type: String,
        required: true
    },
    projectAuthors: {
        type: [String],
        required: true
    },
    tags: {
        type: [String],
    },
    createdBy: {
        type: mongoose.ObjectId,
        required: true
    },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;

