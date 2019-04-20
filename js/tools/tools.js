const createUniqueList = (array) => Array.from(new Set(array));

const sortByOldest = (data) => {
  let dataSort = [...data].sort(function compareAge(item1, item2) {
    const date1 = new Date(item1.updated_at);
    const date2 = new Date(item2.updated_at);
    return date1 - date2;
  });
  return dataSort;
};

const sortByNewest = (data) => {
  let dataSort = [...data].sort(function compareAge(item1, item2) {
    const date1 = new Date(item1.updated_at);
    const date2 = new Date(item2.updated_at);
    return date2 - date1;
  });
  return dataSort;
};

const searchActiveEl = (wrapper) => {
  return wrapper.querySelector(".active");
}

const removePreloader = (className) => {
  document.querySelector(`.${className}`).style.backgroundImage = "none";
}

export {createUniqueList, sortByNewest, sortByOldest, searchActiveEl, removePreloader};
