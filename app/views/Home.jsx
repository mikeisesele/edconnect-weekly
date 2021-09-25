import React from "react";
import { Button, Card, CardGroup, Jumbotron } from "react-bootstrap";
import Layout from "./shared/Layout";

const Jumbo = (props) => {
  const currentUser = props ? props: null;


  return (
    <>
      <Jumbotron>
        <h1>Welcome to Project Explorer</h1>
        <p>
          Project Explorer is a repository for interesting projects accross all
          fields of knowledge. An Ideal place for intellectuals! You can submit
          your projects and search projects submitted by others to learn from.
        </p>
        {currentUser ? (
          <>
            <Button variant="primary" className="mr-3" href="/projects/mine">
              Created Projects
            </Button>
            <Button
              variant="primary"
              className="mr-3"
              href="/projects/favourites"
            >
              Favourite Projects
            </Button>
            <Button variant="secondary" href="/project/create">
              Add a project
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" className="mr-3" href="/signup">
              Get Started
            </Button>
            <Button variant="secondary" href="/login">
              Login
            </Button>
          </>
        )}
      </Jumbotron>
    </>
  );
};


const Showcase = ( props ) => {
  
  const projects = props.response.data.projects;


  return (
    <>
      <CardGroup className="showcase">
        {projects
          .reverse()
          .slice(0, 4)
          .map((project) => {
            const { abstract, authors, id, name, tags } = project;

            return (
              <Card key={id}>
                <Card.Body>
                  <Card.Title>
                    <Card.Link href={`/project/${id}`}>{name}</Card.Link>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {authors}
                  </Card.Subtitle>
                  <Card.Text>{` ${abstract} `}</Card.Text>
                  <Card.Link href="#">{tags}</Card.Link>
                </Card.Body>
              </Card>
            );
          })}
      </CardGroup>
    </>
  );
};


const Home = (props) => {
  return (
    <Layout response={props}>
      <main className="container">
        <Jumbo user={props.response.currentUser} />
        <Showcase {...props} />
      </main>
    </Layout>
  );
};

export default Home;
