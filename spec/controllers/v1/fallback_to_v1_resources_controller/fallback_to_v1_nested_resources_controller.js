export const options = {
  before: {},
};
export function index(req, res) {
  const parentId = req.params.fallback_to_v1_resources_controller_id;
  res.json({
    msg: `fallback_to_v1_resources_controller/${parentId}/fallback_to_v1_nested_controller/index`,
  });
}
export function create(req, res) {
  const parentId = req.params.fallback_to_v1_resources_controller_id;
  res.json({
    msg: `fallback_to_v1_resources_controller/${parentId}/fallback_to_v1_nested_controller/create`,
  });
}
export function show(req, res) {
  const parentId = req.params.fallback_to_v1_resources_controller_id;
  const id = req.params.fallback_to_v1_nested_controller_id;
  res.json({
    msg: `fallback_to_v1_resources_controller/${parentId}/fallback_to_v1_nested_controller/show_${id}`,
  });
}
export function destroy(req, res) {
  const parentId = req.params.fallback_to_v1_resources_controller_id;
  const id = req.params.fallback_to_v1_nested_controller_id;
  res.json({
    msg: `fallback_to_v1_resources_controller/${parentId}/fallback_to_v1_nested_controller/destroy_${id}`,
  });
}
export function update(req, res) {
  const parentId = req.params.fallback_to_v1_resources_controller_id;
  const id = req.params.fallback_to_v1_nested_controller_id;
  res.json({
    msg: `fallback_to_v1_resources_controller/${parentId}/fallback_to_v1_nested_controller/update_${id}`,
  });
}
export function collection_action(req, res) {
  const parentId = req.params.fallback_to_v1_resources_controller_id;
  res.json({
    msg: `fallback_to_v1_resources_controller/${parentId}/fallback_to_v1_nested_controller/collection_action`,
  });
}
export function member_action(req, res) {
  const parentId = req.params.fallback_to_v1_resources_controller_id;
  const id = req.params.fallback_to_v1_nested_controller_id;

  res.json({
    msg: `fallback_to_v1_resources_controller/${parentId}/fallback_to_v1_nested_controller/member_action_${id}`,
  });
}
