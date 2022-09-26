chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "sorting") {
    execute_sort_action(request.sortby);
  }
  sendResponse({ status: "success" });
});

function execute_sort_action(sortby) {
  display_sorted_items(sortby);
}

function display_sorted_items(criteria) {
  // get question pages from page.
  const question_pages = Array.from(
    document.querySelectorAll("li[data-testid='questionItem']")
  );

  if (question_pages == undefined) return;

  const numberOfQuestions = question_pages.length;
  question_pages.sort(compare_by(criteria));

  display_questionPages_ascOrder(question_pages, numberOfQuestions);
}

function display_questionPages_ascOrder(pages, limits = 10) {
  apply_styles(pages);

  const question_list = document.querySelectorAll(".css-1etna1w ul")[1];
  question_list.append(...pages);

  console.log(
    `%cSorting ${limits} question pages.`,
    "color: #58C079; font-size: 24px; font-weight: bold"
  );
}

function compare_by(criteria) {
  if (criteria === "like") {
    return comparator(
      (p1, p2) => get_likes(get_page_info(p1)) > get_likes(get_page_info(p2))
    );
  } else if (criteria === "bookmark") {
    return comparator(
      (p1, p2) =>
        get_bookmarks(get_page_info(p1)) > get_bookmarks(get_page_info(p2))
    );
  }
}

function comparator(pred) {
  return function (x, y) {
    if (pred(x, y)) return -1;
    else if (pred(y, x)) return 1;
    else return 0;
  };
}

function compare(el1, el2) {
  if (el1 > el2) {
    return 1;
  } else if (el1 < el2) {
    return -1;
  }
  return 0;
}

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

function apply_styles(pages) {
  pages.forEach((page) => {
    page.style.border = "2px dashed #58C079";
    page.firstChild.childNodes[1].style.color = "#58C079";
    page.firstChild.childNodes[1].style.fontWeight = "700";
  });
}
