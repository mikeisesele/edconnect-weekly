/**
 * @desc function to render pages with data
 */
module.exports = function render (res, page, message) {
  res.render(page, message);
};

// export default render;
// module.exports = render