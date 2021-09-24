import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

const ProjectForm = ({response}) => {


    const { project, submit } = response;

  const [name, setName] = useState(project.name);
  const [abstract, setAbstract] = useState(project.abstract);
  const [authors, setAuthors] = useState(project.authors || []);
  const [tags, setTags] = useState(project.tags || []);
  const [projectInfo, setProjectInfo] = useState({});

  // when the page first loads, set the text views to the user's info
  useEffect(() => {
    setProjectInfo({
      name,
      abstract,
      authors,
      tags,
    });
  }, []);

  const handleInput = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case "projectName":
        setName(value);
        break;
      case "abstract":
        setAbstract(value);
        break;
      case "authors":
        setAuthors(value.split(","));
        break;
      case "tags":
        setTags(value.split(","));
        break;
      default:
    }
  };

  return (
    <main>
      <div className="mx-auto w-50 p-2 mt-3">
        {project.name ? <h3>Edit Project</h3> : <h3>Submit Project</h3>}

        <Form id="createProjectForm" method="post" action={submit}>
          <Form.Group as={Row}>
            <Col>
              <Form.Label>Project Name: </Form.Label>
              <Form.Control
                type="text"
                name="name"
                id="name"
                placeholder="Enter project name"
                value={name}
                onChange={handleInput}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Col>
              <Form.Label>Project Abstract: </Form.Label>
              <Form.Control
                as="textarea"
                name="abstract"
                id="abstract"
                rows={4}
                cols={100}
                value={abstract}
                onChange={handleInput}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Col>
              <Form.Label>Author(s): </Form.Label>
              <Form.Control
                type="text"
                name="authors"
                id="authors"
                placeholder="Enter author names (seperated by comma)"
                value={authors.join(",")}
                onChange={handleInput}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Col>
              <Form.Label>Tag(s): </Form.Label>
              <Form.Control
                type="text"
                id="tags"
                name="tags"
                placeholder="Use # to tag project with different topics"
                value={tags.join(",")}
                onChange={handleInput}
              />
            </Col>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </main>
  );
};

export default ProjectForm;
