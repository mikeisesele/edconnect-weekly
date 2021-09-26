import React, { useEffect } from 'react';
import { Button, Card, Row, Form, Container } from "react-bootstrap";
import axios from "axios";


// create a complete functiomal component
const SingleProject = (props) => {
  const { abstract, authors, _id, name, tags, createdBy } = props.project;
  const [isFavorite, setIsFavorite] = React.useState(false);
  const favourites = props.currentUser.favouriteProjects;
  const title = props.title

  useEffect(() => {
    if (favourites.includes(_id)) {
      setIsFavorite(true);
    }
  }, [])

  const addToFaves = async () => {

    try {
      const data = await axios({
        url: `/favourites/add/${_id}`,
        method: "POST",
      });

      setIsFavorite(true);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <Container className="mb-3 pl-5 pr-5">
      <Card>
        <Card.Header>
          {`By: ${authors}`}
        
          <Button
            variant="outline-primary"
            className="mr-3 float-right"
            onClick={addToFaves}
          >
            {isFavorite ? "Added to Favourites" : "Add to Favourites"}
          </Button>
        </Card.Header>
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{abstract}</Card.Text>
          {title == "Read more" ? (
            <Button
              className="float-right"
              variant="primary"
              href={`/project/${_id}`}
            >
              {title}
            </Button>
          ) : (
              <Button
              className="float-right"
              variant="primary"
              href={`/favourites/delete/${_id}`}
            >
              {title}
            </Button>
            ) 
          }
        </Card.Body>
      </Card>
    </Container>
  );
    }
        export default SingleProject;