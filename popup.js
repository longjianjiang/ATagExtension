
let isATagOpenNewTab = document.getElementById("isATagOpenNewTab");
var originalLinkTargets = {};

chrome.tabs.query({active: true, currentWindow: true}, tabs => {
  let url = new URL(tabs[0].url);
  let host = url.hostname;

  chrome.storage.sync.get(host, (res) => {
    console.log(res);
    if (res) {
      isATagOpenNewTab.checked = res[host];
      if (res[host] == true) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: firstOpenATag,
        });
      }
    } else {
      isATagOpenNewTab.checked = false;
    }
  });
});

isATagOpenNewTab.addEventListener('change', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (isATagOpenNewTab.checked) {
    console.log("Checkbox is checked..");

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: openATagExtension,
    });

  } else {
    console.log("Checkbox is not checked..");

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: closeATagExtension,
    });
  }
});

function openATagExtension() {
  let url = new URL(location.href);
  let host = url.hostname;
  var obj = {};
  obj[host] = true;
  chrome.storage.sync.set(obj);

  var links = document.getElementsByTagName('a');
  for (var i=0, len=links.length; i < len; i++) {
    var my_url = new URL(links[i].href);
    if (my_url.hash.length == 0) {
      links[i].target = "_blank";
    }
  }
}

function closeATagExtension() {
  let url = new URL(location.href);
  let host = url.hostname;
  var obj = {};
  obj[host] = false;
  chrome.storage.sync.set(obj);

  var links = document.getElementsByTagName('a');
  for (var i=0, len=links.length; i < len; i++) {
    links[i].target = "_self";
  }
}

function firstOpenATag() {
  var links = document.getElementsByTagName('a');
  for (var i=0, len=links.length; i < len; i++) {
    var my_url = new URL(links[i].href);
    if (my_url.hash.length == 0) {
      links[i].target = "_blank";
    }
  }
}

