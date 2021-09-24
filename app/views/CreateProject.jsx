import React from "react";
import Layout from "./shared/Layout";
import ProjectForm from "./ProjectForm";
import ShowAlert from "./Alert";


const CreateProjectForm = ({ response }) => {

  const {data, result, error } = response;
  const submit = `/projects/submit`;
  const project = data.project
  const update = `/projects/update/${project._id}`

  return (
    <div>
      {error?.length > 0 && (
        <ShowAlert
          message={`${error.map((text) => {
            return (
              <>
                {text}
                <br />
              </>
            );
          })}
              `}
          className="text-center alert alert-danger"
          variant="danger text-sm"
        />
      )}

      {result == "create" ? (
        <ProjectForm response={{ project, submit }} />
      ) : (
        <ProjectForm response={{ project, update }} />
      )}
    </div>
  );
};

const CreateProject = (props) => {
  console.log(props)
  return (
    <Layout response={props}>
      <CreateProjectForm response={props.response} />
    </Layout>
  );
};

export default CreateProject;
