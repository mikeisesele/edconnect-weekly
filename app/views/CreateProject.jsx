import React from "react";
import Layout from "./shared/Layout";
import ProjectForm from "./ProjectForm";
import ShowAlert from "./Alert";
import { Container } from "react-bootstrap";

const CreateProjectForm = ({ response }) => {

  const {data, result, message} = response;

  const update = `/projects/update/`;
  const submit = `/projects/submit`;
  const user = data.user;
  const project = data.project

  const sentResponse =  { project, user, action: `${update}${project._id}` }

  return (
    <div>
      {!result && (
        <Container>
          <ShowAlert
            message={message}
            className="alert alert-primary"
            variant="danger text-sm"
          />
        </Container>
      )}
      {result ? (
        <ProjectForm response={sentResponse} />
      ) : (
        <ProjectForm response={project, submit} />
      )}
    </div>
  );
};

const CreateProject = (props) => {

  return (
    <Layout user={props.response.data.user}>
      <CreateProjectForm response = {props.response} />
    </Layout>
  );
};

export default CreateProject;
