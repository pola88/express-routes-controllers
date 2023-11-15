module.exports = {
  options: {
    before: {},
  },
  index(req, res) {
    const parentId = req.params.resources_controller_id;
    res.json({
      msg: `resources_controller/${parentId}/nested_controller/index`,
    });
  },
  create(req, res) {
    const parentId = req.params.resources_controller_id;
    res.json({
      msg: `resources_controller/${parentId}/nested_controller/create`,
    });
  },
  show(req, res) {
    const parentId = req.params.resources_controller_id;
    const id = req.params.nested_controller_id;
    res.json({
      msg: `resources_controller/${parentId}/nested_controller/show_${id}`,
    });
  },
  destroy(req, res) {
    const parentId = req.params.resources_controller_id;
    const id = req.params.nested_controller_id;
    res.json({
      msg: `resources_controller/${parentId}/nested_controller/destroy_${id}`,
    });
  },
  update(req, res) {
    const parentId = req.params.resources_controller_id;
    const id = req.params.nested_controller_id;
    res.json({
      msg: `resources_controller/${parentId}/nested_controller/update_${id}`,
    });
  },
  collection_action(req, res) {
    const parentId = req.params.resources_controller_id;
    res.json({
      msg: `resources_controller/${parentId}/nested_controller/collection_action`,
    });
  },
  member_action(req, res) {
    const parentId = req.params.resources_controller_id;
    const id = req.params.nested_controller_id;

    res.json({
      msg: `resources_controller/${parentId}/nested_controller/member_action_${id}`,
    });
  },
};
