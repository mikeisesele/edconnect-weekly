import React from "react";
import Layout from "./shared/Layout";
import { Button, Card, Container } from "react-bootstrap";

const FavProjects = (props) => {
  const projects = props.response

  return projects.map((project) => {
    const { abstract, authors, _id, name, tags, createdBy } = project;

    return (
      <Container className="mb-3 pl-5 pr-5">
        <Card key={project._id}>
          <Card.Header>{`By: ${authors}`}</Card.Header>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{abstract}</Card.Text>
            <Button
              className="float-right"
              variant="primary"
              href={`/favourites/delete/${_id}`}
            >
              Remove from favourites
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  });
};

const Header = () => {
  return (
    <div className="text-center mx-auto mb-3">
      <h1>Favourite Projects</h1>
      <p>Your Favourite projects</p>
    </div>
  );
};

const Favourites = (props) => {
  console.log(props);
  return (
    <Layout response={props}>
      <Header />
      <FavProjects response={props.response.data.project} />
    </Layout>
  );
};

export default Favourites;
