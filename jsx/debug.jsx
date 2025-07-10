/**
 * 调试脚本 - 测试基本的 Illustrator 功能
 */

function debugTest() {
    try {
        var result = {
            success: true,
            message: "调试测试成功",
            data: {
                appName: app.name,
                appVersion: app.version,
                documentExists: !!app.activeDocument,
                selectionCount: app.activeDocument ? app.activeDocument.selection.length : 0
            }
        };
        
        return JSON.stringify(result);
    } catch (error) {
        return JSON.stringify({
            success: false,
            message: "调试测试失败: " + error.message,
            error: error.toString()
        });
    }
}

function simpleApplyMaterial(materialName, unitPrice) {
    try {
        // 检查文档
        if (!app.activeDocument) {
            return JSON.stringify({
                success: false,
                message: "请先打开一个文档"
            });
        }
        
        // 检查选择
        if (app.activeDocument.selection.length === 0) {
            return JSON.stringify({
                success: false,
                message: "请先选择要应用材质的对象"
            });
        }

        var doc = app.activeDocument;
        var selectedItem = doc.selection[0]; // 只处理第一个选中的对象
        
        // 获取边界框
        var bounds = selectedItem.geometricBounds;
        
        // 计算面积（简化计算）
        var width = Math.abs(bounds[2] - bounds[0]);
        var height = Math.abs(bounds[1] - bounds[3]);
        var areaPoints = width * height;
        var areaM2 = areaPoints * 0.000000124; // 点²转平方米的近似值
        
        // 计算总价
        var totalPrice = areaM2 * unitPrice;
        
        // 创建文本标注
        var textContent = "材质: " + materialName + "\n" +
                         "面积: " + areaM2.toFixed(3) + " m²\n" +
                         "单价: " + unitPrice + " 元/m²\n" +
                         "总价: " + totalPrice.toFixed(2) + " 元";
        
        // 添加文本框
        var textFrame = doc.textFrames.add();
        textFrame.contents = textContent;
        textFrame.position = [bounds[2] + 20, bounds[1]];
        
        // 设置文本样式
        textFrame.textRange.characterAttributes.size = 10;
        
        // 添加标签
        var tag = selectedItem.tags.add();
        tag.name = "QuoteMaterial";
        tag.value = JSON.stringify({
            material: materialName,
            unitPrice: unitPrice,
            area: areaM2,
            totalPrice: totalPrice,
            timestamp: new Date().getTime()
        });
        
        return JSON.stringify({
            success: true,
            message: "成功应用材质到对象",
            data: {
                material: materialName,
                area: areaM2.toFixed(3),
                unitPrice: unitPrice,
                totalPrice: totalPrice.toFixed(2),
                bounds: bounds
            }
        });
        
    } catch (error) {
        return JSON.stringify({
            success: false,
            message: "应用材质时发生错误: " + error.message,
            error: error.toString(),
            line: error.line || "未知"
        });
    }
}

function simpleExportQuote() {
    try {
        if (!app.activeDocument) {
            return JSON.stringify({
                success: false,
                message: "请先打开一个文档"
            });
        }
        
        var doc = app.activeDocument;
        var quotedItems = [];
        
        // 遍历所有图层和对象
        for (var layerIndex = 0; layerIndex < doc.layers.length; layerIndex++) {
            var layer = doc.layers[layerIndex];
            
            for (var itemIndex = 0; itemIndex < layer.pageItems.length; itemIndex++) {
                var item = layer.pageItems[itemIndex];
                
                // 检查标签
                for (var tagIndex = 0; tagIndex < item.tags.length; tagIndex++) {
                    var tag = item.tags[tagIndex];
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
                            // 忽略解析错误
                        }
                        break;
                    }
                }
            }
        }
        
        if (quotedItems.length === 0) {
            return JSON.stringify({
                success: false,
                message: "未找到任何已应用材质的对象"
            });
        }
        
        // 生成CSV内容
        var csvContent = "图层,材质,面积(m²),单价(元/m²),总价(元)\n";
        var totalAmount = 0;
        
        for (var i = 0; i < quotedItems.length; i++) {
            var item = quotedItems[i];
            csvContent += '"' + item.layerName + '","' + 
                         item.material + '","' + 
                         item.area.toFixed(3) + '","' + 
                         item.unitPrice + '","' + 
                         item.totalPrice.toFixed(2) + '"\n';
            totalAmount += parseFloat(item.totalPrice);
        }
        
        csvContent += '\n"总计","' + quotedItems.length + '项","","","' + totalAmount.toFixed(2) + '"';
        
        // 生成文件名
        var now = new Date();
        var year = now.getFullYear();
        var month = (now.getMonth() + 1 < 10 ? "0" : "") + (now.getMonth() + 1);
        var day = (now.getDate() < 10 ? "0" : "") + now.getDate();
        var hour = (now.getHours() < 10 ? "0" : "") + now.getHours();
        var minute = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
        
        var fileName = "报价单_" + year + month + day + "_" + hour + minute + ".csv";
        var filePath = Folder.desktop + "/" + fileName;
        
        // 写入文件
        var file = new File(filePath);
        file.encoding = "UTF-8";
        if (file.open("w")) {
            file.write("\uFEFF"); // BOM for UTF-8
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
        } else {
            return JSON.stringify({
                success: false,
                message: "无法创建文件: " + filePath
            });
        }
        
    } catch (error) {
        return JSON.stringify({
            success: false,
            message: "导出报价时发生错误: " + error.message,
            error: error.toString(),
            line: error.line || "未知"
        });
    }
}

// 如果直接调用
if (typeof arguments !== 'undefined' && arguments.length > 0) {
    var action = arguments[0];
    if (action === "debug") {
        debugTest();
    } else if (action === "apply" && arguments.length >= 3) {
        simpleApplyMaterial(arguments[1], parseFloat(arguments[2]));
    } else if (action === "export") {
        simpleExportQuote();
    }
} 