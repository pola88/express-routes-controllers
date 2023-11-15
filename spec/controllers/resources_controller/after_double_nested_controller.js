module.exports = {
  options: {
    before: {},
  },
  index(req, res) {
    const parentId = req.params.resources_controller_id;
    res.json({
      msg: `resources_controller/${parentId}/after_double_nested_controller/index`,
    });
  },
  create(req, res) {
    const parentId = req.params.resources_controller_id;
    res.json({
      msg: `resources_controller/${parentId}/after_double_nested_controller/create`,
    });
  },
  show(req, res) {
    const parentId = req.params.resources_controller_id;
    const id = req.params.after_double_nested_controller_id;
    res.json({
      msg: `resources_controller/${parentId}/after_double_nested_controller/show_${id}`,
    });
  },
  destroy(req, res) {
    const parentId = req.params.resources_controller_id;
    const id = req.params.after_double_nested_controller_id;
    res.json({
      msg: `resources_controller/${parentId}/after_double_nested_controller/destroy_${id}`,
    });
  },
  update(req, res) {
    const parentId = req.params.resources_controller_id;
    const id = req.params.after_double_nested_controller_id;
    res.json({
      msg: `resources_controller/${parentId}/after_double_nested_controller/update_${id}`,
    });
  },
};
