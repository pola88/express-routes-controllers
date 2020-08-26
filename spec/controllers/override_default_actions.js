module.exports = {
  options: {
    before: {}
  },
  create: function (req, res) {
    res.json({ msg: 'override_default_actions/create_' + req.params.override_default_action_id });
  },
  update: function (req, res) {
    res.json({ msg: 'override_default_actions/update' });
  },
};
