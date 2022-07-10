// ==UserScript==
// @name         FuckMessage
// @namespace    rickenbacker620.github.io
// @version      0.1
// @description  remove message in html title
// @author       rickenbacker620
// @updateURL    https://github.com/Rickenbacker620/UserScripts/raw/master/fuckmessage.user.js
// @downloadURL  https://github.com/Rickenbacker620/UserScripts/raw/master/fuckmessage.user.js
// @match        https://www.zhihu.com/*
// @match        https://www.csdn.net/*
// @run-at      document-idle
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA7lJREFUWEfFl09oHFUcx7+/N7P//2eXTalFrUVKjaFKymZnFuzBZBUqeqiEngQPpQcV7MGToO25aoOF4smLXiStiDKzUgvFQxLaoCcRL02y2R568LTuZmdn9r0nM2VLtu6/ZDfmXRZ25v2+n/f7935DOOBFB6yPsQDIe/O3AVQo98u7uz3QyADy91dfQIstI0BH6OSt+v8PsDb3KSROUO72OVm5GEJNznoQwvcXTV15OAhodA/cm/8OUixiYroISR8BiDwWJZQg8SOc5rc0db3WDWYcAHUkX1wBMNfztFwepROLm2MHcD4u6urC4ZsIpQ71FFfoDB37wuz1fGgPPCwWs6qivE7AywS8xDmf4YlGLDKrgleS26G5bFWd9CksovrhowRIXgKUJXr+8z/75cFAgPVTp47HJyeLJOWHAJ5rGxOtFqx6HUSEQDgMpqo7ddYl0WLGMK6NlIRlXf8mmkweBVAYZKjH82VIuZgulW7sOgRlXb8VTSbn9yjcsY2I3pswjOtDJ2F5dvaHYDT6lhoIjEPfsyGJ5jOG4XbMTrgn/9jK5y8yRbkcSiRiY1N3AYD7KlExaRjrO+3+Jwk3crlqIBKJBUKhcep7tojInDCMMz0BKrp+1m42b8RSKSh+/9gBHsVCTqVLpcel2eGBSqHwpW1ZHyQyGZCi7A8A0ULaMJbaxjsANjTtV2HbrySyWa++92ldSpvm5a4AZU2rtGz7SDyTAdsvDwBLadNc6A6Qzz9oOc5T0VQK6n7lQD+ATV1f5c1m3m2todhYq3BnNHuHYEvTvnJs+wJjDLF0GsTYyGnQsm3Pm+1f9EvCB6dPa81azb3bEYxEEIxG9wzAOYeiKBCce/lkNxrwu72lXxm6apVCoWxb1tPupnAiAdXn2xNEo1qFPxyGbVlwPeqGVQI/ZUzzzf6dUNNeE7b9s9e5GEMkHscod8J2teoBBKPR3zjwRtY0O+bErsW+mctd45y/3yYNx+OP3LeLZdVqbu/1Qgkp/25a1oXDd+58P/Ayar+wVShcdSzLHUK85RryhUJeXPstN9bKjrC1ms1tx7ZvPrO6+k63fX3bXUXXzzuOc1UK4U26bnf0B4OegJsbT0xBnn03+SAlWo4Dq1ZrMMY+e/bu3U96QQ/st/dnZqZ9qnqlJcScFKLz+ERefL1ylRJCCEghPC1FVZfrQrw9tbbW99tgIECbvKJp02DsPKQ8yTk/LqVMSCG8iYUYa0LKf5iqbrjCKudfH1pZ+WOYlBkaYBhje3nnwAH+BdYqSTDnPaACAAAAAElFTkSuQmCC
// @require      file:\\wsl.localhost\Ubuntu\home\shiro\TestStuff\tryuserscript\fuckmessage.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  const sites = [
    {
      name: "zhihu",
      regex: /zhihu\.com/,
      titleRegex: /\(.*\)/,
    },
    {
      name: "csdn",
      regex: /csdn\.net/,
      titleRegex: /\(.*\)/,
    },
  ];

  function removeMessageIfExists(regex) {
    if (document.title.match(regex)) {
      document.title = document.title.replace(regex, "");
    }
  }

  for (const site of sites) {
    if (site.regex && site.regex.test(location.href)) {
      removeMessageIfExists(site.titleRegex);

      const observer = new MutationObserver(() => removeMessageIfExists(site.titleRegex));

      observer.observe(document.querySelector("title"), {
        childList: true,
      });
    }
  }
})();
