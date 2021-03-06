export default class Store {
  constructor(key, storage) {
    this._key = key;
    this._storage = storage;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._key) || {});
    } catch (err) {
      return {};
    }
  }

  setItems(items) {
    this._storage.setItem(this._key, JSON.stringify(items));
  }

  setItem(key, value) {
    const store = this.getItems();
    this._storage.setItem(this._key, JSON.stringify({ ...store, [key]: value }));
  }

  removeItem(key) {
    const store = this.getItems();
    delete store[key];
    this._storage.setItem(this._key, JSON.stringify(store));
  }
}
