import mongoose from 'mongoose';


const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    abstract: { 
        type: String,
        required: true
    },
    authors: {
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

