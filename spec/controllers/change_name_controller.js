export const options = {
  before: {},
};
export function index(req, res) {
  res.json({ msg: 'custom_name/index' });
}
export function create(req, res) {
  res.json({ msg: 'custom_name/create' });
}
export function show(req, res) {
  res.json({ msg: 'custom_name/show' });
}
export function destroy(req, res) {
  res.json({ msg: 'custom_name/destroy' });
}
export function update(req, res) {
  res.json({ msg: 'custom_name/update' });
}
