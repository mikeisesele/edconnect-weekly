/**
 * @desc Validates email address using regex
 */
const isValidEmail = (email) => {
  const result =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return result.test(String(email).toLowerCase());
};


//export this file
// module.exports is the way to make this function accessible from the outside because it is a module
export default isValidEmail


