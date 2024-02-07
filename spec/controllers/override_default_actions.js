export const options = {
  before: {},
};
export function create(req, res) {
  res.json({
    msg: `override_default_actions/create_${req.params.override_default_action_id}`,
  });
}
export function update(req, res) {
  res.json({ msg: 'override_default_actions/update' });
}
