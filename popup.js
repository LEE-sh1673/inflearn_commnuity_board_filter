// A function to use as callback
function doStuffWithDom(domContent) {
  console.log("I received the following DOM content:\n" + domContent);
}

function getCurrentTabUrl(callback) {
  let queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    const urlRegex = /^https?:\/\/(?:[^./?#]+\.)?inflearn\.com/;
    let tab = tabs[0];
    let url = tab.url;

    if (urlRegex.test(tab.url)) {
      chrome.tabs.sendMessage(
        tab.id,
        { greeting: "hello" },
        function (response) {
          console.log(response.farewell);
        }
      );
      callback(url);
    }
  });
}

function renderURL(statusText) {
  console.log(statusText);
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("#button");

  if (button != null) {
    button.addEventListener("click", () =>
      getCurrentTabUrl((url) => renderURL(url))
    );
  }
});
