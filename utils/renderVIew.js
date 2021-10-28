/**
 * @desc function to render pages with data
 */
const render  = (res, page, message) => {
  res.render(page, message);
};


module.exports = render