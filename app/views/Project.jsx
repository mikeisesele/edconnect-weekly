import React from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Image,
} from "react-bootstrap";
import Layout from "./shared/Layout";

const ProjectLayout = (projectProperties) => {
  const { project, projectCreator, authorImage } =
    projectProperties.projectResponse;
  return (
    <>
      <Container>
        <Row id="project_name">
          <h3>{project.name}</h3>
        </Row>
        <Row className="bg-light p-3 align-items-center">
          <Col id="project_author" className="d-flex mb-0 align-items-center">
            <Image
              src={`${authorImage}`}
              roundedCircle
              style={{ height: 3 + "rem", width: 3 + "rem" }}
            ></Image>
            <div className="d-flex flex-column mb-0 align-items-center pl-3">
              <p className="mb-0">Created By</p>
              <p className="mb-0">{`${projectCreator.firstName} ${projectCreator.lastName}`}</p>
            </div>
          </Col>

          <Col>
            <p className="mb-0">Date Created</p>
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </Col>

          <Col>
            <p className="mb-0">Last Updated</p>
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </Col>

          <Col>
            <div className="col-sm">
              <div className="d-flex justify-content-end">
                <a href="#" className=" btn btn-primary">
                  Edit Project
                </a>
              </div>
            </div>
          </Col>
        </Row>
        <br />

        <Row>
          <Col>
            <div id="project_abstract">
              <strong>
                <h5>Project Abstract</h5>
              </strong>
              <p>{project.abstract}</p>
            </div>

            <hr className="mb-4" />

            <div className="mx-auto ">
              <b>Comments</b>
              <Form>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Leave a comment"
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </div>
          </Col>

          <Col>
            <h5>Project Details</h5>

            <hr className="mb-4" />

            <Card className="text-center">
              <Card.Header>
                <b>Author(s)</b>
              </Card.Header>
              <Card.Body id="project_authors">
                <Card.Text id="project_authors">
                  {project?.authors.map((author, index) => {
                    return (
                      <div key={index}>
                        {index > 0 ? <hr /> : null}
                        <p className="pr-3 pl-3">{author}</p>
                      </div>
                    );
                  })}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted" id="project_tags">
                <b>{project.tags}</b>
              </Card.Footer>
            </Card>

            <br />

            <Card>
              <Card.Header className="text-center">
                <b>Project files</b>
              </Card.Header>
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p className="pr-3 pl-3">No file uploaded yet</p>
                </blockquote>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

const Project = (props) => {
  return (
    <Layout user={props.projectResponse.user}>
      <ProjectLayout {...props} />
    </Layout>
  );
};

export default Project;
