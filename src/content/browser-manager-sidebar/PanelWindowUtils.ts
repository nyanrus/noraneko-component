import { BrowserManagerSidebar } from "@content/browser-manager-sidebar/BrowserManagerSidebar";

class CPanelWindowUtils {
  get STATIC_SIDEBAR_DATA() {
    return BrowserManagerSidebar.STATIC_SIDEBAR_DATA;
  }

  get BROWSER_SIDEBAR_DATA() {
    return JSON.parse(
      Services.prefs.getStringPref("floorp.browser.sidebar2.data", undefined),
    );
  }

  getWindowByWebpanelId(
    webpanelId: string,
    parentWindow: { document: Document },
  ) {
    const webpanelBrowserId = `webpanel${webpanelId}`;
    const webpanelBrowser =
      parentWindow.document.getElementById(webpanelBrowserId);

    if (!webpanelBrowser) {
      return null;
    }

    return webpanelBrowser.browsingContext.associatedWindow;
  }

  toggleMutePanel(window, webpanelId: string, isParentWindow: boolean) {
    let targetPanelWindow = null;

    if (isParentWindow) {
      targetPanelWindow = this.getWindowByWebpanelId(webpanelId, window);
    } else {
      targetPanelWindow = window;
    }

    if (!targetPanelWindow) {
      return;
    }

    const tab = targetPanelWindow.gBrowser.selectedTab;
    const audioMuted = tab.linkedBrowser.audioMuted;

    if (audioMuted) {
      tab.linkedBrowser.unmute();
    } else {
      tab.linkedBrowser.mute();
    }
  }

  reloadPanel(window, webpanelId: string, isParentWindow: boolean) {
    console.log("reloadPanel", window, webpanelId, isParentWindow);
    let targetPanelWindow = null;

    if (isParentWindow) {
      targetPanelWindow = this.getWindowByWebpanelId(webpanelId, window);
    } else {
      targetPanelWindow = window;
    }

    if (!targetPanelWindow) {
      return;
    }

    const tab = targetPanelWindow.gBrowser.selectedTab;
    tab.linkedBrowser.reload();
  }

  goForwardPanel(window, webpanelId: string, isParentWindow: boolean) {
    let targetPanelWindow = null;

    if (isParentWindow) {
      targetPanelWindow = this.getWindowByWebpanelId(webpanelId, window);
    } else {
      targetPanelWindow = window;
    }

    if (!targetPanelWindow) {
      return;
    }

    const tab = targetPanelWindow.gBrowser.selectedTab;
    tab.linkedBrowser.goForward();
  }

  goBackPanel(window, webpanelId: string, isParentWindow: boolean) {
    let targetPanelWindow = null;

    if (isParentWindow) {
      targetPanelWindow = this.getWindowByWebpanelId(webpanelId, window);
    } else {
      targetPanelWindow = window;
    }

    if (!targetPanelWindow) {
      return;
    }

    const tab = targetPanelWindow.gBrowser.selectedTab;
    tab.linkedBrowser.goBack();
  }

  goIndexPagePanel(window, webpanelId: string, isParentWindow: boolean) {
    let targetPanelWindow = null;

    if (isParentWindow) {
      targetPanelWindow = this.getWindowByWebpanelId(webpanelId, window);
    } else {
      targetPanelWindow = window;
    }

    if (!targetPanelWindow) {
      return;
    }

    const uri = targetPanelWindow.bmsLoadedURI;
    targetPanelWindow.gBrowser.loadURI(Services.io.newURI(uri), {
      triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
    });
  }

  reopenInSelectContainer(
    window,
    webpanelId: string,
    userContextId: string,
    isParentWindow: boolean,
  ) {
    let targetPanelWindow = null;

    if (isParentWindow) {
      targetPanelWindow = this.getWindowByWebpanelId(webpanelId, window);
    } else {
      targetPanelWindow = window;
    }

    if (!targetPanelWindow) {
      return;
    }

    const reopenedTabs = targetPanelWindow.gBrowser.tabs;
    const loadURL = this.STATIC_SIDEBAR_DATA.data[webpanelId].loadURL;

    for (const tab of reopenedTabs) {
      if (tab.getAttribute("usercontextid") === userContextId) {
        continue;
      }

      tab.setAttribute("BMS-webpanel-tab", "true");

      const newTab = targetPanelWindow.gBrowser.addTab(loadURL, {
        userContextId,
        triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal(
          {},
        ),
      });

      targetPanelWindow.gBrowser.moveTabTo(newTab, tab._tPos);
      targetPanelWindow.gBrowser.removeTab(tab);
      targetPanelWindow.gBrowser.selectedTab = newTab;

      targetPanelWindow.gBrowser.addTab("about:blank", {
        userContextId,
        triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal(
          {},
        ),
        inBackground: true,
      });
    }
  }

  saveZoomLevel(webpanelId: string, zoomLevel) {
    const currentBSMData = this.BROWSER_SIDEBAR_DATA;
    currentBSMData.data[webpanelId].zoomLevel = zoomLevel;
    Services.prefs.setStringPref(
      "floorp.browser.sidebar2.data",
      JSON.stringify(currentBSMData),
    );
  }

  zoomInPanel(window, webpanelId: string, isParentWindow: boolean) {
    let targetPanelWindow = null;

    if (isParentWindow) {
      targetPanelWindow = this.getWindowByWebpanelId(webpanelId, window);
    } else {
      targetPanelWindow = window;
    }

    if (!targetPanelWindow) {
      return;
    }

    targetPanelWindow.ZoomManager.enlarge();

    const zoomLevel = targetPanelWindow.ZoomManager.zoom;
    this.saveZoomLevel(webpanelId, zoomLevel);
  }

  zoomOutPanel(window, webpanelId: string, isParentWindow: boolean) {
    let targetPanelWindow = null;

    if (isParentWindow) {
      targetPanelWindow = this.getWindowByWebpanelId(webpanelId, window);
    } else {
      targetPanelWindow = window;
    }

    if (!targetPanelWindow) {
      return;
    }

    targetPanelWindow.ZoomManager.reduce();

    const zoomLevel = targetPanelWindow.ZoomManager.zoom;
    this.saveZoomLevel(webpanelId, zoomLevel);
  }

  resetZoomPanel(window, webpanelId: string, isParentWindow: boolean) {
    let targetPanelWindow = null;

    if (isParentWindow) {
      targetPanelWindow = this.getWindowByWebpanelId(webpanelId, window);
    } else {
      targetPanelWindow = window;
    }

    if (!targetPanelWindow) {
      return;
    }

    targetPanelWindow.ZoomManager.zoom = 1;

    const zoomLevel = targetPanelWindow.ZoomManager.zoom;
    this.saveZoomLevel(webpanelId, zoomLevel);
  }
}

const PanelWindowUtils = new CPanelWindowUtils();

export { PanelWindowUtils };
