const Project = require('../models/project');
import helper from '../models/mongo_helper';

/* Create new project */
const create = async ({ name, abstract, authors, tags, createdBy }) => {
  try {

    const project = new Project({ name, abstract, authors, tags, createdBy });

    if ( await projects.save()){
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
  return await Project.findById(id)
  //return await Project.findById(id).populate(‘createdBy’)
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

module.exports = {
  getAll,
  create,
  getById
};
