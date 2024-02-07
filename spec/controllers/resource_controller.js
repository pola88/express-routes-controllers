export const options = {
  before: {},
};
export function index(req, res) {
  res.json({ msg: 'resource_controller/index' });
}
export function create(req, res) {
  res.json({ msg: 'resource_controller/create' });
}
export function show(req, res) {
  res.json({ msg: 'resource_controller/show' });
}
export function destroy(req, res) {
  res.json({ msg: 'resource_controller/destroy' });
}
export function update(req, res) {
  res.json({ msg: 'resource_controller/update' });
}
