import { useState, useEffect } from 'react'
import './App.css'

// 材质数据接口
interface Material {
  id: string;
  name: string;
  color: string;
  unit?: string;
}

// 默认材质数据
const DEFAULT_MATERIALS: Material[] = [
  { id: '1', name: '亚克力', color: '#eb2f96' },
  { id: '2', name: 'PVC', color: '#52c41a' },
  { id: '3', name: '宣绒布', color: '#fa8c16' },
  { id: '4', name: '不锈钢', color: '#f5222d' },
  { id: '5', name: '木塑', color: '#722ed1' }
];

// 本地存储键名
const STORAGE_KEY = 'illustrator-quote-materials';

// 扩展 Window 接口
declare global {
  interface Window {
    CSInterface: unknown;
  }
}

function App() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [unitValues, setUnitValues] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [csInterface, setCsInterface] = useState<unknown>(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [isWaitingForClick, setIsWaitingForClick] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // 材质管理相关状态
  const [showMaterialManager, setShowMaterialManager] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialColor, setNewMaterialColor] = useState('#0066CC');
  const [newMaterialUnit, setNewMaterialUnit] = useState('');

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
          setSelectedMaterials([parsedMaterials[0].name]);
        }
      } else {
        // 首次使用，设置默认材质
        setMaterials(DEFAULT_MATERIALS);
        setSelectedMaterials([DEFAULT_MATERIALS[0].name]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MATERIALS));
      }
    } catch (error) {
      console.error('加载材质数据失败:', error);
      setMaterials(DEFAULT_MATERIALS);
      setSelectedMaterials([DEFAULT_MATERIALS[0].name]);
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
    if (!newMaterialName.trim()) {
      alert('请输入有效的材质名称');
      return;
    }

    if (!isValidColor(newMaterialColor)) {
      alert('请输入有效的颜色值，格式如：#FF0000');
      return;
    }

    const newMaterial: Material = {
      id: Date.now().toString(),
      name: newMaterialName.trim(),
      color: newMaterialColor,
      unit: newMaterialUnit.trim() || undefined
    };

    const updatedMaterials = [...materials, newMaterial];
    saveMaterials(updatedMaterials);
    setNewMaterialName('');
    setNewMaterialColor('#0066CC');
    setNewMaterialUnit('');
  };

  // 编辑材质
  const editMaterial = (material: Material) => {
    setEditingMaterial(material);
    setNewMaterialName(material.name);
    setNewMaterialColor(material.color);
    setNewMaterialUnit(material.unit || '');
  };

  // 保存编辑的材质
  const saveEditedMaterial = () => {
    if (!editingMaterial || !newMaterialName.trim()) {
      alert('请输入有效的材质名称');
      return;
    }

    if (!isValidColor(newMaterialColor)) {
      alert('请输入有效的颜色值，格式如：#FF0000');
      return;
    }

    const updatedMaterials = materials.map(material =>
      material.id === editingMaterial.id
        ? { ...material, name: newMaterialName.trim(), color: newMaterialColor, unit: newMaterialUnit.trim() || undefined }
        : material
    );

    saveMaterials(updatedMaterials);

    // 如果编辑的是当前选中的材质，更新选中状态
    if (selectedMaterials.includes(editingMaterial.name)) {
      const newSelectedMaterials = selectedMaterials.map(name =>
        name === editingMaterial.name ? newMaterialName.trim() : name
      );
      setSelectedMaterials(newSelectedMaterials);
    }

    setEditingMaterial(null);
    setNewMaterialName('');
    setNewMaterialColor('#0066CC');
    setNewMaterialUnit('');
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

      // 如果删除的是当前选中的材质，从选中列表中移除
      if (materialToDelete && selectedMaterials.includes(materialToDelete.name)) {
        const newSelectedMaterials = selectedMaterials.filter(name => name !== materialToDelete.name);
        if (newSelectedMaterials.length === 0) {
          setSelectedMaterials([updatedMaterials[0].name]);
        } else {
          setSelectedMaterials(newSelectedMaterials);
        }
      }
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingMaterial(null);
    setNewMaterialName('');
    setNewMaterialColor('#0066CC');
    setNewMaterialUnit('');
  };

  useEffect(() => {
    loadMaterials();

    // 初始化 CSInterface
    if (window.CSInterface) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cs = new (window.CSInterface as any)();
      setCsInterface(cs);
      console.log('CSInterface initialized');
      setMessage('插件已初始化，可以开始使用');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cs as any).evalScript('$.writeln("脚本加载成功")');
    } else {
      console.error('CSInterface not found');
      setMessage('错误：CSInterface 未找到');
    }
  }, []);

  // 处理材质选择变化
  const handleMaterialChange = (materialName: string) => {
    if (selectedMaterials.includes(materialName)) {
      // 如果已经选中，则取消选中
      setSelectedMaterials(selectedMaterials.filter(name => name !== materialName));
      // 同时清除该材质的单位值
      const newUnitValues = { ...unitValues };
      delete newUnitValues[materialName];
      setUnitValues(newUnitValues);
    } else {
      // 如果没有选中，则添加到选中列表
      setSelectedMaterials([...selectedMaterials, materialName]);
    }
  };

  // 处理单个材质的单位值变化
  const handleUnitValueChange = (materialName: string, value: string) => {
    setUnitValues({
      ...unitValues,
      [materialName]: value
    });
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (csInterface as any).evalScript(script, (result: string) => {
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

  // 应用材质功能（用户选择位置版本）
  const applyMaterial = () => {
    if (!csInterface) {
      setMessage('错误：CSInterface 未初始化');
      return;
    }

    if (selectedMaterials.length === 0) {
      setMessage('错误：请选择至少一个材质');
      return;
    }

    // 首先检查是否有选中的对象
    setIsProcessing(true);
    setMessage('检查选中对象...');

    const checkSelectionScript = `
      ${jsonPolyfill}
      
      (function() {
        try {
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
            return JSON.stringify({
              success: true,
              message: "对象选中，请点击画布上的位置来放置文字标注"
            });
          }
        } catch (error) {
          return JSON.stringify({
            success: false,
            message: "检查选中对象时发生错误: " + error.message
          });
        }
      })();
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (csInterface as any).evalScript(checkSelectionScript, (result: string) => {
      setIsProcessing(false);

      if (!result || typeof result !== 'string') {
        setMessage('检查失败：脚本执行无响应');
        return;
      }

      try {
        const response = JSON.parse(result);
        if (response.success) {
          setMessage('请在 Illustrator 画布上点击位置来放置文字标注');
          setIsWaitingForClick(true);

          // 启动点击监听模式
          startClickListening();
        } else {
          setMessage(`错误：${response.message}`);
        }
      } catch {
        setMessage(`检查完成，原始响应: ${result}`);
      }
    });
  };

  // 启动点击监听
  const startClickListening = () => {
    if (!csInterface) return;

    if (selectedMaterials.length === 0) return;

    const clickListenerScript = `
      ${jsonPolyfill}
      
      (function() {
        try {
          var doc = app.activeDocument;
          var selectedItem = doc.selection[0];
          var bounds = selectedItem.geometricBounds;
          
          // 使用模态对话框来获取用户选择的位置
          var dialog = new Window("dialog", "选择文字标注位置");
          dialog.orientation = "column";
          dialog.alignChildren = "fill";
          dialog.preferredSize.width = 400;
          
          var infoPanel = dialog.add("panel", undefined, "说明");
          infoPanel.orientation = "column";
          infoPanel.alignChildren = "left";
          infoPanel.add("statictext", undefined, "请选择文字标注的放置位置：");
          
          var posPanel = dialog.add("panel", undefined, "位置设置");
          posPanel.orientation = "row";
          posPanel.add("statictext", undefined, "X坐标：");
          var xInput = posPanel.add("edittext", undefined, (bounds[2] + 80).toString());
          xInput.characters = 10;
          posPanel.add("statictext", undefined, "Y坐标：");
          var yInput = posPanel.add("edittext", undefined, (bounds[1] - 40).toString());
          yInput.characters = 10;
          
          var presetPanel = dialog.add("panel", undefined, "快速选择");
          presetPanel.orientation = "column";
          presetPanel.alignChildren = "fill";
          
          // 创建十字形布局
          var topRow = presetPanel.add("group");
          topRow.orientation = "row";
          topRow.alignment = "center";
          topRow.add("statictext", undefined, "      "); // 占位
          var topBtn = topRow.add("button", undefined, "上方");
          topBtn.preferredSize.width = 60;
          topRow.add("statictext", undefined, "      "); // 占位
          
          var middleRow = presetPanel.add("group");
          middleRow.orientation = "row";
          middleRow.alignment = "center";
          var leftBtn = middleRow.add("button", undefined, "左侧");
          leftBtn.preferredSize.width = 60;
          middleRow.add("statictext", undefined, "    "); // 中间间隔
          var rightBtn = middleRow.add("button", undefined, "右侧");
          rightBtn.preferredSize.width = 60;
          
          var bottomRow = presetPanel.add("group");
          bottomRow.orientation = "row";
          bottomRow.alignment = "center";
          bottomRow.add("statictext", undefined, "      "); // 占位
          var bottomBtn = bottomRow.add("button", undefined, "下方");
          bottomBtn.preferredSize.width = 60;
          bottomRow.add("statictext", undefined, "      "); // 占位
          
          var margin = 80;
          // 默认文字框尺寸 (66mm x 42mm 转换为点)
          // 1mm = 2.83465 pt
          var textWidth = 66 * 2.83465; // 约187pt
          var textHeight = 42 * 2.83465; // 约119pt
          
          rightBtn.onClick = function() {
            xInput.text = (bounds[2] + margin).toString();
            yInput.text = (bounds[1] - textHeight/2).toString();
          };
          
          leftBtn.onClick = function() {
            xInput.text = (bounds[0] - textWidth - margin).toString();
            yInput.text = (bounds[1] - textHeight/2).toString();
          };
          
          topBtn.onClick = function() {
            xInput.text = ((bounds[0] + bounds[2])/2 - textWidth/2).toString();
            yInput.text = (bounds[1] + textHeight + margin).toString();
          };
          
          bottomBtn.onClick = function() {
            xInput.text = ((bounds[0] + bounds[2])/2 - textWidth/2).toString();
            yInput.text = (bounds[3] - margin).toString();
          };
          
          // 默认设置为右侧
          rightBtn.onClick();
          
          // 添加对象信息显示
          var infoGroup = dialog.add("group");
          infoGroup.orientation = "column";
          infoGroup.alignChildren = "left";
          infoGroup.add("statictext", undefined, "对象边界: " + 
            "左:" + bounds[0].toFixed(1) + " 上:" + bounds[1].toFixed(1) + 
            " 右:" + bounds[2].toFixed(1) + " 下:" + bounds[3].toFixed(1));
          
          var buttonPanel = dialog.add("group");
          buttonPanel.orientation = "row";
          buttonPanel.alignment = "center";
          buttonPanel.spacing = 20;
          
          var okBtn = buttonPanel.add("button", undefined, "确定");
          var cancelBtn = buttonPanel.add("button", undefined, "取消");
          
          okBtn.onClick = function() {
            dialog.close(1);
          };
          
          cancelBtn.onClick = function() {
            dialog.close(0);
          };
          
          var dialogResult = dialog.show();
          
          if (dialogResult === 1) {
            var clickX = parseFloat(xInput.text);
            var clickY = parseFloat(yInput.text);
            
            // 验证输入
            if (isNaN(clickX) || isNaN(clickY)) {
              return JSON.stringify({
                success: false,
                message: "请输入有效的坐标数值"
              });
            }
            
            return JSON.stringify({
              success: true,
              message: "用户选择了位置",
              clickX: clickX,
              clickY: clickY
            });
          } else {
            return JSON.stringify({
              success: false,
              message: "用户取消了操作"
            });
          }
        } catch (error) {
          return JSON.stringify({
            success: false,
            message: "获取点击位置时发生错误: " + error.message,
            stack: error.stack || "无堆栈信息"
          });
        }
      })();
    `;

    setIsProcessing(true);
    setMessage('等待用户选择位置...');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (csInterface as any).evalScript(clickListenerScript, (result: string) => {
      setIsWaitingForClick(false);

      if (!result || typeof result !== 'string') {
        setIsProcessing(false);
        setMessage('获取位置失败：脚本执行无响应');
        return;
      }

      try {
        const response = JSON.parse(result);
        if (response.success) {
          // 用户选择了位置，现在应用材质
          applyMaterialAtPosition(response.clickX, response.clickY);
        } else {
          setIsProcessing(false);
          setMessage(`操作取消：${response.message}`);
        }
      } catch {
        setIsProcessing(false);
        setMessage(`获取位置完成，原始响应: ${result}`);
      }
    });
  };

  // 在指定位置应用材质
  const applyMaterialAtPosition = (clickX: number, clickY: number) => {
    if (!csInterface) return;

    if (selectedMaterials.length === 0) return;

    setMessage('正在应用材质...');

    const script = `
      ${jsonPolyfill}
      
      (function() {
        var debugSteps = [];
        try {
          var doc = app.activeDocument;
          var selection = doc.selection;
          var selectedCount = selection.length;
          
          debugSteps.push("选择对象数量: " + selectedCount);
          
          // 默认文字框尺寸 (66mm x 42mm 转换为点)
          // 1mm = 2.83465 pt
          var textWidth = 66 * 2.83465; // 约187pt
          var textHeight = 42 * 2.83465; // 约119pt
          
          // 计算所有选中对象的总面积
          var totalArea = 0;
          var allBounds = [];
          
          if (selectedCount === 0) {
            return JSON.stringify({
              success: false,
              message: "没有选中任何对象"
            });
          }
          
          for (var i = 0; i < selectedCount; i++) {
            try {
              var item = selection[i];
              if (!item || !item.geometricBounds) {
                continue; // 跳过无效对象
              }
              
              var bounds = item.geometricBounds;
              allBounds.push(bounds);
              
              var width = Math.abs(bounds[2] - bounds[0]);
              var height = Math.abs(bounds[1] - bounds[3]);
              
              // 将点转换为毫米再转换为平方米
              var widthMm = width * 0.352778 * 10;
              var heightMm = height * 0.352778 * 10;
              var areaM2 = widthMm * heightMm / 10000;
              
              totalArea += areaM2;
            } catch (itemError) {
              continue;
            }
          }
          
          if (allBounds.length === 0) {
            return JSON.stringify({
              success: false,
              message: "没有找到有效的对象边界"
            });
          }
          
          debugSteps.push("总面积: " + totalArea.toFixed(2) + " m²");
          
          // 计算所有选中对象的总边界（用于创建线框）
          var minX = allBounds[0][0];
          var maxY = allBounds[0][1];
          var maxX = allBounds[0][2];
          var minY = allBounds[0][3];
          
          for (var i = 1; i < allBounds.length; i++) {
            minX = Math.min(minX, allBounds[i][0]);
            maxY = Math.max(maxY, allBounds[i][1]);
            maxX = Math.max(maxX, allBounds[i][2]);
            minY = Math.min(minY, allBounds[i][3]);
          }
          
          var bounds = [minX, maxY, maxX, minY]; // 总边界
          
          // 创建文本标注
          // 计算总边界的宽高（毫米）
          var totalWidth = Math.abs(bounds[2] - bounds[0]);
          var totalHeight = Math.abs(bounds[1] - bounds[3]);
          var totalWidthMm = totalWidth * 0.352778 * 10;
          var totalHeightMm = totalHeight * 0.352778 * 10;
          
          // 生成材质列表文本
          var selectedMaterialNames = JSON.parse('${JSON.stringify(selectedMaterials)}');
          var materialsData = JSON.parse('${JSON.stringify(materials)}');
          var unitValues = JSON.parse('${JSON.stringify(unitValues)}');
          var materialsList = [];
          
          for (var i = 0; i < selectedMaterialNames.length; i++) {
            var materialName = selectedMaterialNames[i];
            
            // 查找对应材质的单位信息
            var materialUnit = '';
            for (var j = 0; j < materialsData.length; j++) {
              if (materialsData[j].name === materialName && materialsData[j].unit) {
                materialUnit = materialsData[j].unit;
                break;
              }
            }
            
            // 获取该材质的单位值
            var materialUnitValue = unitValues[materialName] || '';
            
            // 根据是否有单位值和单位信息生成显示文本
            var displayText;
            if (materialUnitValue && materialUnit) {
              displayText = materialUnitValue + " " + materialUnit + " " + materialName;
            } else {
              displayText = materialName;
            }
            
            materialsList.push(displayText);
          }
          
          var materialsText = materialsList.join(" + ");
          
          var textContent = materialsText + "\\n" +
                           "宽 * 高: " + totalWidthMm.toFixed(0) + " * " + totalHeightMm.toFixed(0) + " mm\\n" +
                           "面积: " + totalArea.toFixed(2) + " m²";
          
          // 创建RGB颜色（使用第一个材质的颜色）
          var materialsData = JSON.parse('${JSON.stringify(materials)}');
          var firstSelectedMaterial = null;
          for (var j = 0; j < materialsData.length; j++) {
            if (materialsData[j].name === selectedMaterialNames[0]) {
              firstSelectedMaterial = materialsData[j];
              break;
            }
          }
          
          if (!firstSelectedMaterial) {
            firstSelectedMaterial = materialsData[0]; // 使用第一个材质作为默认
          }
          
          var materialColor = new RGBColor();
          materialColor.red = parseInt(firstSelectedMaterial.color.substr(1, 2), 16);
          materialColor.green = parseInt(firstSelectedMaterial.color.substr(3, 2), 16);
          materialColor.blue = parseInt(firstSelectedMaterial.color.substr(5, 2), 16);
          
          var textFrame = doc.textFrames.add();
          textFrame.contents = textContent;
          textFrame.position = [${clickX}, ${clickY}];
          
          // 设置文字属性
          try {
            textFrame.textRange.characterAttributes.size = 20;
            textFrame.textRange.characterAttributes.fillColor = materialColor;
            textFrame.textRange.characterAttributes.textFont = app.textFonts.getByName("PingFangSC-Regular");
            debugSteps.push("字体: PingFangSC-Regular");
          } catch (e) {
            try {
              textFrame.textRange.characterAttributes.textFont = app.textFonts.getByName("PingFang SC");
              debugSteps.push("字体: PingFang SC");
            } catch (e2) {
              try {
                textFrame.textRange.characterAttributes.textFont = app.textFonts.getByName("Helvetica");
                debugSteps.push("字体: Helvetica");
              } catch (e3) {
                debugSteps.push("字体: 系统默认");
              }
            }
          }
          
          // 创建矩形线框围绕对象
          var outlineRect = null;
          var margin = 7; // 线框与对象的间距
          var frameLeft, frameTop, frameRight, frameBottom;
          
          try {
            // 创建矩形线框
            outlineRect = doc.pathItems.add();
            
            // 设置矩形的四个角点
            frameLeft = bounds[0] - margin;
            frameTop = bounds[1] + margin;
            frameRight = bounds[2] + margin;
            frameBottom = bounds[3] - margin;
            
            // 设置矩形路径
            outlineRect.setEntirePath([
              [frameLeft, frameTop],     // 左上角
              [frameRight, frameTop],    // 右上角
              [frameRight, frameBottom], // 右下角
              [frameLeft, frameBottom],  // 左下角
              [frameLeft, frameTop]      // 回到起点，形成闭合路径
            ]);
            
            // 设置线框样式
            outlineRect.stroked = true;
            outlineRect.filled = false;
            outlineRect.strokeColor = materialColor;
            outlineRect.strokeWidth = 1;
            outlineRect.strokeDashes = [];
            outlineRect.strokeOverprint = false;
            
            // 确保线框在最上层
            outlineRect.zOrder(ZOrderMethod.BRINGTOFRONT);
            
            debugSteps.push("线框创建成功");
            
          } catch (outlineError) {
            debugSteps.push("线框创建失败: " + outlineError.message);
          }
          
          // 计算从线框边缘到文字标注的引导线起点
          var frameCenterX = (frameLeft + frameRight) / 2;
          var frameCenterY = (frameTop + frameBottom) / 2;
          var textCenterX = ${clickX};
          var textCenterY = ${clickY} - 40; // 文字框中心
          
          // 计算从线框中心到文字中心的方向
          var deltaX = textCenterX - frameCenterX;
          var deltaY = textCenterY - frameCenterY;
          
          // 计算线框边缘的交点
          var startX, startY;
          
          // 根据角度确定起点（从线框边缘开始）
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // 水平方向为主
            if (deltaX > 0) {
              // 右侧
              startX = frameRight;
              startY = frameCenterY;
            } else {
              // 左侧
              startX = frameLeft;
              startY = frameCenterY;
            }
          } else {
            // 垂直方向为主
            if (deltaY > 0) {
              // 上侧
              startX = frameCenterX;
              startY = frameTop;
            } else {
              // 下侧
              startX = frameCenterX;
              startY = frameBottom;
            }
          }
          
          debugSteps.push("引导线创建成功");
          
          // 创建引导线 - 从线框边缘到文字附近，避免重叠
          var guideLine = doc.pathItems.add();
          
          // 根据文字位置计算合适的引导线终点，避免与文字重叠
          var endX, endY;
          
          // 判断文字相对于对象的位置
          if (deltaX > 0) {
            // 文字在右侧，引导线终点在文字左边缘
            endX = ${clickX} - 15;
            endY = ${clickY} - 40; // 文字中心位置
          } else {
            // 文字在左侧，引导线终点在文字右边缘
            endX = ${clickX} + textWidth + 15;
            endY = ${clickY} - 40;
          }
          
          // 如果文字主要在上方或下方，调整终点位置
          if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY > 0) {
              // 文字在上方，引导线终点在文字下边缘
              endX = ${clickX} + textWidth/2;
              endY = ${clickY} - textHeight - 15;
            } else {
              // 文字在下方，引导线终点在文字上边缘
              endX = ${clickX} + textWidth/2;
              endY = ${clickY} + 15;
            }
          }
          
          guideLine.setEntirePath([
            [startX, startY],
            [endX, endY]
          ]);
          guideLine.stroked = true;
          guideLine.strokeColor = materialColor;
          guideLine.strokeWidth = 2;
          guideLine.strokeDashes = [8, 4];
          
          // 创建箭头
          var arrowSize = 8;
          var arrow = doc.pathItems.add();
          var arrowAngle = Math.atan2(endY - startY, endX - startX);
          var arrowX = endX;
          var arrowY = endY;
          
          arrow.setEntirePath([
            [arrowX, arrowY],
            [arrowX - arrowSize * Math.cos(arrowAngle - Math.PI/6), arrowY - arrowSize * Math.sin(arrowAngle - Math.PI/6)],
            [arrowX - arrowSize * Math.cos(arrowAngle + Math.PI/6), arrowY - arrowSize * Math.sin(arrowAngle + Math.PI/6)],
            [arrowX, arrowY]
          ]);
          arrow.filled = true;
          arrow.fillColor = materialColor;
          arrow.stroked = false;
          
          // 创建分组
          var group = doc.groupItems.add();
          group.name = "Annotation_" + selectedMaterialNames.join("_") + "_" + new Date().getTime();
          
          // 将元素添加到分组
          textFrame.move(group, ElementPlacement.INSIDE);
          guideLine.move(group, ElementPlacement.INSIDE);
          arrow.move(group, ElementPlacement.INSIDE);
          
          // 将矩形线框添加到分组
          if (outlineRect) {
            outlineRect.move(group, ElementPlacement.INSIDE);
          }
          
          // 为所有选中对象添加标签
          for (var i = 0; i < selectedCount; i++) {
            var item = selection[i];
            var tag = item.tags.add();
            tag.name = "AnnotationMaterial";
            tag.value = JSON.stringify({
              materials: selectedMaterialNames,
              unitValues: unitValues,
              area: totalArea,
              color: firstSelectedMaterial.color,
              groupName: group.name,
              textPosition: [${clickX}, ${clickY}],
              timestamp: new Date().getTime(),
              objectCount: selectedCount,
              isMultiSelect: selectedCount > 1
            });
          }
          
          return JSON.stringify({
            success: true,
            message: "成功应用材质和引导线",
            data: {
              materials: selectedMaterialNames,
              unitValues: unitValues,
              objectCount: selectedCount,
              area: (totalArea || 0).toFixed(3),
              color: firstSelectedMaterial.color,
              position: "x:" + ${clickX}.toFixed(1) + ", y:" + ${clickY}.toFixed(1),
              isMultiSelect: selectedCount > 1
            },
            debug: {
              steps: debugSteps
            }
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            message: "应用材质时发生错误: " + error.message,
            debug: {
              steps: debugSteps,
              error: error.toString()
            }
          });
        }
      })();
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (csInterface as any).evalScript(script, (result: string) => {
      setIsProcessing(false);

      if (!result || typeof result !== 'string') {
        setMessage('应用材质失败：脚本执行无响应');
        return;
      }

      try {
        const response = JSON.parse(result);
        if (response.success) {
          setMessage(`成功：${response.message}`);
          // 只在开启调试时显示调试信息
          if (showDebugInfo && response.debug && response.debug.steps) {
            setDebugInfo(response.debug.steps.join('\n'));
          }
        } else {
          setMessage(`错误：${response.message}`);
          // 错误时始终显示调试信息
          if (response.debug && response.debug.steps) {
            setDebugInfo(response.debug.steps.join('\n'));
          }
        }
      } catch {
        setMessage(`应用完成，原始响应: ${result}`);
      }
    });
  };

  // 导出标注功能（简化版）
  const exportAnnotation = () => {
    if (!csInterface) {
      setMessage('错误：CSInterface 未初始化');
      return;
    }

    setIsProcessing(true);
    setMessage('正在导出标注...');

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
                if (tag.name === "AnnotationMaterial") {
                  try {
                    var data = JSON.parse(tag.value);
                    // 兼容旧数据格式
                    var unitValues = data.unitValues;
                    if (!unitValues && data.material && data.unitValue) {
                      unitValues = {};
                      unitValues[data.material] = data.unitValue;
                    } else if (!unitValues) {
                      unitValues = {};
                    }
                    
                    quotedItems.push({
                      layerName: item.name || "未命名对象",
                      materials: data.materials || [data.material], // 兼容旧数据
                      unitValues: unitValues,
                      area: data.area
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
              message: "未找到任何已标注的对象"
            });
          } else {
            // 生成CSV内容
            var csvContent = "图层,材质,单位值,面积(m²)\\n";
            
            for (var i = 0; i < quotedItems.length; i++) {
              var item = quotedItems[i];
              // 生成带单位值的材质文本
              var materialsTextArray = [];
              for (var j = 0; j < item.materials.length; j++) {
                var materialName = item.materials[j];
                var unitValue = item.unitValues[materialName] || '';
                if (unitValue) {
                  materialsTextArray.push(unitValue + " " + materialName);
                } else {
                  materialsTextArray.push(materialName);
                }
              }
              var materialsText = materialsTextArray.join(' + ');
              
              csvContent += item.layerName + "," + 
                           materialsText + "," + 
                           "," + // 空的单位值列（因为已包含在材质文本中）
                           item.area.toFixed(3) + "\\n";
            }
            
            csvContent += "\\n总计," + quotedItems.length + "项,,";
            
            // 生成文件名
            var now = new Date();
            var year = now.getFullYear();
            var month = (now.getMonth() + 1 < 10 ? "0" : "") + (now.getMonth() + 1);
            var day = (now.getDate() < 10 ? "0" : "") + now.getDate();
            var hour = (now.getHours() < 10 ? "0" : "") + now.getHours();
            var minute = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
            
            var fileName = "标注单_" + year + month + day + "_" + hour + minute + ".csv";
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
                message: "标注单已导出到桌面: " + fileName,
                data: {
                  itemCount: quotedItems.length,
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
          message: "导出标注时发生错误: " + error.message,
          error: error.toString()
        });
      }
      })();
    `;

    console.log('Exporting quote');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (csInterface as any).evalScript(script, (result: string) => {
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
        <h2>Illustrator 标注插件</h2>
        <p>选择材质并应用到选中的对象</p>
      </div>

      <div className="plugin-content">
        {/* 调试开关 */}
        <div className="debug-toggle" style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <input
              type="checkbox"
              checked={showDebugInfo}
              onChange={(e) => setShowDebugInfo(e.target.checked)}
            />
            显示调试信息
          </label>
        </div>

        {/* 调试信息 */}
        {showDebugInfo && debugInfo && (
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
          <label>材质类型（可多选）：</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
            {materials.map(material => (
              <div key={material.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                border: selectedMaterials.includes(material.name) ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: selectedMaterials.includes(material.name) ? '#e3f2fd' : 'white'
              }} onClick={() => handleMaterialChange(material.name)}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: material.color,
                  border: '1px solid #ccc',
                  borderRadius: '3px'
                }}></div>
                <span style={{ fontSize: '14px' }}>{material.name}</span>
              </div>
            ))}
          </div>
          {selectedMaterials.length > 0 && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              已选择：{selectedMaterials.join(', ')}
            </div>
          )}
        </div>

        {/* 选中材质的单位值输入 */}
        {selectedMaterials.length > 0 && (
          <div className="form-group">
            <label>为选中材质设置数值：</label>
            <div style={{ marginTop: '8px' }}>
              {selectedMaterials.map(materialName => {
                const material = materials.find(m => m.name === materialName);
                return (
                  <div key={materialName} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    marginBottom: '8px',
                    padding: '8px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: material?.color,
                      border: '1px solid #ccc',
                      borderRadius: '3px'
                    }}></div>
                    <span style={{ minWidth: '80px', fontSize: '14px' }}>{materialName}</span>
                    {material?.unit && (
                      <>
                        <input
                          type="text"
                          value={unitValues[materialName] || ''}
                          onChange={(e) => handleUnitValueChange(materialName, e.target.value)}
                          placeholder="数值"
                          style={{ 
                            width: '80px', 
                            padding: '4px 6px', 
                            border: '1px solid #ddd', 
                            borderRadius: '3px',
                            fontSize: '13px'
                          }}
                        />
                        <span style={{ fontSize: '13px', color: '#666' }}>{material.unit}</span>
                      </>
                    )}
                    {!material?.unit && (
                      <span style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                        （未设置单位）
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <small style={{ color: '#666', fontSize: '11px', display: 'block', marginTop: '4px' }}>
              为有单位的材质输入数值，将显示为：数值 单位 材质名
            </small>
          </div>
        )}


        {/* 材质管理 */}
        <div className="material-management">
          <button
            onClick={() => setShowMaterialManager(!showMaterialManager)}
            className="manage-button"
            style={{ backgroundColor: '#28a745' }}
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
                    type="text"
                    placeholder="默认单位（可选）"
                    value={newMaterialUnit}
                    onChange={(e) => setNewMaterialUnit(e.target.value)}
                    style={{ width: '120px', padding: '5px' }}
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
                    backgroundColor: selectedMaterials.includes(material.name) ? '#e3f2fd' : 'white',
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
                        <strong>{material.name}</strong>{material.unit ? ` (默认单位: ${material.unit})` : ''}
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
          {
            showDebugInfo && (
              <button
                onClick={runDebugTest}
                disabled={isProcessing}
                className="apply-button"
                style={{ backgroundColor: '#6c757d' }}
              >
                {isProcessing ? '测试中...' : '调试测试'}
              </button>
            )
          }

          <button
            onClick={applyMaterial}
            disabled={isProcessing || isWaitingForClick}
            className="apply-button"
            style={{
              backgroundColor: isWaitingForClick ? '#ffc107' : '#007bff',
              cursor: isWaitingForClick ? 'wait' : 'pointer'
            }}
          >
            {isProcessing ? '处理中...' : isWaitingForClick ? '等待选择位置...' : '应用材质'}
          </button>

          <button
            onClick={exportAnnotation}
            disabled={isProcessing}
            className="export-button"
          >
            {isProcessing ? '导出中...' : '导出标注'}
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
            <li>选择材质类型和输入数值</li>
            <li>点击"应用材质"按钮</li>
            <li>完成后点击"导出标注"生成 CSV 文件到桌面</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;