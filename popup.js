let queryInfo = {
  active: true,
  currentWindow: true,
};

document.addEventListener("DOMContentLoaded", () => {
  const like_btn = document.querySelector("#sort__like-btn");
  const bookmark_btn = document.querySelector("#sort__bookmark-btn");

  if (like_btn != null) {
    like_btn.addEventListener("click", () =>
      displaySortedPage({ action: "sorting", sortby: "like" })
    );
  }

  if (bookmark_btn != null) {
    bookmark_btn.addEventListener("click", () =>
      displaySortedPage({ action: "sorting", sortby: "bookmark" })
    );
  }
});

function displaySortedPage(action) {
  sendMessageOf(action);
}

function sendMessageOf(action) {
  const urlRegex = /^https?:\/\/(?:[^./?#]+\.)?inflearn\.com/;

  chrome.tabs.query(queryInfo, (tabs) => {
    let tab = tabs[0];

    if (urlRegex.test(tab.url)) {
      chrome.tabs.sendMessage(tab.id, action, (response) => {
        console.log(response.status);
        window.close();
      });
    }
  });
}
