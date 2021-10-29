/**
 * @desc function to render pages with data
 */

exports.render = (res, page, message) => {
  res.render(page, message);
};
