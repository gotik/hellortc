{"version":3,"file":"hellortc.min.js","sources":["src/vendor.js","src/hellortc.js"],"names":["window","RTCPeerConnection","webkitRTCPeerConnection","mozRTCPeerConnection","RTCSessionDescription","mozRTCSessionDescription","URL","webkitURL","navigator","getUserMedia","webkitGetUserMedia","mozGetUserMedia","Hello","options","this","_events","socket","iceServers","url","io","connect","peerConnection","optional","RtpDataChannels","createAnswer","answer","setLocalDescription","emit","onaddstream","event","remote","src","createObjectURL","stream","bind","onicecandidate","candidate","onopen","on","offer","setRemoteDescription","addIceCandidate","RTCIceCandidate","uid","pendingCalls","Date","prototype","eventName","callback","register","call","config","audio","video","onSuccessMedia","addStream","local","onErrorMedia","console","error","arguments","cid","createOffer"],"mappings":"AAIAA,OAAOC,kBAAoBD,OAAOE,yBAA2BF,OAAOG,qBAKpEH,OAAOI,sBAAwBJ,OAAOK,0BAA4BL,OAAOI,sBAKzEJ,OAAOM,IAAMN,OAAOM,KAAON,OAAOO,UAKlCC,UAAUC,aAAeD,UAAUE,oBAAsBF,UAAUG,eCLnE,IAAIC,OAAQ,SAASC,GACpBC,KAAKD,QAAUA,EACfC,KAAKC,WAGLF,EAAQG,OAASH,EAAQG,QAAU,wBACnCH,EAAQI,WAAaJ,EAAQI,cAC1BC,IAAK,uBACLA,IAAK,gCAGR,IAAIF,GAASG,GAAGC,QAAQP,EAAQG,QAC5BK,EAAiB,GAAIpB,oBACtBgB,WAAcJ,EAAQI,aACtBK,WAAaC,iBAAiB,MAG7BC,EAAe,SAASC,GAE3BJ,EAAeK,oBAAoBD,GAEnCT,EAAOW,KAAK,SAAUF,GAGvBJ,GAAeO,YAAc,SAASC,GAGrCf,KAAKD,QAAQiB,OAAOC,IAAMzB,IAAI0B,gBAAgBH,EAAMI,SACnDC,KAAKpB,MAEPO,EAAec,eAAiB,SAASN,GAEpCA,EAAMO,YACTpB,EAAOW,KAAK,MAAOE,EAAMO,WACzBf,EAAec,eAAiB,OAIlCd,EAAegB,OAAS,aAIxBrB,EAAOsB,GAAG,QAAS,SAASC,GAE3BlB,EAAemB,qBAAqB,GAAIpC,uBAAsBmC,IAE9DlB,EAAeG,aAAaA,KAG7BR,EAAOsB,GAAG,SAAU,SAASb,GAE5BJ,EAAemB,qBAAqB,GAAIpC,uBAAsBqB,KAC7DS,KAAKpB,OAEPE,EAAOsB,GAAG,MAAO,SAASF,GAEzBf,EAAeoB,gBAAgB,GAAIC,iBAAgBN,MAGpDpB,EAAOsB,GAAG,OAAQ,SAASK,GAE1B7B,KAAK8B,aAAaD,GAAO,GAAIE,MACzB/B,KAAKC,QAAc,MACtBD,KAAKC,QAAc,KAAE4B,IAErBT,KAAKpB,OAGPA,KAAKE,OAASA,EACdF,KAAKmB,OAAS,KACdnB,KAAK8B,gBACL9B,KAAKO,eAAiBA,EAQvBT,OAAMkC,UAAUR,GAAK,SAASS,EAAWC,GACxClC,KAAKC,QAAQgC,GAAaC,GAO3BpC,MAAMkC,UAAUG,SAAW,SAASN,GACnC7B,KAAKE,OAAOW,KAAK,WAAYgB,IAO9B/B,MAAMkC,UAAUI,KAAO,SAASP,GAE/B,GAAIQ,IACHC,OAAO,EACPC,OAAO,GAGJC,EAAiB,SAASrB,GAE7BnB,KAAKmB,OAASA,EACdnB,KAAKO,eAAekC,UAAUzC,KAAKmB,QACnCnB,KAAKD,QAAQ2C,MAAMzB,IAAMzB,IAAI0B,gBAAgBC,GAC7CnB,KAAKE,OAAOW,KAAK,OAAQgB,IACxBT,KAAKpB,MAEH2C,EAAe,WAClBC,QAAQC,MAAMC,WAGfpD,WAAUC,aAAa0C,EAAQG,EAAgBG,IAOhD7C,MAAMkC,UAAUrB,OAAS,SAASkB,GACjC,GAAIkB,GAAM/C,KAAK8B,aAAaD,GAExBQ,GACHC,OAAO,EACPC,OAAO,EAGR,IAAIQ,EAAK,CACR,GAAIP,GAAiB,SAASrB,GAE7BnB,KAAKmB,OAASA,EACdnB,KAAKD,QAAQ2C,MAAMzB,IAAMzB,IAAI0B,gBAAgBC,GAC7CnB,KAAKO,eAAekC,UAAUzC,KAAKmB,QAEnCnB,KAAKO,eAAeyC,YAAY,SAASvB,GACxCzB,KAAKO,eAAeK,oBAAoBa,GACxCzB,KAAKE,OAAOW,KAAK,QAASY,IACzBL,KAAKpB,QAGNoB,KAAKpB,MAEH2C,EAAe,WAClBC,QAAQC,MAAMC,WAGfpD,WAAUC,aAAa0C,EAAQG,EAAgBG"}