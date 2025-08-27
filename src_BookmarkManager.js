const BOOKMARK_KEY = 'pdf-reader-bookmarks';
const LAST_PAGE_KEY = 'pdf-reader-lastpage';

function getBookmarks(fileName) {
  const store = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '{}');
  return store[fileName] || [];
}

function addBookmark(fileName, pageNum) {
  const store = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '{}');
  if (!store[fileName]) store[fileName] = [];
  if (!store[fileName].includes(pageNum)) store[fileName].push(pageNum);
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(store));
  return store[fileName];
}

function removeBookmark(fileName, pageNum) {
  const store = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '{}');
  if (!store[fileName]) return [];
  store[fileName] = store[fileName].filter(p => p !== pageNum);
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(store));
  return store[fileName];
}

function getLastPage(fileName) {
  const store = JSON.parse(localStorage.getItem(LAST_PAGE_KEY) || '{}');
  return store[fileName] || 1;
}

function saveLastPage(fileName, pageNum) {
  const store = JSON.parse(localStorage.getItem(LAST_PAGE_KEY) || '{}');
  store[fileName] = pageNum;
  localStorage.setItem(LAST_PAGE_KEY, JSON.stringify(store));
}

const BookmarkManager = {
  getBookmarks,
  addBookmark,
  removeBookmark,
  getLastPage,
  saveLastPage
};

export default BookmarkManager;