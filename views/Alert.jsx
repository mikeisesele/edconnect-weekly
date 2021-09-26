import React from "react";
import { Alert} from "react-bootstrap";

const showAlert = ({message, className, variant }) => {
  return (
    <Alert variant={variant} className={className}>
      {message}
    </Alert>
  );
};

// export dedault is used because it is a function 
// any other name can be used to access it from its import
// to be imported with import and not require
export default showAlert;
