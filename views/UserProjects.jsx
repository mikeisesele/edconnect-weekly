import React from "react";
import Layout from "./shared/Layout";
import SingleProject from "./SingleProject";

const MyProjects = (props) => {
 console.log(props)
   const projects = props.response.data.projects;
  const currentUser = props.response.currentUser;

  return projects.map((project) => (
    <SingleProject project={project} key={project._id} currentUser={currentUser} title="Read more" />
));
}

const Header = () => {
  return (
    <div className="text-center mx-auto mb-3">
      <h1>My Projects</h1>
      <p>Projects created by me</p>
    </div>
  );
};

const PersonalProjects = (props) => {
    return (
        <Layout response={props}>
            <Header />
            <MyProjects {...props} />
        </Layout>
    );
};

export default PersonalProjects;