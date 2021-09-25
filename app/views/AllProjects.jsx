import React, { useState, useEffect } from "react";
import Layout from "./shared/Layout";
import { Button, Card, Row, Form, Container } from "react-bootstrap";

const Projects = (data) => {

      const [favourite, setFavourite] = useState("Add to favourites");

          const handleSubmit = (e) => {
            // e.preventDefault();
            const { name, value } = e.target;
            switch (name) {
              case `${project._id}`:
                setFavourite(value);
                break;
              default:
            }
          };


  const projects = data.response.data.projects;

  
  return projects.map((project) => {
    const { abstract, authors, _id, name, tags, createdBy } = project;

    return (
      <Container className="mb-3 pl-5 pr-5">
        <Card key={project._id}>
          <Card.Header>
            {`By: ${authors}`}

            <Button
              variant="outline-primary"
              name={`${project._id}`}
              href={`/projects/favourites/${project._id}`}
              className="mr-3 float-right"
              value="Added to favourites"
              onClick={handleSubmit}
            >
              {favourite}
            </Button>
            {/* <Form
              id="loginForm"
              className="mb-3 float-right"
              method="post"
              action="/login"
            >
              <Form.Group >
                <Form.Label className="text-secondary">Add to favourites</Form.Label>
                <Form.Control
                  type="text"
                  value={email}
                  onClick={handleInput}
                  name="favourite"
                />
              </Form.Group>
            </Form> */}
          </Card.Header>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{abstract}</Card.Text>
            <Button
              className="float-right"
              variant="primary"
              href={`/project/${_id}`}
            >
              Read More
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  });
};

const Header =()=> {
    return ( 
        <div className="text-center mx-auto mb-3">
            <h1 >All Projects</h1>
            <p>Find all projects in our repository</p>
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
