export const options = {
  before: {},
};
export function index(req, res) {
  const parentId = req.params.resources_controller_id;
  res.json({
    msg: `resources_controller/${parentId}/after_double_nested_controller/index`,
  });
}
export function create(req, res) {
  const parentId = req.params.resources_controller_id;
  res.json({
    msg: `resources_controller/${parentId}/after_double_nested_controller/create`,
  });
}
export function show(req, res) {
  const parentId = req.params.resources_controller_id;
  const id = req.params.after_double_nested_controller_id;
  res.json({
    msg: `resources_controller/${parentId}/after_double_nested_controller/show_${id}`,
  });
}
export function destroy(req, res) {
  const parentId = req.params.resources_controller_id;
  const id = req.params.after_double_nested_controller_id;
  res.json({
    msg: `resources_controller/${parentId}/after_double_nested_controller/destroy_${id}`,
  });
}
export function update(req, res) {
  const parentId = req.params.resources_controller_id;
  const id = req.params.after_double_nested_controller_id;
  res.json({
    msg: `resources_controller/${parentId}/after_double_nested_controller/update_${id}`,
  });
}
