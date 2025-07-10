/**
 * 应用材质到选中对象
 * @param {string} materialName - 材质名称
 * @param {number} unitPrice - 单价（元/m²）
 */
function applyMaterial(materialName, unitPrice) {
    try {
        // 检查是否有选中的对象
        if (app.activeDocument.selection.length === 0) {
            return JSON.stringify({
                success: false,
                message: "请先选择要应用材质的对象"
            });
        }

        var doc = app.activeDocument;
        var results = [];
        
        // 遍历所有选中的对象
        for (var i = 0; i < doc.selection.length; i++) {
            var selectedItem = doc.selection[i];
            
            // 获取对象的边界框
            var bounds = selectedItem.geometricBounds;
            
            // 计算面积（将点转换为毫米，再转换为平方米）
            var width = Math.abs(bounds[2] - bounds[0]) * 0.352778; // 点转毫米
            var height = Math.abs(bounds[1] - bounds[3]) * 0.352778; // 点转毫米
            var areaM2 = (width * height) / 1000000; // 毫米²转平方米
            
            // 计算总价
            var totalPrice = areaM2 * unitPrice;
            
            // 创建标注文本
            var textContent = "材质：" + materialName + "\n" +
                            "面积：" + areaM2.toFixed(3) + " m²\n" +
                            "单价：" + unitPrice + " 元/m²\n" +
                            "总价：" + totalPrice.toFixed(2) + " 元";
            
            // 在对象右侧创建文本
            var textFrame = doc.textFrames.add();
            textFrame.contents = textContent;
            textFrame.position = [bounds[2] + 20, bounds[1]]; // 右侧偏移20点
            
            // 设置文本样式
            var textRange = textFrame.textRange;
            textRange.characterAttributes.size = 10;
            textRange.characterAttributes.fillColor = doc.swatches.getByName("Black").color;
            
            // 给对象添加标识（使用标签）
            var tag = selectedItem.tags.add();
            tag.name = "QuoteMaterial";
            tag.value = JSON.stringify({
                material: materialName,
                unitPrice: unitPrice,
                area: areaM2,
                totalPrice: totalPrice,
                timestamp: new Date().getTime()
            });
            
            // 设置对象名称
            if (selectedItem.name === "") {
                selectedItem.name = "材质对象_" + (i + 1);
            }
            
            results.push({
                name: selectedItem.name,
                material: materialName,
                area: areaM2.toFixed(3),
                unitPrice: unitPrice,
                totalPrice: totalPrice.toFixed(2)
            });
        }
        
        return JSON.stringify({
            success: true,
            message: "成功应用材质到 " + results.length + " 个对象",
            data: results
        });
        
    } catch (error) {
        return JSON.stringify({
            success: false,
            message: "应用材质时发生错误: " + error.message
        });
    }
}

// 如果直接调用脚本，使用默认参数
if (typeof arguments !== 'undefined' && arguments.length >= 2) {
    applyMaterial(arguments[0], parseFloat(arguments[1]));
} 