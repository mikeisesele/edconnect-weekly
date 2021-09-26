import React from "react";
import Layout from "./shared/Layout";
import SingleProject from "./SingleProject";

const Projects = (data) => {

  const projects = data.response.data.projects;
  const currentUser = data.response.currentUser;

  return projects.map((project) => (
    <SingleProject
      project={project}
      key={project._id}
      currentUser={currentUser}
      title="Read more"
    />
  ));
};

const Header =()=> {
    return ( 
        <div className="text-center mx-auto mb-3">
            <h1 >Projects</h1>
        </div>
    )
}

const AllProjects = (props) => {
 
  return (
    <Layout response={props}>
        <Header />
      <Projects {...props} />
    </Layout>
  );
};

export default AllProjects;
