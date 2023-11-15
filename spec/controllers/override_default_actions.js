module.exports = {
  options: {
    before: {},
  },
  create(req, res) {
    res.json({
      msg: `override_default_actions/create_${req.params.override_default_action_id}`,
    });
  },
  update(req, res) {
    res.json({ msg: 'override_default_actions/update' });
  },
};
