const Project = require('../models/project');
import helper from '../models/mongo_helper';

/* Create new project */
const create = async ({ name, abstract, authors, tags, createdBy, authorImage }) => {
  try {

    const project = new Project({
      name,
      abstract,
      authors,
      tags,
      createdBy,
      authorImage,
    });

    if ( await project.save()){
      return [true, project] 
    }
  } catch (e) { 
    return [false, helper.translateError(e)]; 
  }
};

/* Return project with specified id */
const getById = async (id) => {
  try {
  // populate projects with data from file.
  const project = await Project.findById(id)
  return project

  } catch (e) {
    console.log(e)
  }
};

/* Return all projects */
const getAll = async () => {
  try {
    return await Project.find({})
  } catch (error) {
    console.log(error)
  }
};

const updateProject = async (id, newProject) => {
  try {
    const oldProject = await Project.findById(id);

    console.log(`OP: ${oldProject}`)
    if (oldProject) {
      await Project.updateOne({ ...newProject });
      const updatedProject = await Project.findById(id);
          console.log(`UP: ${updatedProject}`)
          console.log(`NP: ${newProject}`);

      return [true, updatedProject];
    } else {
      return [false, "project update failed"];
    }

  } catch (e) {
    return [false, helper.translateError(e)];
  }
};


module.exports = {
  getAll,
  create,
  getById,
  updateProject
};
