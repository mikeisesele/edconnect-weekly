const Project = require('../models/project');
import helper from '../models/mongo_helper';

/**
 * @desc  Create a new project in the database
 */
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

    // Save project to database and return project
    if ( await project.save()){
      return [true, project] 
    }
  } catch (e) { 
    return [false, helper.translateError(e)]; 
  }
};

/**
 * @desc get a project from the database by id
 */
const getById = async (id) => {
  try {
  const project = await Project.findById(id)
  return project

  } catch (e) {
    console.log(e)
  }
};

/**
 * @desc Get all projects from the database
 */
const getAll = async () => {
  try {
    return await Project.find({})
  } catch (error) {
    console.log(error)
  }
};

/**
 * @desc  Update a project in the database
 * @param {string} id - The id of the project to update
 * @param {object} newProject - The project object to update
 * @returns {object} - The updated project
 */
const updateProject = async (id, newProject) => {
  try {
    // Find project by id
    const oldProject = await Project.findById(id);

    // Update project
    if (oldProject) {
      await Project.updateOne({ ...newProject });
      const updatedProject = await Project.findById(id);

      // Return updated project
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
