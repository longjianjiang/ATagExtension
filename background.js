chrome.runtime.onInstalled.addListener(() => {
  // do nothing.
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    let url = new URL(tab.url);
    let host = url.hostname;

    chrome.storage.sync.get(host, (res) => {
      if (res[host] == true) {
        console.log("do change.");
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: firstOpenATag,
        });
      }
    });
  }
});

function firstOpenATag() {
  var links = document.getElementsByTagName('a');
  for (var i=0, len=links.length; i < len; i++) {
    links[i].target = "_blank";
  }
}
