var WidgetGDPR = function WidgetGDPR(options) {
    this.displaStyle = options.displaStyle;
    this.position = options.position;
    this.bgColor = options.bgColor;
    this.textColor = options.textColor;
    this.policyLink = options.policyLink;
    this.policyLinkText = options.policyLinkText;
    this.buttonColor = options.buttonColor;
    this.dismissText = options.dismissText;
    this.message = options.message;
    this.apiKey = options.apiKey;
    this.isShowing = true;
    this.initialise();
    this.createStyles();
  };
  
  WidgetGDPR.prototype.initialise = function initialise () {
  
    function apiResponse (response) {
      if(response.error) {
        console.log(response.error.message);
        document.querySelector('.wgdpr__container__message').innerHTML = response.error.message;
      } else {
        console.log(response.country_is_eu)
        console.log(response.country_code)
      }
    }
  
    function httpGetAsync(url, callback) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
          var errorObj = JSON.parse(xmlHttp.response); 
          callback(errorObj);
        }
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          callback(xmlHttp.responseText);
        } 
      }
      
      xmlHttp.open("GET", url, true);
      xmlHttp.send(null);
    }
  
    var url = "https://ipgeolocation.abstractapi.com/v1/?api_key=";
    var UNIQUE_API_KEY = '';
    if (this.apiKey ) { UNIQUE_API_KEY = this.apiKey}
    var fullUrl = url + UNIQUE_API_KEY
    httpGetAsync(fullUrl, apiResponse);
    
   
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.classList.add('wgdpr__container');
    container.style.background = this.bgColor;
  
    if (!this.isShowing) {
      container.classList.add('wgdpr__container__dismiss');
    }
  
    if (this.displaStyle === 'Tooltip') {
      container.style.flexDirection = 'column';
      container.style.maxWidth = '22em'
      container.classList.add('wgdpr__container--tooltip');
    }
  
    if (this.displaStyle === 'Bar') {
      container.style.flexDirection = 'row';
      container.style.alignItems = 'center';
      container.style.margin = '1rem';
      container.style.padding = '1rem';
      container.classList.add('wgdpr__container--bar');
    }
  
    if (this.position === 'BottomLeft') {
      container.style.left = '1rem';
      container.style.bottom = '1rem';
    } else if (this.position === 'BottomRight') {
      container.style.right = '1rem';
      container.style.bottom = '1rem';
    } else if (this.position === 'TopLeft') {
      container.style.top = '1rem';
      container.style.left = '1rem';
    } else if (this.position === 'TopRight') {
      container.style.top = '1rem';
      container.style.right = '1rem';
    } else if (this.position === 'Top') {
      container.style.top = '0';
      container.style.left = '0';
      container.style.right = '0';
    } else if (this.position === 'Bottom') {
      container.style.bottom = '0';
      container.style.left = '0';
      container.style.right = '0';
    }
  
    document.body.appendChild(container);
  
    this.messageSpan = document.createElement('span');
    this.messageSpan.classList.add('wgdpr__container__message');
    this.messageSpan.style.color = this.textColor;
    this.createMessageSpan();
  
    this.anchor = document.createElement('a');
    this.createLink() 
    this.messageSpan.appendChild(this.anchor);
  
    this.compliance = document.createElement('div');
    this.compliance.classList.add('wgdpr__container__compliance');
  
    this.dismissButton = document.createElement('button');
    this.dismissButton.style.backgroundColor = this.buttonColor;
    this.createDismissButton() 
    this.compliance.appendChild(this.dismissButton);
  
    this.dismissButton.addEventListener('click', this.toggleShow.bind(this.toggleShow));
  
    container.appendChild(this.messageSpan);
    container.appendChild(this.compliance );
  
  };
  
  WidgetGDPR.prototype.createMessageSpan = function createMessageSpan () {
    this.messageSpan.innerHTML = this.message;
  };
  
  WidgetGDPR.prototype.createLink = function createLink () {
    if (this.policyLink) {
      this.anchor.href = this.policyLink;
      this.anchor.rel = 'noreferrer';
    } else {
      this.anchor.href = '/privacy-policy'
      this.anchor.rel = 'noreferrer';
    }
    if (this.policyLinkText) {
      this.anchor.innerHTML = this.policyLinkText;
    }
  };
  
  WidgetGDPR.prototype.createDismissButton = function createDismissButton () {
    this.dismissButton.type = 'button';
    this.dismissButton.innerHTML = this.dismissText;
  };
  
  WidgetGDPR.prototype.createStyles = function createStyles () {
    var styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .wgdpr__container {
        box-sizing: border-box;
        display: flex;
        flex-wrap: nowrap;
        font-family: inherit;
        font-size: 16px;
        overflow: hidden;
        position: fixed;
        opacity: 1;
        transition: opacity 1s ease 0s;
        z-index: 99999;
        border-radius: 4px;
        padding: 1.5em;
        line-height: 1.3;
      }
  
      .wgdpr__container__dismiss {
        display: none !important;
        visibility: hidden !important;
        width: 0 !important;
        height: 0 !important;
      }
  
      .wgdpr__container__message {
        display: block;
        font-size: 16px;
      }
  
      .wgdpr__container__message > a {
        display: inline-block;
        padding-left: 3px;
        color: currentcolor;
        text-decoration: underline;
      }
  
      .wgdpr__container--tooltip .wgdpr__container__message {
        margin-bottom: 1em;
      }
      
      .wgdpr__container--bar .wgdpr__container__message {
        flex: 1 1 auto;
        margin-right: 1em;
        max-width: 100%;
      }
      .wgdpr__container__compliance > button{
        display: block;
        font-size: 14px;
        font-weight: bold;
        padding: 8px 18px;
        text-align: center;
        white-space: nowrap;
        background-color: white;
        border: 1px solid transparent;
        transition: background-color 0.2s ease 0s;
        color: white;
        border-radius: 3px;
        cursor: pointer;
      }
      .wgdpr__container--tooltip .wgdpr__container__compliance{
        flex: 1 0 auto;
      }
      .wgdpr__container--tooltip .wgdpr__container__compliance > button {
        width: 100%;
      }
      `.replace(/^\s+|\n/gm, '');
      document.head.appendChild(styleTag);
  }
  
  WidgetGDPR.prototype.toggleShow = function () {
    this.isShowing = !this.isShowing;
    var container = document.querySelector('.wgdpr__container');
    container.classList.add('wgdpr__container__dismiss');
  };
  