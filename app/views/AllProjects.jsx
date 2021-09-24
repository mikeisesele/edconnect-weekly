import React, { useState, useEffect } from "react";
import Layout from "./shared/Layout";
import { Button, Card, Image, Container, Row } from "react-bootstrap";
import ShowAlert from "./Alert";
const Projects = (data) => {

  const projects = data.response.data.projects;

  
  return projects.map((project) => {
    const { abstract, authors, _id, name, tags, createdBy } = project;

    return (
      <Container className="mb-3 pl-5 pr-5">
        <Card key={project._id}>
          <Card.Header className="">{`By: ${authors}`}</Card.Header>
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
