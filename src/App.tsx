import { useState, useEffect } from 'react'
import './App.css'

// 材质数据接口
interface Material {
  id: string;
  name: string;
  price: number;
  color: string;
}

// 默认材质数据
const DEFAULT_MATERIALS: Material[] = [
  { id: '1', name: '亚克力板', price: 120, color: '#0066CC' },
  { id: '2', name: 'PVC板', price: 80, color: '#00AA00' },
  { id: '3', name: '铝塑板', price: 150, color: '#FF6600' },
  { id: '4', name: '不锈钢板', price: 200, color: '#CC0000' },
  { id: '5', name: '木质板', price: 100, color: '#8B4513' }
];

// 本地存储键名
const STORAGE_KEY = 'illustrator-quote-materials';

// 扩展 Window 接口
declare global {
  interface Window {
    CSInterface: any;
  }
}

function App() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [csInterface, setCsInterface] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState('');

  // 材质管理相关状态
  const [showMaterialManager, setShowMaterialManager] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialPrice, setNewMaterialPrice] = useState(0);
  const [newMaterialColor, setNewMaterialColor] = useState('#0066CC');

  // 颜色验证函数
  const isValidColor = (color: string): boolean => {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  };

  // JSON polyfill for ExtendScript
  const jsonPolyfill = `
    if (typeof JSON === 'undefined') {
      var JSON = {
        stringify: function(obj) {
          if (obj === null) return 'null';
          if (typeof obj === 'undefined') return 'undefined';
          if (typeof obj === 'string') return '"' + obj.replace(/"/g, '\\\\"') + '"';
          if (typeof obj === 'number' || typeof obj === 'boolean') return obj.toString();
          if (obj instanceof Array) {
            var items = [];
            for (var i = 0; i < obj.length; i++) {
              items.push(JSON.stringify(obj[i]));
            }
            return '[' + items.join(',') + ']';
          }
          if (typeof obj === 'object') {
            var items = [];
            for (var key in obj) {
              if (obj.hasOwnProperty(key)) {
                items.push(JSON.stringify(key) + ':' + JSON.stringify(obj[key]));
              }
            }
            return '{' + items.join(',') + '}';
          }
          return 'null';
        },
        parse: function(str) {
          return eval('(' + str + ')');
        }
      };
    }
  `;

  // 加载材质数据
  const loadMaterials = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedMaterials = JSON.parse(stored);
        setMaterials(parsedMaterials);
        if (parsedMaterials.length > 0) {
          setSelectedMaterial(parsedMaterials[0].name);
          setUnitPrice(parsedMaterials[0].price);
        }
      } else {
        // 首次使用，设置默认材质
        setMaterials(DEFAULT_MATERIALS);
        setSelectedMaterial(DEFAULT_MATERIALS[0].name);
        setUnitPrice(DEFAULT_MATERIALS[0].price);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MATERIALS));
      }
    } catch (error) {
      console.error('加载材质数据失败:', error);
      setMaterials(DEFAULT_MATERIALS);
      setSelectedMaterial(DEFAULT_MATERIALS[0].name);
      setUnitPrice(DEFAULT_MATERIALS[0].price);
    }
  };

  // 保存材质数据
  const saveMaterials = (materialsToSave: Material[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(materialsToSave));
      setMaterials(materialsToSave);
    } catch (error) {
      console.error('保存材质数据失败:', error);
    }
  };

  // 添加材质
  const addMaterial = () => {
    if (!newMaterialName.trim() || newMaterialPrice <= 0) {
      alert('请输入有效的材质名称和价格');
      return;
    }

    if (!isValidColor(newMaterialColor)) {
      alert('请输入有效的颜色值，格式如：#FF0000');
      return;
    }

    const newMaterial: Material = {
      id: Date.now().toString(),
      name: newMaterialName.trim(),
      price: newMaterialPrice,
      color: newMaterialColor
    };

    const updatedMaterials = [...materials, newMaterial];
    saveMaterials(updatedMaterials);
    setNewMaterialName('');
    setNewMaterialPrice(0);
    setNewMaterialColor('#0066CC');
  };

  // 编辑材质
  const editMaterial = (material: Material) => {
    setEditingMaterial(material);
    setNewMaterialName(material.name);
    setNewMaterialPrice(material.price);
    setNewMaterialColor(material.color);
  };

  // 保存编辑的材质
  const saveEditedMaterial = () => {
    if (!editingMaterial || !newMaterialName.trim() || newMaterialPrice <= 0) {
      alert('请输入有效的材质名称和价格');
      return;
    }

    if (!isValidColor(newMaterialColor)) {
      alert('请输入有效的颜色值，格式如：#FF0000');
      return;
    }

    const updatedMaterials = materials.map(material =>
      material.id === editingMaterial.id
        ? { ...material, name: newMaterialName.trim(), price: newMaterialPrice, color: newMaterialColor }
        : material
    );

    saveMaterials(updatedMaterials);

    // 如果编辑的是当前选中的材质，更新选中状态
    if (selectedMaterial === editingMaterial.name) {
      setSelectedMaterial(newMaterialName.trim());
      setUnitPrice(newMaterialPrice);
    }

    setEditingMaterial(null);
    setNewMaterialName('');
    setNewMaterialPrice(0);
    setNewMaterialColor('#0066CC');
  };

  // 删除材质
  const deleteMaterial = (materialId: string) => {
    if (materials.length <= 1) {
      alert('至少需要保留一个材质');
      return;
    }

    if (confirm('确定要删除这个材质吗？')) {
      const materialToDelete = materials.find(m => m.id === materialId);
      const updatedMaterials = materials.filter(material => material.id !== materialId);
      saveMaterials(updatedMaterials);

      // 如果删除的是当前选中的材质，切换到第一个材质
      if (materialToDelete && selectedMaterial === materialToDelete.name) {
        setSelectedMaterial(updatedMaterials[0].name);
        setUnitPrice(updatedMaterials[0].price);
      }
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingMaterial(null);
    setNewMaterialName('');
    setNewMaterialPrice(0);
    setNewMaterialColor('#0066CC');
  };

  useEffect(() => {
    loadMaterials();

    // 初始化 CSInterface
    if (window.CSInterface) {
      const cs = new window.CSInterface();
      setCsInterface(cs);
      console.log('CSInterface initialized');
      setMessage('插件已初始化，可以开始使用');
      cs.evalScript('$.writeln("脚本加载成功")');
    } else {
      console.error('CSInterface not found');
      setMessage('错误：CSInterface 未找到');
    }
  }, []);

  // 处理材质选择变化
  const handleMaterialChange = (materialName: string) => {
    setSelectedMaterial(materialName);
    const material = materials.find(m => m.name === materialName);
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
      ${jsonPolyfill}
      
      (function() {
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
      })();
    `;

    console.log('Running debug test');

    csInterface.evalScript(script, (result: string) => {
      setIsProcessing(false);
      console.log('Debug result:', result);

      // 检查result是否存在且为字符串
      if (!result || typeof result !== 'string') {
        console.error('Invalid result:', result);
        setMessage(`调试失败：脚本执行无响应或返回无效结果`);
        setDebugInfo(`原始结果: ${result}`);
        return;
      }

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

  // 应用材质功能（增强版）
  const applyMaterial = () => {
    if (!csInterface) {
      setMessage('错误：CSInterface 未初始化');
      return;
    }

    const currentMaterial = materials.find(m => m.name === selectedMaterial);
    if (!currentMaterial) {
      setMessage('错误：未找到选中的材质');
      return;
    }

    setIsProcessing(true);
    setMessage('正在应用材质...');

    // 使用内联脚本，避免文件路径问题
    const script = `
      ${jsonPolyfill}
      
      (function() {
        try {
          // 检查文档
          if (!app.activeDocument) {
            return JSON.stringify({
              success: false,
              message: "请先打开一个文档"
            });
          } else if (app.activeDocument.selection.length === 0) {
            return JSON.stringify({
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
                             "宽 * 高: " + width.toFixed(3) + " * " + height.toFixed(3) + " mm\\n" +
                             "面积: " + areaM2.toFixed(3) + " 平方米\\n" +
                             "单价: ${unitPrice} 元/平方米\\n" +
                             "总价: " + totalPrice.toFixed(2) + " 元";
            
            var textFrame = doc.textFrames.add();
            textFrame.contents = textContent;
            
            // 安全地设置文字属性
            try {
              textFrame.textRange.characterAttributes.size = 10;
            } catch (e) {
              // 如果设置失败，使用默认大小
            }
            
            // 简单定位：优先右侧，如果空间不足则左侧
            var textX = bounds[2] + 20;
            var textY = bounds[1];
            
            // 检查是否超出画布右边界
            if (textX + 150 > doc.width) {
              textX = bounds[0] - 150;
            }
            
            textFrame.position = [textX, textY];
            
            // 创建RGB颜色
            var materialColor = new RGBColor();
            materialColor.red = parseInt("${currentMaterial.color}".substr(1, 2), 16);
            materialColor.green = parseInt("${currentMaterial.color}".substr(3, 2), 16);
            materialColor.blue = parseInt("${currentMaterial.color}".substr(5, 2), 16);
            
            // 方案1：给原始对象添加轮廓线
            selectedItem.stroked = true;
            selectedItem.strokeColor = materialColor;
            selectedItem.strokeWidth = 5;
            
            // 方案2：创建一个轮廓复制对象（确保轮廓线可见）
            var outlineCopy = selectedItem.duplicate();
            outlineCopy.filled = false;
            outlineCopy.stroked = true;
            outlineCopy.strokeColor = materialColor;
            outlineCopy.strokeWidth = 5;
            
            // 将轮廓复制对象放在最前面
            outlineCopy.move(doc.layers[0], ElementPlacement.PLACEATBEGINNING);
            
            // 创建分组
            var group = doc.groupItems.add();
            group.name = "Quote_${selectedMaterial}_" + new Date().getTime();
            
            // 将元素添加到分组
            outlineCopy.move(group, ElementPlacement.INSIDE);
            textFrame.move(group, ElementPlacement.INSIDE);
            
            // 添加标签到原始对象
            var tag = selectedItem.tags.add();
            tag.name = "QuoteMaterial";
            tag.value = JSON.stringify({
              material: "${selectedMaterial}",
              unitPrice: ${unitPrice},
              area: areaM2,
              totalPrice: totalPrice,
              color: "${currentMaterial.color}",
              groupName: group.name,
              timestamp: new Date().getTime()
            });
            
            return JSON.stringify({
              success: true,
              message: "成功应用材质到对象",
              data: {
                material: "${selectedMaterial}",
                area: areaM2.toFixed(3),
                unitPrice: ${unitPrice},
                totalPrice: totalPrice.toFixed(2),
                color: "${currentMaterial.color}"
              }
            });
          }
        } catch (error) {
          return JSON.stringify({
            success: false,
            message: "应用材质时发生错误: " + error.message,
            error: error.toString()
          });
        }
      })();
    `;

    console.log('Applying material');

    csInterface.evalScript(script, (result: string) => {
      setIsProcessing(false);
      console.log('Apply result:', result);

      // 检查result是否存在且为字符串
      if (!result || typeof result !== 'string') {
        console.error('Invalid result:', result);
        setMessage(`应用材质失败：脚本执行无响应或返回无效结果`);
        return;
      }

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
      ${jsonPolyfill}
      
      (function() {
        try {
          if (!app.activeDocument) {
            return JSON.stringify({
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
            return JSON.stringify({
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
          }
        }
      } catch (error) {
        return JSON.stringify({
          success: false,
          message: "导出报价时发生错误: " + error.message,
          error: error.toString()
        });
      }
      })();
    `;

    console.log('Exporting quote');

    csInterface.evalScript(script, (result: string) => {
      setIsProcessing(false);
      console.log('Export result:', result);

      // 检查result是否存在且为字符串
      if (!result || typeof result !== 'string') {
        console.error('Invalid result:', result);
        setMessage(`导出失败：脚本执行无响应或返回无效结果`);
        return;
      }

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              id="material-select"
              value={selectedMaterial}
              onChange={(e) => handleMaterialChange(e.target.value)}
              className="material-select"
              style={{ flex: 1 }}
            >
              {materials.map(material => (
                <option key={material.id} value={material.name}>
                  {material.name}
                </option>
              ))}
            </select>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: materials.find(m => m.name === selectedMaterial)?.color || '#000000',
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}></div>
            <small style={{ color: '#666', fontSize: '11px' }}>
              {materials.find(m => m.name === selectedMaterial)?.color || '#000000'}
            </small>
          </div>
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

        {/* 材质管理 */}
        <div className="material-management">
          <button
            onClick={() => setShowMaterialManager(!showMaterialManager)}
            className="manage-button"
            style={{ backgroundColor: '#28a745', marginBottom: '10px' }}
          >
            {showMaterialManager ? '隐藏材质管理' : '管理材质'}
          </button>

          {showMaterialManager && (
            <div className="material-manager" style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: '#f8f9fa'
            }}>
              <h4>材质管理</h4>

              {/* 添加/编辑材质表单 */}
              <div className="material-form" style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="材质名称"
                    value={newMaterialName}
                    onChange={(e) => setNewMaterialName(e.target.value)}
                    style={{ flex: 1, padding: '5px' }}
                  />
                  <input
                    type="number"
                    placeholder="单价"
                    value={newMaterialPrice || ''}
                    onChange={(e) => setNewMaterialPrice(Number(e.target.value))}
                    style={{ width: '100px', padding: '5px' }}
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="text"
                    placeholder="#FF0000"
                    value={newMaterialColor}
                    onChange={(e) => setNewMaterialColor(e.target.value)}
                    style={{ width: '80px', padding: '5px' }}
                    pattern="^#[0-9A-Fa-f]{6}$"
                    title="请输入6位十六进制颜色值，如：#FF0000"
                  />
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: isValidColor(newMaterialColor) ? newMaterialColor : '#cccccc',
                    border: '1px solid #ccc',
                    borderRadius: '3px'
                  }}></div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {editingMaterial ? (
                    <>
                      <button
                        onClick={saveEditedMaterial}
                        style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }}
                      >
                        保存修改
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }}
                      >
                        取消
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={addMaterial}
                      style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }}
                    >
                      添加材质
                    </button>
                  )}
                </div>
              </div>

              {/* 材质列表 */}
              <div className="material-list">
                <h5>现有材质:</h5>
                {materials.map(material => (
                  <div key={material.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    marginBottom: '5px',
                    backgroundColor: selectedMaterial === material.name ? '#e3f2fd' : 'white',
                    border: '1px solid #ddd',
                    borderRadius: '3px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: material.color,
                        border: '1px solid #ccc',
                        borderRadius: '3px'
                      }}></div>
                      <span>
                        <strong>{material.name}</strong> - {material.price} 元/平方米
                      </span>
                      <small style={{ color: '#666', fontSize: '11px' }}>
                        {material.color}
                      </small>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => editMaterial(material)}
                        style={{ backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '3px 6px', borderRadius: '3px', fontSize: '12px' }}
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => deleteMaterial(material.id)}
                        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '3px 6px', borderRadius: '3px', fontSize: '12px' }}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
