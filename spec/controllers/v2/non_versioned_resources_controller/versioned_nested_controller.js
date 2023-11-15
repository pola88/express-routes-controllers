module.exports = {
  options: {
    before: {},
  },
  index(req, res) {
    const parentId = req.params.non_versioned_resources_controller_id;
    res.json({
      msg: `non_versioned_resources_controller/${parentId}/v2/versioned_nested_controller/index`,
    });
  },
  create(req, res) {
    const parentId = req.params.non_versioned_resources_controller_id;
    res.json({
      msg: `non_versioned_resources_controller/${parentId}/v2/versioned_nested_controller/create`,
    });
  },
  show(req, res) {
    const parentId = req.params.non_versioned_resources_controller_id;
    const id = req.params.versioned_nested_controller_id;
    res.json({
      msg: `non_versioned_resources_controller/${parentId}/v2/versioned_nested_controller/show_${id}`,
    });
  },
  destroy(req, res) {
    const parentId = req.params.non_versioned_resources_controller_id;
    const id = req.params.versioned_nested_controller_id;
    res.json({
      msg: `non_versioned_resources_controller/${parentId}/v2/versioned_nested_controller/destroy_${id}`,
    });
  },
  update(req, res) {
    const parentId = req.params.non_versioned_resources_controller_id;
    const id = req.params.versioned_nested_controller_id;
    res.json({
      msg: `non_versioned_resources_controller/${parentId}/v2/versioned_nested_controller/update_${id}`,
    });
  },
  collection_action(req, res) {
    const parentId = req.params.non_versioned_resources_controller_id;
    res.json({
      msg: `non_versioned_resources_controller/${parentId}/v2/versioned_nested_controller/collection_action`,
    });
  },
  member_action(req, res) {
    const parentId = req.params.non_versioned_resources_controller_id;
    const id = req.params.versioned_nested_controller_id;

    res.json({
      msg: `non_versioned_resources_controller/${parentId}/v2/versioned_nested_controller/member_action_${id}`,
    });
  },
};
