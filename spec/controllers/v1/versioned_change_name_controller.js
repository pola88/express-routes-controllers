export const options = {
  before: {},
};
export function index(req, res) {
  res.json({ msg: 'v1/versioned_custom_name/index' });
}
export function create(req, res) {
  res.json({ msg: 'v1/versioned_custom_name/create' });
}
export function show(req, res) {
  res.json({ msg: 'v1/versioned_custom_name/show' });
}
export function destroy(req, res) {
  res.json({ msg: 'v1/versioned_custom_name/destroy' });
}
export function update(req, res) {
  res.json({ msg: 'v1/versioned_custom_name/update' });
}
