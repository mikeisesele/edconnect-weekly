import React, { useState, useEffect } from "react";
import Layout from "./shared/Layout";
import { Button, Card, Image, Container, Row } from "react-bootstrap";

const MyProjects = (data) => {
 
    const projects = data.response.data.projects 
        
    return projects.reverse().map((project) => {
      const { abstract, authors, _id, name } = project;
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
          {/* <Image
                        src={`${}`}
                        roundedCircle
                        style={{ height: 3 + "rem", width: 3 + "rem" }}
                        ></Image> */}
        </Container>
      );
    });
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