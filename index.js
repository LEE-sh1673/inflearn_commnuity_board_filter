// sort by likes, and bookmarks
function get_page_info(page) {
  return page.lastChild.lastChild.childNodes;
}

function get_likes(info) {
  return +info[0].lastChild.textContent;
}

function get_bookmarks(info) {
  return +info[1].lastChild.textContent;
}

function compare(el1, el2) {
  const el1_info = get_page_info(el1);
  const el2_info = get_page_info(el2);

  const el1_likes = get_likes(el1_info);
  const el2_likes = get_likes(el2_info);

  const el1_bookmarks = get_bookmarks(el1_info);
  const el2_bookmarks = get_bookmarks(el2_info);

  if (el1_likes > el2_likes) {
    return -1;
  } else if (el1_likes < el2_likes) {
    return 1;
  } else {
    if (el1_bookmarks > el2_bookmarks) {
      return -1;
    } else if (el1_bookmarks < el2_bookmarks) {
      return 1;
    } else {
      return 0;
    }
  }
}

function to_nodeList(arr) {
  const fragment = document.createDocumentFragment();
  arr.forEach((item) => {
    fragment.appendChild(item.cloneNode());
  });
  return fragment.childNodes;
}

function apply_styles(pages) {
  pages.forEach((page) => {
    page.style.border = "2px dashed #58C079";
    page.firstChild.childNodes[1].style.color = "#58C079";
    page.firstChild.childNodes[1].style.fontWeight = "700";
  });
}

function get_links(pages, title = "[TOTAL URLS]", limits = 10) {
  const urls = [];
  const reactPropsId = Object.keys(__REACT_DEVTOOLS_GLOBAL_HOOK__.$0)[0].trim();
  const BASE_URL = "https://www.inflearn.com/questions/";

  for (let i = 0; i < Math.min(limits + 1, pages.length); i++) {
    const PAGE_KEY = pages[i][reactPropsId]?.return?.key;
    const DEST_URL = BASE_URL.concat(PAGE_KEY);
    if (PAGE_KEY != undefined) {
      const page_info = get_page_info(pages[i]);
      const likes = get_likes(page_info);
      const bookmarks = get_bookmarks(page_info);
      urls.push(`${DEST_URL} - 좋아요: ${likes},  북마크: ${bookmarks}`);
    }
  }
  return urls.reduce((total, url) => `${total}\n${url}`, title);
}

function download_content(name, content) {
  const atag = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  atag.href = URL.createObjectURL(file);
  atag.download = name;
  atag.click();
}

function display_questionPages_ascOrder(pages, limits = 10) {
  pages.sort((page1, page2) => compare(page1, page2));
  apply_styles(pages);

  const question_list = document.querySelectorAll(".css-1etna1w ul")[1];
  question_list.append(...pages);

  console.log(
    `%cSorting ${limits} question pages.`,
    "color: #58C079; font-size: 24px; font-weight: bold"
  );
}

function download_questionPages_ascOrder(pages, limit) {
  // sorting by ascending order
  pages.sort((page1, page2) => compare(page1, page2));

  // get question url path using react profiler (NEED TO INSTALL CHROME EXTENTION)
  const title = `강의 질문 모음 - ${
    document.querySelector("p.css-mrzke1")?.textContent
  }`;
  const question_urls = get_links(pages, title, limit);
  download_content(`${title}.txt`, question_urls);

  // PRINT SUCCESS MESSAGE.
  console.log(
    `%cSuccess to save file. (${pages.length} url's saved.)`,
    "color: #58C079; font-size: 24px; font-weight: bold"
  );
}

function display_sorted_items() {
  // get question pages from page.
  const question_pages = Array.from(
    document.querySelectorAll("li[data-testid='questionItem']")
  );

  if (question_pages == undefined) return;

  const numberOfQuestions = question_pages.length;

  // display question pages in ascending order
  display_questionPages_ascOrder(question_pages, numberOfQuestions);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting == "hello") {
    display_sorted_items();
    sendResponse({ farewell: "goodbye" });
  }
});
