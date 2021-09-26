import React from "react";
import Layout from "./shared/Layout";
import SingleProject from "./SingleProject";


const FavProjects = (props) => {
  
const projects = props.response.data.project;
const currentUser = props.response.currentUser;

return projects.map((project) => (
  <SingleProject
    project={project}
    key={project._id}
    currentUser={currentUser}
    title="Remove from favourites"
  />
));
}

const Header = () => {
  return (
    <div className="text-center mx-auto mb-3">
      <h1>Favourite Projects</h1>
      <p>Your Favourite projects</p>
    </div>
  );
};

const Favourites = (props) => {
  
  return (
    <Layout response={props}>
      <Header />
      <FavProjects {...props} />
    </Layout>
  );
};

export default Favourites;
