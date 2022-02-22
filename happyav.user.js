// ==UserScript==
// @name         HappyAV
// @namespace    rickenbacker620.github.io
// @version      2.0.1
// @description  javlib tools
// @author       rickenbacker620
// @updateURL    https://github.com/Rickenbacker620/UserScripts/raw/master/happyav.user.js
// @downloadURL    https://github.com/Rickenbacker620/UserScripts/raw/master/happyav.user.js
// @match        https://jable.tv/videos/*
// @match        https://avgle.com/video/*
// @match        https://www.javlibrary.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA7lJREFUWEfFl09oHFUcx7+/N7P//2eXTalFrUVKjaFKymZnFuzBZBUqeqiEngQPpQcV7MGToO25aoOF4smLXiStiDKzUgvFQxLaoCcRL02y2R568LTuZmdn9r0nM2VLtu6/ZDfmXRZ25v2+n/f7935DOOBFB6yPsQDIe/O3AVQo98u7uz3QyADy91dfQIstI0BH6OSt+v8PsDb3KSROUO72OVm5GEJNznoQwvcXTV15OAhodA/cm/8OUixiYroISR8BiDwWJZQg8SOc5rc0db3WDWYcAHUkX1wBMNfztFwepROLm2MHcD4u6urC4ZsIpQ71FFfoDB37wuz1fGgPPCwWs6qivE7AywS8xDmf4YlGLDKrgleS26G5bFWd9CksovrhowRIXgKUJXr+8z/75cFAgPVTp47HJyeLJOWHAJ5rGxOtFqx6HUSEQDgMpqo7ddYl0WLGMK6NlIRlXf8mmkweBVAYZKjH82VIuZgulW7sOgRlXb8VTSbn9yjcsY2I3pswjOtDJ2F5dvaHYDT6lhoIjEPfsyGJ5jOG4XbMTrgn/9jK5y8yRbkcSiRiY1N3AYD7KlExaRjrO+3+Jwk3crlqIBKJBUKhcep7tojInDCMMz0BKrp+1m42b8RSKSh+/9gBHsVCTqVLpcel2eGBSqHwpW1ZHyQyGZCi7A8A0ULaMJbaxjsANjTtV2HbrySyWa++92ldSpvm5a4AZU2rtGz7SDyTAdsvDwBLadNc6A6Qzz9oOc5T0VQK6n7lQD+ATV1f5c1m3m2todhYq3BnNHuHYEvTvnJs+wJjDLF0GsTYyGnQsm3Pm+1f9EvCB6dPa81azb3bEYxEEIxG9wzAOYeiKBCce/lkNxrwu72lXxm6apVCoWxb1tPupnAiAdXn2xNEo1qFPxyGbVlwPeqGVQI/ZUzzzf6dUNNeE7b9s9e5GEMkHscod8J2teoBBKPR3zjwRtY0O+bErsW+mctd45y/3yYNx+OP3LeLZdVqbu/1Qgkp/25a1oXDd+58P/Ayar+wVShcdSzLHUK85RryhUJeXPstN9bKjrC1ms1tx7ZvPrO6+k63fX3bXUXXzzuOc1UK4U26bnf0B4OegJsbT0xBnn03+SAlWo4Dq1ZrMMY+e/bu3U96QQ/st/dnZqZ9qnqlJcScFKLz+ERefL1ylRJCCEghPC1FVZfrQrw9tbbW99tgIECbvKJp02DsPKQ8yTk/LqVMSCG8iYUYa0LKf5iqbrjCKudfH1pZ+WOYlBkaYBhje3nnwAH+BdYqSTDnPaACAAAAAElFTkSuQmCC
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  let curSite;
  let curButton;

  function getElement(parent, selector, timeout = 0) {
    return new Promise((resolve) => {
      let result = parent.querySelector(selector);
      if (result) return resolve(result);
      let timer;
      const mutationObserver = window.MutationObserver;
      const observer = new mutationObserver((mutations) => {
        for (let mutation of mutations) {
          for (let addedNode of mutation.addedNodes) {
            if (addedNode instanceof Element) {
              result = addedNode.matches(selector)
                ? addedNode
                : addedNode.querySelector(selector);
              if (result) {
                observer.disconnect();
                timer && clearTimeout(timer);
                return resolve(result);
              }
            }
          }
        }
      });
      observer.observe(parent, {
        childList: true,
        subtree: true,
      });
      if (timeout > 0) {
        timer = setTimeout(() => {
          observer.disconnect();
          return resolve(null);
        }, timeout);
      }
    });
  }

  GM_addStyle(`
    .add-button {
      background-color: #ff7875;
      border: 0;
      cursor: pointer;
      border-radius: 100px;
      font-weight: bold;
      color: #ffffff;
      font-size: 13px;
      padding: 8px 16px;
      z-index: 999;
    }

    .add-button:hover {
      background-color: #f5222d;
      color: #ffffff;
    }
    .add-button:disabled {
      background-color: #434343;
      color: #ffffff;
      cursor: default;
    }
  `);

  function createAppendButtonFunction(appendChildFunction) {
    return function (javId) {
      const button = document.createElement("button");
      if (javId) {
        button.innerText = "添加 " + javId;
      } else {
        button.innerHTML = "未识别到番号";
        button.disabled = true;
      }
      button.className = "add-button";
      button.onclick = () => {
        button.innerText = "添加中...";
        button.disabled = true;
        addToWanted(javId);
      };
      appendChildFunction(button);
      curButton = button;
    };
  }

  function defaultExecute() {
    const javId = this.extractId();
    this.appendButton(javId);
  }

  const sites = [
    {
      name: "jable",
      regex: /jable\.tv\/videos/,
      extractId: function () {
        return location.href.split("/")[4];
      },
      appendButton: createAppendButtonFunction((button) =>
        document.querySelector(".my-3").appendChild(button)
      ),
      execute: defaultExecute,
      videoLink: (id) => "https://jable.tv/videos/" + id + "/",
      favicon: "https://assetscdn.jable.tv/assets/icon/favicon-32x32.png",
    },
    {
      name: "avgle",
      regex: /avgle\.com\/video/,
      extractId: function () {
        const reg = /\b[A-Z, a-z]{3,6}-[0-9]{3,4}\b/;
        const match = reg.exec(location.href);
        if (match) return match[0];
      },
      appendButton: createAppendButtonFunction((button) => {
        const parent = document.querySelector(
          ".hidden-xs.big-title-truncate.m-t-0"
        );
        parent.replaceChild(button, parent.firstChild);
      }),
      execute: defaultExecute,
      videoLink: (id) => "https://avgle.com/search/videos?search_query=" + id,
      favicon:
        "https://avgle.com/templates/frontend/bright-blue/img/webapp-icon.png",
    },
    {
      name: "javlibrary",
      regex: /javlibrary\.com/,
      execute: function () {
        if (location.href.includes("/?v=jav")) {
          const javId = document.querySelector("#video_id td.text").innerHTML;
          const infoPanel = document.querySelector("#video_info");
          const div = document.createElement("div");
          div.style.display = "inline-flex";
          div.style.margin = "10px 20px";
          div.style.gap = "10px";
          for (const site of sites) {
            if (site.videoLink) {
              const image = document.createElement("img");
              image.src = site.favicon;
              image.width = 32;
              image.height = 32;

              const link = document.createElement("a");
              link.href = site.videoLink(javId);
              link.target = "_blank";

              link.appendChild(image);
              div.appendChild(link);
            }
          }
          infoPanel.appendChild(div);
        } else {
          getElement(document, ".videos").then((_) =>
            document
              .querySelectorAll(".video>a")
              .forEach((e) => (e.target = "_blank"))
          );
        }
      },
    },
  ];

  for (const site of sites) {
    console.log(location.href);
    if (site.regex.test(location.href)) {
      console.log(site);
      curSite = site;
      break;
    }
  }

  function sendWantedAjax(javlibId) {
    const originText = curButton.innerText;
    if (javlibId === undefined) {
      console.error("javlib id not found");
    } else {
      GM_xmlhttpRequest({
        url: `https://www.javlibrary.com/ajax/ajax_vl_favoriteadd.php`,
        data: `id=${javlibId}&type=3`,
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },

        onload: function (response) {
          const result = JSON.parse(response.responseText);
          if (result.ERROR === 2 && result.ID != "") {
            curButton.innerText = "添加成功";
          } else {
            curButton.innerText = "添加失败,请重试";
            setTimeout(() => {
              curButton.innerText = originText;
              curButton.disabled = false;
            }, 1000);
          }
        },
      });
    }
  }

  function addToWanted(avId) {
    GM_xmlhttpRequest({
      url: `https://www.javlibrary.com/cn/vl_searchbyid.php?keyword=${avId}`,
      method: "GET",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      onload: function (response) {
        const noResult = response.responseText.includes("搜寻没有结果");
        // const cloudFlare = response.responseText.includes()

        let javlibId;

        if (noResult) {
          javlibId = undefined;
        } else if (response.finalUrl.includes("vl_searchbyid")) {
          const parser = new DOMParser();
          const htmlDoc = parser.parseFromString(
            this.responseText,
            "text/html"
          );
          const videos = [...htmlDoc.querySelector(".videos").children];
          const video = videos.reduce((a, b) =>
            a.innerText < b.innerText ? a : b
          );
          javlibId = video.id.substring(4);
        } else {
          javlibId = response.finalUrl.split("?v=")[1];
        }

        sendWantedAjax(javlibId);
      },
    });
  }

  curSite.execute();
})();
