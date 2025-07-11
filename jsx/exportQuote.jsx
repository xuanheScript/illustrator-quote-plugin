// JSON polyfill for ExtendScript
if (typeof JSON === 'undefined') {
    var JSON = {
        stringify: function (obj) {
            if (obj === null) return 'null';
            if (typeof obj === 'undefined') return 'undefined';
            if (typeof obj === 'string') return '"' + obj.replace(/"/g, '\\"') + '"';
            if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
            if (obj instanceof Array) {
                var arr = [];
                for (var i = 0; i < obj.length; i++) {
                    arr.push(JSON.stringify(obj[i]));
                }
                return '[' + arr.join(',') + ']';
            }
            if (typeof obj === 'object') {
                var props = [];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        props.push('"' + key + '":' + JSON.stringify(obj[key]));
                    }
                }
                return '{' + props.join(',') + '}';
            }
            return '{}';
        },
        parse: function (str) {
            return eval('(' + str + ')');
        }
    };
}

/**
 * 导出报价到CSV文件
 */
function exportQuote() {
    try {
        var doc = app.activeDocument;
        var quotedItems = [];

        // 遍历文档中的所有对象，查找带有材质标识的对象
        function findQuotedItems(items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                // 检查是否有材质标签
                for (var j = 0; j < item.tags.length; j++) {
                    var tag = item.tags[j];
                    if (tag.name === "QuoteMaterial") {
                        try {
                            var data = JSON.parse(tag.value);
                            quotedItems.push({
                                layerName: item.name || "未命名对象",
                                material: data.material,
                                area: data.area,
                                unitPrice: data.unitPrice,
                                totalPrice: data.totalPrice
                            });
                        } catch (e) {
                            // 忽略解析错误的标签
                        }
                        break;
                    }
                }

                // 递归检查子对象
                if (item.pageItems && item.pageItems.length > 0) {
                    findQuotedItems(item.pageItems);
                }
            }
        }

        // 从所有图层开始查找
        for (var layerIndex = 0; layerIndex < doc.layers.length; layerIndex++) {
            var layer = doc.layers[layerIndex];
            findQuotedItems(layer.pageItems);
        }

        if (quotedItems.length === 0) {
            return JSON.stringify({
                success: false,
                message: "未找到任何已应用材质的对象"
            });
        }

        // 生成CSV内容 - 使用Unicode字符解决平方符号显示问题
        var squareSymbol = String.fromCharCode(0x00B2); // ² 的Unicode
        var csvContent = "图层,材质,面积(m" + squareSymbol + "),单价(元/m" + squareSymbol + "),总价(元)\n";
        var totalAmount = 0;

        for (var i = 0; i < quotedItems.length; i++) {
            var item = quotedItems[i];
            csvContent += item.layerName + "," +
                item.material + "," +
                item.area.toFixed(3) + "," +
                item.unitPrice + "," +
                item.totalPrice.toFixed(2) + "\n";
            totalAmount += parseFloat(item.totalPrice);
        }

        // 添加总计行
        csvContent += "\n总计," + quotedItems.length + "项,," + "," + totalAmount.toFixed(2);

        // 获取桌面路径
        var desktopPath = "~/Desktop/";
        if ($.os.indexOf("Windows") !== -1) {
            desktopPath = Folder.desktop.fsName + "\\";
        } else {
            desktopPath = Folder.desktop.fsName + "/";
        }

        // 生成文件名（包含时间戳）
        var now = new Date();
        var timestamp = now.getFullYear() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0') + "_" +
            String(now.getHours()).padStart(2, '0') +
            String(now.getMinutes()).padStart(2, '0');

        var fileName = "报价单_" + timestamp + ".csv";
        var filePath = desktopPath + fileName;

        // 写入文件
        var file = new File(filePath);
        file.encoding = "UTF-8";
        file.open("w");

        // 添加BOM以确保Excel正确显示中文
        file.write("\uFEFF");
        file.write(csvContent);
        file.close();

        return JSON.stringify({
            success: true,
            message: "报价单已导出到桌面: " + fileName,
            data: {
                itemCount: quotedItems.length,
                totalAmount: totalAmount.toFixed(2),
                filePath: filePath
            }
        });

    } catch (error) {
        return JSON.stringify({
            success: false,
            message: "导出报价时发生错误: " + error.message
        });
    }
}

// 添加字符串填充方法（ExtendScript不支持padStart）
if (!String.prototype.padStart) {
    String.prototype.padStart = function (targetLength, padString) {
        targetLength = targetLength >> 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length);
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

// 如果直接调用脚本
if (typeof arguments === 'undefined' || arguments.length === 0) {
    exportQuote();
} 