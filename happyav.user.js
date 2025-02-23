// ==UserScript==
// @name         HappyAV
// @namespace    rickenbacker620.github.io
// @version      2.2.6
// @description  javdb tools
// @author       rickenbacker620
// @updateURL    https://github.com/Rickenbacker620/UserScripts/raw/master/happyav.user.js
// @downloadURL  https://github.com/Rickenbacker620/UserScripts/raw/master/happyav.user.js
// @match        https://jable.tv/videos/*
// @match        https://avgle.com/video/*
// @match        https://javfinder*
// @match        https://javdb.com/*
// @match        https://javopen.co/*
// @match        https://missav.ws/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA7lJREFUWEfFl09oHFUcx7+/N7P//2eXTalFrUVKjaFKymZnFuzBZBUqeqiEngQPpQcV7MGToO25aoOF4smLXiStiDKzUgvFQxLaoCcRL02y2R568LTuZmdn9r0nM2VLtu6/ZDfmXRZ25v2+n/f7935DOOBFB6yPsQDIe/O3AVQo98u7uz3QyADy91dfQIstI0BH6OSt+v8PsDb3KSROUO72OVm5GEJNznoQwvcXTV15OAhodA/cm/8OUixiYroISR8BiDwWJZQg8SOc5rc0db3WDWYcAHUkX1wBMNfztFwepROLm2MHcD4u6urC4ZsIpQ71FFfoDB37wuz1fGgPPCwWs6qivE7AywS8xDmf4YlGLDKrgleS26G5bFWd9CksovrhowRIXgKUJXr+8z/75cFAgPVTp47HJyeLJOWHAJ5rGxOtFqx6HUSEQDgMpqo7ddYl0WLGMK6NlIRlXf8mmkweBVAYZKjH82VIuZgulW7sOgRlXb8VTSbn9yjcsY2I3pswjOtDJ2F5dvaHYDT6lhoIjEPfsyGJ5jOG4XbMTrgn/9jK5y8yRbkcSiRiY1N3AYD7KlExaRjrO+3+Jwk3crlqIBKJBUKhcep7tojInDCMMz0BKrp+1m42b8RSKSh+/9gBHsVCTqVLpcel2eGBSqHwpW1ZHyQyGZCi7A8A0ULaMJbaxjsANjTtV2HbrySyWa++92ldSpvm5a4AZU2rtGz7SDyTAdsvDwBLadNc6A6Qzz9oOc5T0VQK6n7lQD+ATV1f5c1m3m2todhYq3BnNHuHYEvTvnJs+wJjDLF0GsTYyGnQsm3Pm+1f9EvCB6dPa81azb3bEYxEEIxG9wzAOYeiKBCce/lkNxrwu72lXxm6apVCoWxb1tPupnAiAdXn2xNEo1qFPxyGbVlwPeqGVQI/ZUzzzf6dUNNeE7b9s9e5GEMkHscod8J2teoBBKPR3zjwRtY0O+bErsW+mctd45y/3yYNx+OP3LeLZdVqbu/1Qgkp/25a1oXDd+58P/Ayar+wVShcdSzLHUK85RryhUJeXPstN9bKjrC1ms1tx7ZvPrO6+k63fX3bXUXXzzuOc1UK4U26bnf0B4OegJsbT0xBnn03+SAlWo4Dq1ZrMMY+e/bu3U96QQ/st/dnZqZ9qnqlJcScFKLz+ERefL1ylRJCCEghPC1FVZfrQrw9tbbW99tgIECbvKJp02DsPKQ8yTk/LqVMSCG8iYUYa0LKf5iqbrjCKudfH1pZ+WOYlBkaYBhje3nnwAH+BdYqSTDnPaACAAAAAElFTkSuQmCC
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`
    #add-button {
      position: fixed;
      bottom: 100px;
      right: 20px;
      background-color: #ff7875 !important;
      border: 0;
      cursor: pointer;
      border-radius: 100px;
      font-weight: bold;
      color: #ffffff;
      font-size: 16px;
      padding: 10px 18px;
      z-index: 999;
    }

    #add-button:hover {
      background-color: #f5222d !important;
      color: #ffffff;
    }
    #add-button:disabled {
      background-color: #434343 !important;
      color: #ffffff;
      cursor: default;
    }
  `);

  const jableIcon =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABPklEQVR4nO2XvUoDQRSFv3t3AwElAX8gCSxWgmDlO/gIllaWamelEFgIbGkXn8BXsLYQG0tRwUaQhCSNKbYwRM1eiwhRYrOY7GDIqe7MwD0fZ2B+xMJQk0bhRI19gzIZSKCdCGcaxJFPs3gsZjXLwvlLBmUxakmjgNogOczQ+4fEOFBESq4AgJI6NAdgDuBPpEt5CcLdYd3uQnieMYCA+B4ApulCdb4Fc4A5wCwCpLtXZzEBFwB/eM1MBkDFMcBKcVS/fUwRIOeNz3mKbG+Nxq2XVC3T3YZHOzAYQKsLvT4s5JHNNVj9lsD1wxQBch6yXoGN4Ndlu7iBx+YUAa7usP47VJaRxfzQNH6FpzZc3sL9c6p2AJLsnWb5JRjTjBxE/xvArOPO3jpqKnVX9iJSVw3iyIQqZJpER4QqQRx9AvNFUUskHlhHAAAAAElFTkSuQmCC";
  const javopenIcon =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAIVBMVEX/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AACVGHadAAAACnRSTlP46LLSjWQ/HQgA46mwFwAAAUlJREFUeJxlkj9PwkAYxg+SxqSTMQGSTogSm44OmnTCwUSZqkgAJ/8MpiNETFixDPcBuN5tvQrL8yl97w5sIu/QXH+5973nnueYopLz0zA7GXGzZubzGCBcQnf5DqxiIMwAPXZAtKHPU0Hb6qkFL6iPTOO8Dc8AERQjJb8+uFr5OiWwxIbLp07nlss+QgIJ7tS7DxRXKvM9ztaxx2ewdaESPWFLhDJyoOT0w6a4Fz4KA4rJGi32rBffQKNnyHUeb1lU0li0SB1IRlSyeJP3gaaak/5ykWgWeCIyQL4RSJOCwROxAUoO8DN5RQXUzLdg36I+fdeyHyp6u6Hu2GZ+sz/WCWsOnLBgy6YNTtJrvpUuH47Yaqyqy6n1mCzM/64vubEwjyqDygWB7L+FByYfxGCD6g6HVVA2SsaqKG3YVFXY9BzOjmuX7jn8AgP/9JEhYeC5AAAAAElFTkSuQmCC";
  const missavIcon =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEG0lEQVR4nM2XX4hVVRTGf2vvfc69o3N1nHKURqYHKSNSROrByIcIxoh6KFMpEkmLIPAhIRBGGAQFX3wSwqhJIuihhyiaIuclSNJSkRinQiKkHFOvNjbO33vO2Xv1cB1ncO7MvTPdsPV02Gef7/v2t/daZ22hxri0rbOtEOfbo+DajehqkOUWsxjAEwZBrwSVc6nJeoaS8Z7Wj/b9UQuuVJtwdfv+tQWXezNS85wzdjkIqAKKqpZBRMpQIoCSBX8llfDFUFZ6Z9mHe3+cl4Del/csWZlv7ohxbzgXN+IzVEMti0LEgHVkWTKckL372/jAgTUfH7xRs4ChnQfWxOS6Ypt/dC7EMwlJ/PiZhNLOQldHb1UBV3bsW38PjZ84G69Qn86LeBqJjch80v8Xw1uWf9B5ckYBAzsPrGnU3FeRjVvVZ3UhnxThSH1yaVhKzzRPccJMPFzY3tm0QOOjkc3VnRxAfUZkc60LND56YXtn0zQBLdKwN+ca1tXL9soiUnKuYV2LNOydGBMoW7+IhhMWs3DWAxcCKBAUrAFTNYunhYjBE0ZuMvZ4c1dHrwHIBbvL2nh2ch/QFfeibz1P2LqBsKgBkuxWTag9VAPWxgtzwe4CkEvbOtuWusLpyLiWWQUkGenWJ4ifXQ9AKP6Ndn+PnPgFSTxEtmYRIoY0ZMVr2dBjpmDz7ZGtQj6h3k5ablqasDueRne/gF91H6QefG31QjUQWddSsPl2Fxm7sYaKfOvL6UP24fvRB1sJx/ug+xSmOFh2Q6phCpGxGx0qq+e6j9OgnMM+uZawdiX+y1OYb/uQ8QQiN8tiFFRWGyMsq7i0eYRZUsC+8hT69ib8I23lbJlZAUZYZixmsf5LB6aGAPaBFZjdm/APtULmK9OrYjGLTcW39RBiLZjq8M4TBq24pnq64C9chs9PYn++CK5yeooIXv2gC8pVRJrqcQ7C4Ajh69OYb3qR0dLshxAhKFcdoucQWfVv+NUHwnd9aPcp7OUb5TSclZxymoqec2nwx/JGX6yJqUJq+1/74bOTmL7fy6BxFeJJ2aTBH3NDfrwnL1GxaikGxE/aFAZuot0/IMd/Qkpp9RVPxRFD6rPikB/vEYCRVw++tyBqfE2zZOavfEDblqJbNsCfA3DsDKZ4s8aqd4cAFzOaDr+/8Oie1x1AyfjDOZ+8ZGWW37E1yMVrcOhTJOgc7Z5CLgbvk5GS8YfhVkPS3NXRW/LJEWwVQGMQY8qpZedZQqyj5JMjE23ZbZSiju0vZWNnxUbzA64hxEaUsrGzRR3bf3ts6oS72pRCeSsGGNmc+bS/nk6U2/K0f4CRzc133A3u+sWk4kkqdHX0nh+73j6ajR7KNAyLi8tgcyAWF5NpGB7NRg+dH7veXokc/s+X0zvjv7qe/wNzrAqpXVdKJAAAAABJRU5ErkJggg==";
  const googleIcon =
    "data:image/png;base64,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";
  const javfinderIcon =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAACN1BMVEUAAAD1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCH1gCD1fh71fh31fx/2hiz4pWL5snn4oVv1hCj1fyD2kD3807L/+/j/////+fX7y6T2ijL4qGb6uof5r3L2iTH1gCL7x576vYz5toD/+/f//v77yaH2kT7+7N783ML1hCn2iTD95dH+8un4p2X+7uL94Mj1hiv95dL+9Ov3m0/70rD7yJ75uIP7zKb1giT3m1D959T///7838j3lET1hSn5r3P7y6P5uIT2kkH6vo36uoX2jjn3mEz7z6z7zqn7zqr7z6v7z6r70K35sXb1gSP5t4H94sz5sHX4oFn5t4L+8ef81rf+8eb+7d/6v5D807P7x535tHv83MP1gyf2kT/5tH36uob6uYX3nlZ1JMd0AAAAY3RSTlMAABdWgq/U5ufYtYheHgEkdMb2+dB/Lg5m33UVIJ76/bEtKLnMOC8MnGP+fiHPMm+OE7/TIk/zbXymo8LH48jkpMN9UtVxj9LhNWSBDaK6I77RMyw9p/wx1uAlgIowW7fXu6Eqj85DAAAB8UlEQVR4nGNggAJGRiZmFlY2dg5OLm4eXj5GBlTAyMgvICiUDAXCIqJiqEoYxSXYklGApJQ0kgpGGVm5ZDQgr6DICFPCqKSMLg0CKqpQFYwyWOWBKtTAChjVNZAEU1LTUlNgHC6QOxgZNYUR8ukZmVnZOblQnpY20BJGHV241tz0vPyCwqLiEpgKST2gAn2IfE5pWXlFZVUhCFSnw0w0YGQwNIIoqKktrKtvaAQraGqGKTA2YTA1AzFyW1qBEm3tHWAFnV0wd8qZM1iAGbkV3UCJnt4+sIJ+hKstGayg3ptQUFg3cdLkKYWFU6dNh7sh2ZrBBmJC7oyZs2aXpOTOmVs8b356LlyBLQMn2PsLihcuWrxoycKFi4HU0mXLV6SnQUwxgyhIW1mIAla1TF+9JgWiwA6sYC2qgnXrNxQWg42wZ3DApgAEZoEVODI44VdgyeBshk+BnD6DtDUWBVOnQhW48DMwumJRsHHT5g1bQArcgLHJ7w5UsBVVwbbtK+bsAHrTwxOogNFLODl3/s5duxFg1x5g2AEN0PIGpUpGH19gUKeiAGhc+DFBEqV/QDJWEBgETdWMwUbY5EVCYBmDkdE/VBhdOkw5nBGRtxjFzSNQ5SOdpFEzJ2NUtA1S5o2JxZK/meI04oHZPyExSQIp+wMA1RhQl8hI2bcAAAAASUVORK5CYII=";
  const avgleIcon =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFJElEQVR4nO2W329c1RHHPzPn3rtrm5Q0S0KkoIqUiAeQCAVMTYBEwU1SkhaBIFVLiSv60H+AN9SC6J8BqCAESsoDKghoftJaReaHlSoUhBABgVqrkdpgnDZ4vfeeM8PD7jrrrJ04UdOX9khX2nt25nw/c87MnAv/60OWazgzesu3k2YPuPs1AZkU5aWVB9+e/q8AzGy7dTvwXC7hSscRoDT7S4U8sObwO8cvKcCp0eFGhU7mKutbZvPzQyEwa2n/B9XAD7eOj8eLBdDzGVTwYD0sFAeYTQlFdtwYmnderPh5AfwXN+cgY9G9/z+gUJEk8vAlA/jncb1N4TuVtQEECHLm1EpzcHZ+tWtk3SUBEGUsDxqc+WQ57firWQciuVPPpNFs2e7/OMDpncNrQe4pO9HnKgDvKelRc2a7jtEdN8Z893XFcgTnDhfX+VvF3f4Oa88J0Cy5rx50deqcfxBBhd+tOnz0ffC3cm27luYElY1fTH9j8/nEqyPhrjz3CaK/brPZm+Ub+c2LAviWLRkmezrBowitZF8l91cARHxfb/3mKgr+83OJ+4sEQX+lyuWpBZrLNWLyyKIA09nssCrDZaf0ivb2v7n6yORxgFqov9YyO9lNyJY5Lr7zyx3fvXpJgivzjQi3W9muIBKo+N8X3wFkrFDNusXXifZF6fheduBPJ0Q42AHD3KmrXu6JHy+lb5EfhYLcHFQgRpqqvq8P4MS229Y43NstvSDCnNlJy9Lve+3UfW+0M/0hmmPOQz4yMtAX0DGGXPw+Ov1ScxB8nD/GP/cBFB7vqQVd220+7Sjl0JoDR0/02qVmPh7dP+2WZHQnKNd/OZRG+8KfKTaLyrWpp2EHkWflCWwBgO/eHcwZ6218yZ0g7Dt7zdUTE/8W5+XuMTgQEBLSl4xm9hMNHZsMUuWfkar9cFYZnpz+7CYVHekmXyZCZfbJN6v6wb6oAM14rlV5S5JCEloVEGX7P4bvuHY+qD+w1ly+71X7XTIQkd/KNk4BZAtWFN1TqOTNdOb8zeXDL4q5jadGh/uOS0xCXNP8W61mG6KBizOY61CZx4eY5LG2Ub4zK1gdW53kK2lmzvPza3R/TI0ON2rIe0Fk3YLLx0kIuti97ZV6/c4TDG6fUq/afFkGMfJ55tWNso1T8Uh+KOR8L5aQ1SCV/lo+Gn/QVZiPahDZVVNd13fzCUHaoH2PBNfq45XqcxlI2y8myAquRvMdzQO19cDtFjuRGoSgv+lVUAB/HDX8Z75At10BNVWKpZ5MCNODyNQKJHh3xwConLGQpz2hYMCsk3zRj+PlgnzKAGYmNt0A8Y5u8gngeIzGu4iX5/ps8jL43OdDjcENMzekzlyqQGAUk02pPKPkSfbKVk73AVSWfjoYtJhN3darlMkmG2lgiyzjc8t/PXBVSnIsBBopgTuIUBehbgaqkEpOZ7m8cLavzmwfWSXY/WVPV1MBEd+7HHEA2dqccvf90lNT7tD9itMcgEOyufy4D8DMdgXR9bHn2p1LNqNiLy9HfH6YPz+fbL1wgCdwk2cWc9NoPNhb4IUKAgdXHT761wvRz4bSuJu/H/KF8yGHFP2jbGV5ZFEAhKp7rQrtno7L0xciDiCbaCI83dvaBCAHUZ6SW5hdFCBz+WXl9slQCFyWBcz8pUbjW29cKABAGIzPpiYT2SBkdQh1SE0OBIlPLgkOcPKukXVBudvF5yz4K1fsf/dfFwMA4IdWNCjm7kV9RYw6la0oX18q+v8PgK8BV7dHMhLb7EoAAAAASUVORK5CYII=";

  let curSite;
  let curButton;
  const parser = new DOMParser();
  const javRegex = /\b\d{0,3}[a-z,A-Z]{2,6}[-, ]?\d{3,4}\b|\d{6,9}|[a-z,A-Z]\d{4}/;

  function appendVideoSourceButtons(sites) {
    const javId = document.querySelector(".panel-block.first-block span").innerText;
    const infoPanel = document.querySelector(".movie-panel-info").lastElementChild;

    infoPanel.style.gap = "10px";
    infoPanel.style.display = "flex";

    const childrens = sites
      .filter((site) => site.videoLink)
      .map((site) => {
        const image = document.createElement("img");
        image.style.padding = "2px";
        image.src = site.favicon;
        image.width = 32;
        image.height = 32;

        const link = document.createElement("a");
        link.href = site.videoLink(javId);
        link.target = "_blank";
        link.style.display = "flex";

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
            curButton.disabled = false;
            curButton.innerText = "重试";
          }, 1000);
        } else {
          curButton.innerText = "添加成功";
          setTimeout(() => {
            curButton.disabled = false;
            curButton.onclick = null;
          }, 1000);
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
        const linkNode = htmlDoc.querySelector(".movie-list>.item");
        if (linkNode != null && avId.toLowerCase() == linkNode.querySelector(".video-title > strong").innerHTML.toLowerCase()) {
          const javDBId = linkNode.querySelector("a").href.split("/")[4];
          javDBGetDetailPage(javDBId);
        } else {
          console.error(`${avId} not found`);
          curButton.innerText = "未找到";
        }
      },
    });
  }

  function appendButton(javId) {
    const button = document.createElement("button");
    if (javId) {
      button.innerText = "添加 " + javId;
    } else {
      button.innerHTML = "未识别到番号";
      button.disabled = true;
    }
    button.id = "add-button";
    button.onclick = () => {
      button.innerText = "添加中...";
      button.disabled = true;
      addToWant(javId);
    };

    button.onauxclick = (e) => {
      e.preventDefault();
      window.open(`https://javdb.com/search?q=${javId}`, "_blank");
    };

    button.oncontextmenu = (e) => {
      e.preventDefault();
    };
    document.body.appendChild(button);
    curButton = button;
  }

  function defaultExecute() {
    const javId = this.extractId();
    appendButton(javId);
  }

  const sites = [
    {
      name: "javopen",
      regex: /javopen\.co\/video/,
      extractId: function () {
        const title = location.href.split("/")[4];
        const match = javRegex.exec(title);
        if (match) return match[0];
      },
      execute: defaultExecute,
      videoLink: (id) => `https://javopen.co/?s=${id}`,
      favicon: javopenIcon,
    },
    {
      name: "jable",
      regex: /jable\.tv\/videos/,
      extractId: function () {
        return location.href.split("/")[4];
      },
      execute: defaultExecute,
      videoLink: (id) => `https://jable.tv/videos/${id}/`,
      favicon: jableIcon,
    },
    {
      name: "avgle",
      regex: /avgle\.com\/video/,
      extractId: function () {
        const title = document.querySelector(".big-title-truncate").innerText;
        const match = javRegex.exec(title);
        if (match) return match[0];
      },
      execute: defaultExecute,
      videoLink: (id) => `https://avgle.com/search/videos?search_query=${id}`,
      favicon: avgleIcon,
    },
    {
      name: "javfinder",
      regex: /javfinder/,
      extractId: function () {
        const match = javRegex.exec(location.href);
        if (match) return match[0];
      },
      execute: defaultExecute,
      videoLink: (id) => `https://javfinder.li/search/movie/${id}`,
      favicon: javfinderIcon,
    },
    {
      name: "missav",
      regex: /missav\.ws/,
      extractId: function () {
        const match = javRegex.exec(location.href);
        if (match) return match[0];
      },
      execute: defaultExecute,
      videoLink: (id) => `https://missav.ws/cn/${id}`,
      favicon: missavIcon,
    },
    {
      name: "google",
      videoLink: (id) => `https://www.google.com/search?q=${id}`,
      favicon: googleIcon,
    },
    {
      name: "javdb",
      regex: /javdb\.com/,
      execute: function () {
        if (location.href.includes("com/v/")) {
          appendVideoSourceButtons(sites);
        } else {
          document.querySelectorAll("a[href^='/v/']").forEach((video) => (video.target = "_blank"));
        }
      },
    },
  ];

  for (const site of sites) {
    if (site.regex && site.regex.test(location.href)) {
      curSite = site;
      break;
    }
  }

  curSite.execute();
})();
