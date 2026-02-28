"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  X,
  Check,
  Bold,
  Italic,
  Underline,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TextSettingsPanelProps {
  editText: string;
  onTextChange: (text: string) => void;
  textColor: string;
  onColorChange: (color: string) => void;
  fontSize: number;
  onFontSizeChange: (val: number[]) => void;
  strokeWidth: number;
  onStrokeWidthChange: (val: number[]) => void;
  isBold: boolean;
  onToggleBold: () => void;
  isItalic: boolean;
  onToggleItalic: () => void;
  isUnderline: boolean;
  onToggleUnderline: () => void;
  isVertical: boolean;
  onToggleVertical: () => void;
  onDelete: () => void;
  onClose: () => void;
  presetColors: string[];
}

const EditableNumberInput = ({
  value,
  min,
  max,
  onChange,
  suffix = "",
}: {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  suffix?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());

  useEffect(() => {
    setTempValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    let num = parseFloat(tempValue);
    if (isNaN(num)) {
      setTempValue(value.toString()); // Revert to original
    } else {
      if (num < min) num = min;
      if (num > max) num = max;
      onChange(num);
      setTempValue(num.toString());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  if (isEditing) {
    return (
      <Input
        type="number"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-6 w-16 text-[10px] px-1 py-0 bg-background border-primary focus:ring-1 focus:ring-primary"
        autoFocus
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className="text-[10px] font-medium tabular-nums bg-secondary/50 px-2 py-0.5 rounded cursor-pointer hover:bg-secondary/80 hover:text-primary transition-colors select-none"
      title="双击编辑数值"
    >
      {Math.round(value * 10) / 10}
      {suffix}
    </span>
  );
};

export function TextSettingsPanel({
  editText,
  onTextChange,
  textColor,
  onColorChange,
  fontSize,
  onFontSizeChange,
  strokeWidth,
  onStrokeWidthChange,
  isBold,
  onToggleBold,
  isItalic,
  onToggleItalic,
  isUnderline,
  onToggleUnderline,
  isVertical,
  onToggleVertical,
  onDelete,
  onClose,
  presetColors,
}: TextSettingsPanelProps) {
  // Removed Draggable wrapper and positioning styles
  return (
    <div className="w-full bg-secondary/30 backdrop-blur-xl rounded-2xl animate-in slide-in-from-bottom-4 duration-300 flex flex-col overflow-hidden border border-white/20">
      {/* Header: Input & Actions */}
      <div className="flex items-center gap-2 p-3 border-b border-white/10 shrink-0 bg-background/40">
        <Input
          value={editText}
          onChange={(e) => onTextChange(e.target.value)}
          className="flex-1 h-9 bg-secondary/50 border-transparent focus:border-primary focus:ring-0 rounded-xl text-sm"
          placeholder="输入文字..."
          autoFocus
        />
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
          onClick={onDelete}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
          onClick={onClose}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="p-4 space-y-5 overflow-y-auto max-h-[40vh]">
        {/* Colors */}
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            颜色
          </Label>
          <div className="flex flex-wrap gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                className={cn(
                  "w-6 h-6 rounded-full border border-black/10 transition-all hover:scale-110 shadow-sm",
                  textColor === color &&
                    "ring-2 ring-primary ring-offset-2 scale-110"
                )}
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
              />
            ))}
          </div>
        </div>

        {/* Typography Toggles */}
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            样式
          </Label>
          <div className="flex gap-2 justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleBold}
              className={cn(
                "rounded-xl h-10 w-10 flex-1 border transition-all duration-200",
                isBold
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
                  : "bg-background/50 text-muted-foreground border-transparent hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleItalic}
              className={cn(
                "rounded-xl h-10 w-10 flex-1 border transition-all duration-200",
                isItalic
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
                  : "bg-background/50 text-muted-foreground border-transparent hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleUnderline}
              className={cn(
                "rounded-xl h-10 w-10 flex-1 border transition-all duration-200",
                isUnderline
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
                  : "bg-background/50 text-muted-foreground border-transparent hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <Underline className="h-4 w-4" />
            </Button>
            <div className="w-[1px] bg-border/50 h-6 self-center" />
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleVertical}
              className={cn(
                "rounded-xl h-10 w-10 flex-1 border transition-all duration-200",
                isVertical
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
                  : "bg-background/50 text-muted-foreground border-transparent hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              {isVertical ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                字号
              </Label>
              <EditableNumberInput
                value={fontSize}
                min={12}
                max={120}
                onChange={(val) => onFontSizeChange([val])}
                suffix="px"
              />
            </div>
            <Slider
              value={[fontSize]}
              min={12}
              max={120}
              step={1}
              onValueChange={onFontSizeChange}
              className="py-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                描边
              </Label>
              <EditableNumberInput
                value={strokeWidth}
                min={0}
                max={10}
                onChange={(val) => onStrokeWidthChange([val])}
                suffix="px"
              />
            </div>
            <Slider
              value={[strokeWidth]}
              min={0}
              max={10}
              step={0.5}
              onValueChange={onStrokeWidthChange}
              className="py-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
