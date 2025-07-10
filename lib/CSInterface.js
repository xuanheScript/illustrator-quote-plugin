/**
 * CSInterface - 简化版本，用于 CEP 插件与 ExtendScript 通信
 */
function CSInterface() {
    this.hostEnvironment = {
        appName: "IDSN",
        appVersion: "25.0.0"
    };
}

CSInterface.prototype.getHostEnvironment = function() {
    return JSON.stringify(this.hostEnvironment);
};

CSInterface.prototype.evalScript = function(script, callback) {
    try {
        // 在实际环境中，这里会调用 ExtendScript
        // 这里提供一个模拟实现
        console.log("Executing script:", script);
        
        // 模拟异步执行
        setTimeout(function() {
            if (callback) {
                callback("Script executed successfully");
            }
        }, 100);
    } catch (error) {
        console.error("Script execution error:", error);
        if (callback) {
            callback("Error: " + error.message);
        }
    }
};

CSInterface.prototype.getSystemPath = function(pathType) {
    // 模拟系统路径
    switch (pathType) {
        case "extension":
            return "/Applications/Adobe Illustrator 2025/CEP/extensions/com.illustrator.quote.panel/";
        case "hostApplication":
            return "/Applications/Adobe Illustrator 2025/";
        default:
            return "";
    }
};

CSInterface.prototype.getOSInformation = function() {
    return JSON.stringify({
        platform: navigator.platform,
        version: "10.15.7"
    });
};

CSInterface.prototype.openURLInDefaultBrowser = function(url) {
    if (typeof window !== 'undefined' && window.open) {
        window.open(url, '_blank');
    }
};

CSInterface.prototype.getApplicationID = function() {
    return "IDSN";
};

CSInterface.prototype.getHostCapabilities = function() {
    return JSON.stringify({
        EXTENDED_PANEL_MENU: true,
        EXTENDED_PANEL_ICONS: true,
        DELEGATE_APE_ENGINE: false,
        SUPPORT_HTML_EXTENSIONS: true,
        DISABLE_FLASH_EXTENSIONS: true
    });
};

// 导出为全局变量
if (typeof window !== 'undefined') {
    window.CSInterface = CSInterface;
}

// 如果是 Node.js 环境
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSInterface;
} 