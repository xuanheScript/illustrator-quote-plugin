import { useState, useEffect } from 'react'
import './App.css'

// 定义材质选项
const MATERIALS = [
  { name: '亚克力', price: 200 },
  { name: '木材', price: 150 },
  { name: '金属', price: 300 },
  { name: '玻璃', price: 250 },
  { name: '塑料', price: 100 },
  { name: '石材', price: 400 },
  { name: '皮革', price: 350 },
  { name: '布料', price: 80 }
];

// 声明 CSInterface 类型
declare global {
  interface Window {
    CSInterface: any;
  }
}

function App() {
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0].name);
  const [unitPrice, setUnitPrice] = useState(MATERIALS[0].price);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [csInterface, setCsInterface] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // 初始化 CSInterface
    if (window.CSInterface) {
      const cs = new window.CSInterface();
      setCsInterface(cs);
      console.log('CSInterface initialized');
      setMessage('插件已初始化，可以开始使用');
      cs.evalScript('$.writeln("脚本加载成功")');

      // 动态调用 inspect() 打开控制台
      try {
        alert('打开控制台');
        eval("require('nw.gui').Window.get().showDevTools()");
      } catch(e) {
        alert('无法打开调试器：');
        console.log('无法打开调试器：', e);
      }
    } else {
      console.error('CSInterface not found');
      setMessage('错误：CSInterface 未找到');
    }
  }, []);

  // 处理材质选择变化
  const handleMaterialChange = (materialName: string) => {
    setSelectedMaterial(materialName);
    const material = MATERIALS.find(m => m.name === materialName);
    if (material) {
      setUnitPrice(material.price);
    }
  };

  // 调试功能
  const runDebugTest = () => {
    if (!csInterface) {
      setMessage('错误：CSInterface 未初始化');
      return;
    }

    setIsProcessing(true);
    setMessage('正在运行调试测试...');

    // 简单的调试脚本
    const script = `
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
        JSON.stringify(result);
      } catch (error) {
        JSON.stringify({
          success: false,
          message: "调试测试失败: " + error.message,
          error: error.toString()
        });
      }
    `;
    
    console.log('Running debug test');
    
    csInterface.evalScript(script, (result: string) => {
      setIsProcessing(false);
      console.log('Debug result:', result);
      
      try {
        const response = JSON.parse(result);
        if (response.success) {
          setMessage(`调试成功：${response.message}`);
          setDebugInfo(JSON.stringify(response.data, null, 2));
        } else {
          setMessage(`调试失败：${response.message}`);
          setDebugInfo(response.error || '');
        }
      } catch (error) {
        console.error('Parse error:', error);
        setMessage(`调试完成，原始响应: ${result}`);
        setDebugInfo(result);
      }
    });
  };

  // 应用材质功能（简化版）
  const applyMaterial = () => {
    if (!csInterface) {
      setMessage('错误：CSInterface 未初始化');
      return;
    }

    setIsProcessing(true);
    setMessage('正在应用材质...');

    // 使用内联脚本，避免文件路径问题
    const script = `
      try {
        // 检查文档
        if (!app.activeDocument) {
          JSON.stringify({
            success: false,
            message: "请先打开一个文档"
          });
        } else if (app.activeDocument.selection.length === 0) {
          JSON.stringify({
            success: false,
            message: "请先选择要应用材质的对象"
          });
        } else {
          var doc = app.activeDocument;
          var selectedItem = doc.selection[0];
          var bounds = selectedItem.geometricBounds;
          
          // 计算面积（简化）
          var width = Math.abs(bounds[2] - bounds[0]);
          var height = Math.abs(bounds[1] - bounds[3]);
          var areaPoints = width * height;
          var areaM2 = areaPoints * 0.000000124; // 点²转平方米
          var totalPrice = areaM2 * ${unitPrice};
          
          // 创建文本标注
          var textContent = "材质: ${selectedMaterial}\\n" +
                           "面积: " + areaM2.toFixed(3) + " m²\\n" +
                           "单价: ${unitPrice} 元/m²\\n" +
                           "总价: " + totalPrice.toFixed(2) + " 元";
          
          var textFrame = doc.textFrames.add();
          textFrame.contents = textContent;
          textFrame.position = [bounds[2] + 20, bounds[1]];
          textFrame.textRange.characterAttributes.size = 10;
          
          // 添加标签
          var tag = selectedItem.tags.add();
          tag.name = "QuoteMaterial";
          tag.value = JSON.stringify({
            material: "${selectedMaterial}",
            unitPrice: ${unitPrice},
            area: areaM2,
            totalPrice: totalPrice,
            timestamp: new Date().getTime()
          });
          
          JSON.stringify({
            success: true,
            message: "成功应用材质到对象",
            data: {
              material: "${selectedMaterial}",
              area: areaM2.toFixed(3),
              unitPrice: ${unitPrice},
              totalPrice: totalPrice.toFixed(2)
            }
          });
        }
      } catch (error) {
        JSON.stringify({
          success: false,
          message: "应用材质时发生错误: " + error.message,
          error: error.toString()
        });
      }
    `;
    
    console.log('Applying material');
    
    csInterface.evalScript(script, (result: string) => {
      setIsProcessing(false);
      console.log('Apply result:', result);
      
      try {
        const response = JSON.parse(result);
        if (response.success) {
          setMessage(`成功：${response.message}`);
        } else {
          setMessage(`错误：${response.message}`);
        }
      } catch (error) {
        console.error('Parse error:', error);
        setMessage(`应用完成，原始响应: ${result}`);
      }
    });
  };

  // 导出报价功能（简化版）
  const exportQuote = () => {
    if (!csInterface) {
      setMessage('错误：CSInterface 未初始化');
      return;
    }

    setIsProcessing(true);
    setMessage('正在导出报价...');

    const script = `
      try {
        if (!app.activeDocument) {
          JSON.stringify({
            success: false,
            message: "请先打开一个文档"
          });
        } else {
          var doc = app.activeDocument;
          var quotedItems = [];
          
          // 遍历所有图层和对象
          for (var layerIndex = 0; layerIndex < doc.layers.length; layerIndex++) {
            var layer = doc.layers[layerIndex];
            for (var itemIndex = 0; itemIndex < layer.pageItems.length; itemIndex++) {
              var item = layer.pageItems[itemIndex];
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
                  } catch (e) {}
                  break;
                }
              }
            }
          }
          
          if (quotedItems.length === 0) {
            JSON.stringify({
              success: false,
              message: "未找到任何已应用材质的对象"
            });
          } else {
            // 生成CSV内容
            var csvContent = "图层,材质,面积(m²),单价(元/m²),总价(元)\\n";
            var totalAmount = 0;
            
            for (var i = 0; i < quotedItems.length; i++) {
              var item = quotedItems[i];
              csvContent += item.layerName + "," + 
                           item.material + "," + 
                           item.area.toFixed(3) + "," + 
                           item.unitPrice + "," + 
                           item.totalPrice.toFixed(2) + "\\n";
              totalAmount += parseFloat(item.totalPrice);
            }
            
            csvContent += "\\n总计," + quotedItems.length + "项,,,," + totalAmount.toFixed(2);
            
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
              file.write("\\uFEFF");
              file.write(csvContent);
              file.close();
              
              JSON.stringify({
                success: true,
                message: "报价单已导出到桌面: " + fileName,
                data: {
                  itemCount: quotedItems.length,
                  totalAmount: totalAmount.toFixed(2),
                  filePath: filePath
                }
              });
            } else {
              JSON.stringify({
                success: false,
                message: "无法创建文件: " + filePath
              });
            }
          }
        }
      } catch (error) {
        JSON.stringify({
          success: false,
          message: "导出报价时发生错误: " + error.message,
          error: error.toString()
        });
      }
    `;
    
    console.log('Exporting quote');
    
    csInterface.evalScript(script, (result: string) => {
      setIsProcessing(false);
      console.log('Export result:', result);
      
      try {
        const response = JSON.parse(result);
        if (response.success) {
          setMessage(`成功：${response.message}`);
        } else {
          setMessage(`错误：${response.message}`);
        }
      } catch (error) {
        console.error('Parse error:', error);
        setMessage(`导出完成，原始响应: ${result}`);
      }
    });
  };

  return (
    <div className="plugin-container">
      <div className="plugin-header">
        <h2>Illustrator 报价插件</h2>
        <p>选择材质并应用到选中的对象</p>
      </div>

      <div className="plugin-content">
        {/* 调试信息 */}
        {debugInfo && (
          <div className="debug-info" style={{ 
            background: '#f0f0f0', 
            padding: '8px', 
            borderRadius: '4px', 
            fontSize: '11px',
            marginBottom: '16px',
            fontFamily: 'monospace'
          }}>
            <strong>调试信息：</strong>
            <pre>{debugInfo}</pre>
          </div>
        )}

        {/* 材质选择 */}
        <div className="form-group">
          <label htmlFor="material-select">材质类型：</label>
          <select 
            id="material-select"
            value={selectedMaterial}
            onChange={(e) => handleMaterialChange(e.target.value)}
            className="material-select"
          >
            {MATERIALS.map(material => (
              <option key={material.name} value={material.name}>
                {material.name}
              </option>
            ))}
          </select>
        </div>

        {/* 单价输入 */}
        <div className="form-group">
          <label htmlFor="unit-price">单价（元/m²）：</label>
          <input
            id="unit-price"
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(Number(e.target.value))}
            className="price-input"
            min="0"
            step="0.01"
          />
        </div>

        {/* 操作按钮 */}
        <div className="button-group">
          <button 
            onClick={runDebugTest}
            disabled={isProcessing}
            className="apply-button"
            style={{ backgroundColor: '#6c757d' }}
          >
            {isProcessing ? '测试中...' : '调试测试'}
          </button>
          
          <button 
            onClick={applyMaterial}
            disabled={isProcessing}
            className="apply-button"
          >
            {isProcessing ? '处理中...' : '应用材质'}
          </button>
          
          <button 
            onClick={exportQuote}
            disabled={isProcessing}
            className="export-button"
          >
            {isProcessing ? '导出中...' : '导出报价'}
          </button>
        </div>

        {/* 消息显示 */}
        {message && (
          <div className={`message ${message.includes('错误') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* 使用说明 */}
        <div className="instructions">
          <h3>使用说明：</h3>
          <ol>
            <li>点击"调试测试"检查插件状态</li>
            <li>在 Illustrator 中选择要应用材质的对象</li>
            <li>选择材质类型和单价</li>
            <li>点击"应用材质"按钮</li>
            <li>完成后点击"导出报价"生成 CSV 文件到桌面</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;
