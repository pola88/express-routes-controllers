export const options = {
  before: {},
};
export function index(req, res) {
  res.json({ msg: 'fallback_to_v1_resources_controller/index' });
}
export function create(req, res) {
  res.json({ msg: 'fallback_to_v1_resources_controller/create' });
}
export function show(req, res) {
  res.json({
    msg: `fallback_to_v1_resources_controller/show_${req.params.fallback_to_v1_resources_controller_id}`,
  });
}
export function destroy(req, res) {
  res.json({
    msg: `fallback_to_v1_resources_controller/destroy_${req.params.fallback_to_v1_resources_controller_id}`,
  });
}
export function update(req, res) {
  res.json({
    msg: `fallback_to_v1_resources_controller/update_${req.params.fallback_to_v1_resources_controller_id}`,
  });
}
export function collection_action(req, res) {
  res.json({ msg: 'fallback_to_v1_resources_controller/collection_action' });
}
export function member_action(req, res) {
  res.json({
    msg: `fallback_to_v1_resources_controller/member_action_${req.params.fallback_to_v1_resources_controller_id}`,
  });
}
