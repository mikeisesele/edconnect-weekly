/**
 * @desc function to render pages with data
 */

module.exports = {
  render: (res, page, message) => {
    res.render(page, message);
  }
}

// const userInSession = require("../../utils/userInSession");
// const render = require("../../utils/renderView");

