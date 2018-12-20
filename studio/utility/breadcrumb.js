var breadcrumb = function(req, res, next) {
  req.session.cur_url_path = req.originalUrl;
  var url_name = req.originalUrl.substring(1) + " Home";
  url_name = url_name.charAt(0).toUpperCase() + url_name.slice(1);
  req.session.cur_url_name = url_name;
  next();
};

module.exports = breadcrumb;
