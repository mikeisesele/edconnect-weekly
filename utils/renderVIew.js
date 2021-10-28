/**
 * @desc function to render pages with data
 */
module.exports = (res, page, message) => {
  res.render(page, message);
};
