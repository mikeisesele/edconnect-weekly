/**
 * @desc function to render pages with data
 */

module.exports = {
  render: (res, page, message) => {
    res.render(page, message);
  }
}

