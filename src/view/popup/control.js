export const createControl = ({classActive, id, content}) => `
  <button type="button" class="film-details__control-button film-details__control-button--watchlist ${classActive}" id=${id} name=${id}>
    ${content}
  </button>`;
