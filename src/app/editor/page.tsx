"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/lib/store";
import * as fabric from "fabric";
import { cn, isMobileDevice } from "@/lib/utils";

import { CanvasMainArea } from "./components/CanvasMainArea";
import { EditorHeader } from "./components/EditorHeader";
import { EditorToolbar } from "./components/EditorToolbar";
import { TextSettingsPanel } from "./components/TextSettingsPanel";
import { MobileSaveModal } from "./components/MobileSaveModal";

const PRESET_COLORS = [
  "#ffffff", // White
  "#000000", // Black
  "#ef4444", // Red
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#84cc16", // Lime
  "#22c55e", // Green
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#a855f7", // Purple
  "#ec4899", // Pink
];

export default function EditorPage() {
  const router = useRouter();
  const { uploadedImage, generatedCaption } = useEditorStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [editText, setEditText] = useState("");
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [saveModalImage, setSaveModalImage] = useState<string | null>(null);

  // Undo History State
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);
  const isHistoryLocked = useRef(false);
  const historyRef = useRef<string[]>([]);
  const historyStepRef = useRef<number>(-1);
  const isWorkUnsaved = useRef(false);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  // Text Style States
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    if (!uploadedImage) {
      router.replace("/create");
    }
  }, [uploadedImage, router]);

  // History Helper Functions
  const saveHistory = useCallback((currentCanvas?: fabric.Canvas) => {
    const canvasToSave = currentCanvas || fabricRef.current;
    if (!canvasToSave || isHistoryLocked.current) return;

    const currentHistory = historyRef.current;
    const currentStep = historyStepRef.current;
    const json = JSON.stringify(canvasToSave.toJSON());

    if (currentStep >= 0 && currentHistory[currentStep] === json) {
      return;
    }

    const newHistory = currentHistory.slice(0, currentStep + 1);
    newHistory.push(json);

    historyRef.current = newHistory;
    historyStepRef.current = newHistory.length - 1;
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    isWorkUnsaved.current = false;
  }, []);

  const handleUndo = async () => {
    if (historyStepRef.current <= 0 || !fabricCanvas) return;

    isHistoryLocked.current = true;
    const prevStep = historyStepRef.current - 1;
    const json = historyRef.current[prevStep];

    try {
      await fabricCanvas.loadFromJSON(JSON.parse(json));
      fabricCanvas.renderAll();

      historyStepRef.current = prevStep;
      setHistoryStep(prevStep);

      setActiveObject(null);
      setShowTextEditor(false);
      isWorkUnsaved.current = false;
    } catch (error) {
      console.error("Undo failed:", error);
    } finally {
      isHistoryLocked.current = false;
    }
  };

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !uploadedImage) return;

    let isMounted = true;

    // Load Image to get dimensions
    const imgElement = new Image();
    imgElement.src = uploadedImage;
    imgElement.onload = () => {
      if (!isMounted || !containerRef.current || !canvasRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // Calculate canvas dimensions to fit image aspect ratio
      const imgAspectRatio = imgElement.width / imgElement.height;
      const containerAspectRatio = containerWidth / containerHeight;

      let canvasWidth, canvasHeight;
      let scale;

      if (imgAspectRatio > containerAspectRatio) {
        // Image is wider than container
        canvasWidth = containerWidth;
        canvasHeight = containerWidth / imgAspectRatio;
        scale = canvasWidth / imgElement.width;
      } else {
        // Image is taller than container
        canvasHeight = containerHeight;
        canvasWidth = containerHeight * imgAspectRatio;
        scale = canvasHeight / imgElement.height;
      }

      // Dispose existing canvas if any
      if (fabricRef.current) {
        fabricRef.current.dispose();
      }

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: "#f3f4f6",
        selection: true,
      });
      fabricRef.current = canvas;
      setFabricCanvas(canvas);

      // Reset History
      setHistory([]);
      setHistoryStep(-1);
      historyRef.current = [];
      historyStepRef.current = -1;

      // Add Image
      const imgInstance = new fabric.Image(imgElement);
      imgInstance.set({
        scaleX: scale,
        scaleY: scale,
        originX: "left",
        originY: "top",
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
      });

      canvas.add(imgInstance);

      // Add Caption Text
      if (generatedCaption) {
        const text = new fabric.Textbox(generatedCaption, {
          left: canvasWidth / 2,
          top: canvasHeight - canvasHeight * 0.15,
          originX: "center",
          originY: "center",
          width: canvasWidth * 0.8,
          fontSize: Math.max(20, canvasWidth * 0.05),
          fontFamily: "PingFang SC",
          fontWeight: "bold",
          fill: "white",
          stroke: "black",
          strokeWidth: 0,
          textAlign: "center",
          shadow: new fabric.Shadow({
            color: "rgba(0,0,0,0.5)",
            blur: 4,
            offsetX: 2,
            offsetY: 2,
          }),
          editable: false,
          cornerStyle: "circle",
          cornerColor: "#ffffff",
          transparentCorners: false,
          borderColor: "#2563eb",
        });
        canvas.add(text);
        canvas.setActiveObject(text);
      }

      canvas.renderAll();

      // Initialize History
      const json = JSON.stringify(canvas.toJSON());
      historyRef.current = [json];
      historyStepRef.current = 0;
      setHistory([json]);
      setHistoryStep(0);

      // Event Listeners
      const updateSelection = (selected: fabric.Object | undefined) => {
        if (selected && selected.type === "textbox") {
          const textbox = selected as fabric.Textbox;
          setActiveObject(selected);
          setEditText(textbox.text);
          setFontSize(textbox.fontSize || 24);
          setTextColor(textbox.fill as string);
          setStrokeWidth(textbox.strokeWidth || 0);
          setStrokeColor((textbox.stroke as string) || "#000000");
          setIsBold(textbox.fontWeight === "bold");
          setIsItalic(textbox.fontStyle === "italic");
          setIsUnderline(!!textbox.underline);
        }
      };

      canvas.on("selection:created", (e) => updateSelection(e.selected?.[0]));
      canvas.on("selection:updated", (e) => updateSelection(e.selected?.[0]));
      canvas.on("selection:cleared", () => {
        if (isWorkUnsaved.current) {
          saveHistory(canvas);
        }
        setActiveObject(null);
        setShowTextEditor(false);
      });
      canvas.on("object:modified", () => saveHistory(canvas));
      canvas.on("object:added", () => saveHistory(canvas));
      canvas.on("object:removed", () => saveHistory(canvas));

      // Double Click Handler
      let lastClickTime = 0;
      canvas.on("mouse:down", (e) => {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime;
        
        // 300ms threshold for double tap/click
        if (timeDiff < 300 && timeDiff > 0) {
          if (e.target && e.target.type === "textbox") {
             setShowTextEditor(true);
          }
        }
        lastClickTime = currentTime;
      });
    };

    return () => {
      isMounted = false;
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
        setFabricCanvas(null);
      }
    };
  }, [uploadedImage, generatedCaption, saveHistory]);

  // Add Text Handler
  const addText = () => {
    if (!fabricCanvas) return;
    const text = new fabric.Textbox("双击编辑文字", {
      left: fabricCanvas.width! / 2,
      top: fabricCanvas.height! / 2,
      originX: "center",
      originY: "center",
      width: fabricCanvas.width! * 0.6,
      fontSize: Math.max(20, fabricCanvas.width! * 0.05),
      fontFamily: "PingFang SC",
      fontWeight: "bold",
      fill: "white",
      stroke: "black",
      strokeWidth: 0,
      textAlign: "center",
      shadow: new fabric.Shadow({
        color: "rgba(0,0,0,0.5)",
        blur: 4,
        offsetX: 2,
        offsetY: 2,
      }),
      editable: false,
      cornerStyle: "circle",
      cornerColor: "#ffffff",
      transparentCorners: false,
      borderColor: "#2563eb",
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();

    setActiveObject(text);
    setEditText("双击编辑文字");
    setShowTextEditor(true);
  };

  const handleTextChange = (newText: string) => {
    setEditText(newText);
    if (fabricCanvas && activeObject && activeObject.type === "textbox") {
      (activeObject as fabric.Textbox).set("text", newText);
      fabricCanvas.renderAll();
      isWorkUnsaved.current = true;
    }
  };

  const triggerCanvasChange = () => {
    if (fabricCanvas) {
      fabricCanvas.fire('object:modified');
    }
  }

  const updateTextStyle = (key: string, value: string | number | boolean) => {
    if (fabricCanvas && activeObject && activeObject.type === "textbox") {
      (activeObject as fabric.Textbox).set(key, value);
      fabricCanvas.renderAll();
      triggerCanvasChange(); 
    }
  };

  const handleFontSizeChange = (val: number[]) => {
    setFontSize(val[0]);
    updateTextStyle("fontSize", val[0]);
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    updateTextStyle("fill", color);
  };

  const handleStrokeWidthChange = (val: number[]) => {
    setStrokeWidth(val[0]);
    updateTextStyle("strokeWidth", val[0]);
    if (val[0] > 0 && !activeObject?.stroke) {
      updateTextStyle("stroke", strokeColor);
    }
  };

  const toggleBold = () => {
    const newVal = !isBold;
    setIsBold(newVal);
    updateTextStyle("fontWeight", newVal ? "bold" : "normal");
  };

  const toggleItalic = () => {
    const newVal = !isItalic;
    setIsItalic(newVal);
    updateTextStyle("fontStyle", newVal ? "italic" : "normal");
  };

  const toggleUnderline = () => {
    const newVal = !isUnderline;
    setIsUnderline(newVal);
    updateTextStyle("underline", newVal);
  };

  const toggleOrientation = () => {
    const newVal = !isVertical;
    setIsVertical(newVal);

    if (fabricCanvas && activeObject && activeObject.type === "textbox") {
      const textbox = activeObject as fabric.Textbox;
      if (newVal) {
        textbox.set("splitByGrapheme", true);
        textbox.set("width", textbox.fontSize);
      } else {
        textbox.set("splitByGrapheme", false);
        textbox.set("width", fabricCanvas.width! * 0.8);
      }
      fabricCanvas.renderAll();
      triggerCanvasChange();
    }
  };

  const handleDeleteText = () => {
    if (fabricCanvas && activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      setShowTextEditor(false);
      setActiveObject(null);
    }
  };

  const handleDownload = async () => {
    if (!fabricCanvas) return;
    
    // 1. 准备高清晰度图片数据
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();

    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 3, // 提高清晰度以适应手机屏幕
    });
    
    // 2. 移动端：展示长按保存弹窗
    if (isMobileDevice()) {
      setSaveModalImage(dataURL);
      return;
    }

    // 3. PC端：直接下载
    const fileName = `molly-emoji-${Date.now()}.png`;
    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!uploadedImage) return null;

  return (
    <div className="h-full bg-background flex flex-col items-center p-4 sm:p-8 overflow-hidden">
      <main className="h-full w-full max-w-[480px] flex flex-col gap-6 animate-in fade-in duration-500 h-[calc(100vh-4rem)] relative">
        <EditorHeader onDownload={handleDownload} />

        {saveModalImage && (
          <MobileSaveModal
            imageUrl={saveModalImage}
            onClose={() => setSaveModalImage(null)}
          />
        )}

        <div
          className={cn(
            "flex-1 flex flex-col transition-all duration-300 ease-in-out",
            showTextEditor && activeObject ? "overflow-y-auto" : "overflow-hidden"
          )}
        >
          <div
            className={cn(
              "flex-shrink-0 flex items-center justify-center relative transition-all duration-300",
              showTextEditor && activeObject ? "min-h-[300px]" : "h-full"
            )}
          >
             <CanvasMainArea
              containerRef={containerRef as React.RefObject<HTMLDivElement>}
              canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
            />
          </div>
        </div>

        <div className="shrink-0 transition-all duration-300 ease-in-out">
          {showTextEditor && activeObject ? (
            <TextSettingsPanel
              editText={editText}
              onTextChange={handleTextChange}
              textColor={textColor}
              onColorChange={handleColorChange}
              fontSize={fontSize}
              onFontSizeChange={handleFontSizeChange}
              strokeWidth={strokeWidth}
              onStrokeWidthChange={handleStrokeWidthChange}
              isBold={isBold}
              onToggleBold={toggleBold}
              isItalic={isItalic}
              onToggleItalic={toggleItalic}
              isUnderline={isUnderline}
              onToggleUnderline={toggleUnderline}
              isVertical={isVertical}
              onToggleVertical={toggleOrientation}
              onDelete={handleDeleteText}
              onClose={() => {
                if (fabricCanvas) {
                  fabricCanvas.discardActiveObject();
                  fabricCanvas.renderAll();
                }
                setShowTextEditor(false);
              }}
              presetColors={PRESET_COLORS}
            />
          ) : (
            <EditorToolbar
              onAddText={addText}
              onAddSticker={() => {
                console.log("Add sticker clicked");
              }}
              onDownload={handleDownload}
              onUndo={handleUndo}
              canUndo={historyStep > 0}
            />
          )}
        </div>
      </main>
    </div>
  );
}
