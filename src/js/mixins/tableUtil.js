export default {
    loadXMLDoc (Ajax, callback) {
        let xmlhttp;
        if (window.XMLHttpRequest)
            xmlhttp=new XMLHttpRequest();
        else
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                callback(xmlhttp.responseText);
            }
        }
        xmlhttp.open(Ajax.method, Ajax.url, true);
        xmlhttp.setRequestHeader("Content-Type","application/json");
        xmlhttp.send(JSON.stringify(Ajax.data));
    },

    getToken (jsonData) {
        let jsonObject = JSON.parse(jsonData);
        return jsonObject.session.token;
    },

    getResouce (callback) {
        let loginAjax = {
          url: "http://10.10.73.208:1339/user/login",
          method: "POST",
          data: {uid:"admin",pwd:"123456"}
        };
        let resourceAjax = {
          url: "http://10.10.73.208:1339/rest/resource?token=",
          method: "GET"
        };
        this.loadXMLDoc(loginAjax, (loginJson)=>{
          let token = this.getToken(loginJson);
          resourceAjax.url += token;
          this.loadXMLDoc(resourceAjax, (resourceJson)=>{
            callback(JSON.parse(resourceJson));
          });
        })
    },

    getJob (callback) {
        let loginAjax = {
          url: "http://10.10.73.208:1339/user/login",
          method: "POST",
          data: {uid:"admin",pwd:"123456"}
        };
        let resourceAjax = {
          url: "http://10.10.73.208:1339/rest/job?token=",
          method: "GET"
        };
        this.loadXMLDoc(loginAjax, (loginJson)=>{
          let token = this.getToken(loginJson);
          resourceAjax.url += token;
          this.loadXMLDoc(resourceAjax, (resourceJson)=>{
            callback(JSON.parse(resourceJson));
          });
        })
    }
}