// ==UserScript==
// @name         HappyAV
// @namespace    rickenbacker620.github.io
// @version      2.1.4
// @description  javlib tools
// @author       rickenbacker620
// @updateURL    https://github.com/Rickenbacker620/UserScripts/raw/master/happyav.user.js
// @downloadURL  https://github.com/Rickenbacker620/UserScripts/raw/master/happyav.user.js
// @match        https://jable.tv/videos*
// @match        https://avgle.com/video*
// @match        https://javtrust.com/movie/watch*
// @match        https://javdb.com*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA7lJREFUWEfFl09oHFUcx7+/N7P//2eXTalFrUVKjaFKymZnFuzBZBUqeqiEngQPpQcV7MGToO25aoOF4smLXiStiDKzUgvFQxLaoCcRL02y2R568LTuZmdn9r0nM2VLtu6/ZDfmXRZ25v2+n/f7935DOOBFB6yPsQDIe/O3AVQo98u7uz3QyADy91dfQIstI0BH6OSt+v8PsDb3KSROUO72OVm5GEJNznoQwvcXTV15OAhodA/cm/8OUixiYroISR8BiDwWJZQg8SOc5rc0db3WDWYcAHUkX1wBMNfztFwepROLm2MHcD4u6urC4ZsIpQ71FFfoDB37wuz1fGgPPCwWs6qivE7AywS8xDmf4YlGLDKrgleS26G5bFWd9CksovrhowRIXgKUJXr+8z/75cFAgPVTp47HJyeLJOWHAJ5rGxOtFqx6HUSEQDgMpqo7ddYl0WLGMK6NlIRlXf8mmkweBVAYZKjH82VIuZgulW7sOgRlXb8VTSbn9yjcsY2I3pswjOtDJ2F5dvaHYDT6lhoIjEPfsyGJ5jOG4XbMTrgn/9jK5y8yRbkcSiRiY1N3AYD7KlExaRjrO+3+Jwk3crlqIBKJBUKhcep7tojInDCMMz0BKrp+1m42b8RSKSh+/9gBHsVCTqVLpcel2eGBSqHwpW1ZHyQyGZCi7A8A0ULaMJbaxjsANjTtV2HbrySyWa++92ldSpvm5a4AZU2rtGz7SDyTAdsvDwBLadNc6A6Qzz9oOc5T0VQK6n7lQD+ATV1f5c1m3m2todhYq3BnNHuHYEvTvnJs+wJjDLF0GsTYyGnQsm3Pm+1f9EvCB6dPa81azb3bEYxEEIxG9wzAOYeiKBCce/lkNxrwu72lXxm6apVCoWxb1tPupnAiAdXn2xNEo1qFPxyGbVlwPeqGVQI/ZUzzzf6dUNNeE7b9s9e5GEMkHscod8J2teoBBKPR3zjwRtY0O+bErsW+mctd45y/3yYNx+OP3LeLZdVqbu/1Qgkp/25a1oXDd+58P/Ayar+wVShcdSzLHUK85RryhUJeXPstN9bKjrC1ms1tx7ZvPrO6+k63fX3bXUXXzzuOc1UK4U26bnf0B4OegJsbT0xBnn03+SAlWo4Dq1ZrMMY+e/bu3U96QQ/st/dnZqZ9qnqlJcScFKLz+ERefL1ylRJCCEghPC1FVZfrQrw9tbbW99tgIECbvKJp02DsPKQ8yTk/LqVMSCG8iYUYa0LKf5iqbrjCKudfH1pZ+WOYlBkaYBhje3nnwAH+BdYqSTDnPaACAAAAAElFTkSuQmCC
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

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

  let curSite;
  let curButton;
  const parser = new DOMParser();

  function appendFavStarButtons() {
    const actorLinks = document.querySelectorAll("span>a[href^='/actors/']");
    actorLinks.forEach((actor) => {
      const favButton = document.createElement("span");
      favButton.innerText = " ❤ ";
      favButton.style.cursor = "pointer";
      const starId = actor.href.slice(25);
      favButton.onclick = () => addStarToFav(`https://javdb.com/actors/${starId}/collect`);
      actor.nextElementSibling.appendChild(favButton);
    });
  }

  function appendVideoSourceButtons(sites) {
    const javId = document.querySelector(".panel-block.first-block span").innerText;
    const infoPanel = document.querySelector("[href='#magnet-links']").parentElement;

    infoPanel.style.gap = "10px";
    infoPanel.style.display = "flex";

    const childrens = sites
      .filter((site) => site.videoLink)
      .map((site) => {
        const image = document.createElement("img");
        image.src = site.favicon;
        image.width = 32;
        image.height = 32;

        const link = document.createElement("a");
        link.href = site.videoLink(javId);
        link.target = "_blank";

        link.appendChild(image);
        return link;
      });

    infoPanel.replaceChildren(...childrens);
  }

  function javDBGetDetailPage(javDBId) {
    GM_xmlhttpRequest({
      url: `https://javdb.com/v/${javDBId}`,
      method: "GET",
      onload: function (response) {
        const htmlDoc = parser.parseFromString(response.responseText, "text/html");
        const authToken = htmlDoc.querySelector("[name='authenticity_token']").value;
        const csrfToken = htmlDoc.querySelector("meta[name='csrf-token']").content;
        const postUrl = `https://javdb.com/v/${javDBId}/reviews/want_to_watch`;
        javDBSendWantedAjax(postUrl, csrfToken, authToken);
      },
    });
  }

  function javDBSendWantedAjax(postUrl, csrfToken, authToken) {
    GM_xmlhttpRequest({
      url: postUrl,
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "x-csrf-token": csrfToken,
      },
      data: `authenticity_token=${encodeURIComponent(authToken)}`,
      onload: function (response) {
        if (response.responseText === "window.location.href='/login';") {
          curButton.innerText = "添加失败,请重试";
          setTimeout(() => {
            curButton.innerText = originText;
            curButton.disabled = false;
          }, 1000);
        } else {
          curButton.innerText = "添加成功";
        }
      },
    });
  }

  function addToWant(avId) {
    GM_xmlhttpRequest({
      url: `https://javdb.com/search?q=${avId}`,
      method: "GET",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      onload: function (response) {
        const htmlDoc = parser.parseFromString(response.responseText, "text/html");
        const linkNode = htmlDoc.querySelector("#videos>.columns>.column>a");
        if (linkNode != null && avId === linkNode.querySelector(".uid").innerHTML) {
          const javDBId = linkNode.href.split("/")[4];
          javDBGetDetailPage(javDBId);
        } else {
          console.error(`${avId} not found`);
          curButton.innerText = "未找到";
        }
      },
    });
  }

  function addStarToFav(detailLink) {
    const authToken = document.querySelector("[name='authenticity_token']").value;
    const csrfToken = document.querySelector("meta[name='csrf-token']").content;
    GM_xmlhttpRequest({
      url: detailLink,
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "x-csrf-token": csrfToken,
      },
      data: `authenticity_token=${encodeURIComponent(authToken)}`,
      onload: function (response) {
        if (response.status === 200) {
          alert("添加成功");
        } else {
          alert("添加失败");
        }
      },
    });
  }

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
        addToWant(javId);
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
      appendButton: createAppendButtonFunction((button) => document.querySelector(".my-3").appendChild(button)),
      execute: defaultExecute,
      videoLink: (id) => `https://jable.tv/videos/${id}/`,
      favicon: "https://assetscdn.jable.tv/assets/icon/favicon-32x32.png",
    },
    {
      name: "avgle",
      regex: /avgle\.com\/video/,
      extractId: function () {
        const reg = /\b[A-Z, a-z]{2,6}-[0-9]{3,4}\b/;
        const match = reg.exec(location.href);
        if (match) return match[0];
      },
      appendButton: createAppendButtonFunction((button) => {
        const parent = document.querySelector(".hidden-xs.big-title-truncate.m-t-0");
        parent.replaceChild(button, parent.firstChild);
      }),
      execute: defaultExecute,
      videoLink: (id) => `https://avgle.com/search/videos?search_query=${id}`,
      favicon: "https://avgle.com/templates/frontend/bright-blue/img/webapp-icon.png",
    },
    {
      name: "javtrust",
      regex: /javtrust\.com\/movie/,
      extractId: function () {
        const reg = /\b[A-Z, a-z]{2,6}-[0-9]{3,4}\b/;
        const match = reg.exec(location.href);
        if (match) return match[0];
      },
      appendButton: createAppendButtonFunction((button) => {
        const parent = document.querySelector(".media");
        parent.appendChild(button, parent);
      }),
      execute: defaultExecute,
      videoLink: (id) => `https://javtrust.com/search/movie/${id}.html`,
      favicon: "https://javtrust.com/favicon-32x32.png",
    },
    {
      name: "javdb",
      regex: /javdb\.com/,
      execute: function () {
        if (location.href.includes("com/v/")) {
          appendVideoSourceButtons(sites);
          appendFavStarButtons();
        } else {
          document.querySelectorAll("a[href^='/v/']").forEach((video) => (video.target = "_blank"));
        }
      },
    },
  ];

  for (const site of sites) {
    if (site.regex.test(location.href)) {
      curSite = site;
      break;
    }
  }

  curSite.execute();
})();
