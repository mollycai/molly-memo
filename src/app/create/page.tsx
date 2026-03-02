"use client";

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { useEditorStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { X, Wand2, ChevronLeft, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CreatePage() {
  const router = useRouter();
  const { uploadedImage, setUploadedImage, isGenerating, setIsGenerating, setGeneratedCaption } = useEditorStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [setUploadedImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedImage(null);
  };

  const handleGenerate = async () => {
    if (!uploadedImage) return;
    
    setIsGenerating(true);
    setGeneratedCaption('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: uploadedImage }),
      });

      const data: { caption: string } = await response.json();

      if (!response.ok) {
        throw new Error('AI 生成失败，请稍后重试');
      }

      setGeneratedCaption(data.caption);
      router.push('/editor');
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('AI 生成失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDirectEdit = () => {
    if (!uploadedImage) return;
    setGeneratedCaption('');
    router.push('/editor');
	};
	
  // 使用 public 下的示例图片，转为 Data URL 复用现有上传/生成流程
  const handleExamplePic = async () => {
    try {
      const response = await fetch('/example-meme.png');
      if (!response.ok) {
        throw new Error('加载示例图片失败');
      }

      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result as string);
        } else {
          toast.error('加载示例图片失败');
        }
      };
      reader.onerror = () => {
        toast.error('加载示例图片失败');
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Load example image failed:', error);
      toast.error('加载示例图片失败');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-8">
      <main className="w-full max-w-[480px] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <header className="flex items-center justify-between w-full mb-2">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-secondary/80" asChild>
            <Link href="/">
              <ChevronLeft className="h-6 w-6 text-foreground/80" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold tracking-tight">上传图片</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Upload Area */}
        <div className="flex-1 flex flex-col gap-6">
          <div
            {...getRootProps()}
            className={cn(
              "relative group cursor-pointer transition-all duration-300 ease-out",
              "rounded-3xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-secondary/30",
              "flex flex-col items-center justify-center text-center gap-4 p-8 min-h-[400px]",
              isDragActive && "border-primary bg-primary/5 scale-[1.02]",
              uploadedImage ? "border-none p-0 overflow-hidden bg-black/5 dark:bg-white/5" : "bg-card/50"
            )}
          >
            <input {...getInputProps()} />
            
            {uploadedImage ? (
              <div className="relative w-full h-full min-h-[400px] flex items-center justify-center group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={uploadedImage} 
                  alt="Uploaded preview" 
                  className="w-full h-full object-contain max-h-[600px] rounded-3xl"
                />
                
                <div className="absolute top-4 right-4 z-10">
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-9 w-9 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl pointer-events-none">
                   <p className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                     点击更换图片
                   </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground mb-2 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <UploadCloud size={36} strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {isDragActive ? "释放以上传" : "点击或拖拽上传"}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                    支持 JPG, PNG, WEBP <br/>
                    最大 5MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-auto pb-8 flex flex-col gap-3">
            <Button 
              size="lg" 
              className={cn(
                "w-full rounded-full h-14 text-base font-medium shadow-lg hover:shadow-xl transition-all",
                !uploadedImage && "opacity-50 cursor-not-allowed bg-secondary text-muted-foreground hover:bg-secondary shadow-none"
              )}
              disabled={!uploadedImage || isGenerating}
              onClick={handleGenerate}
            >
              {isGenerating ? (
                <>
                  <Wand2 className="mr-2 h-5 w-5 animate-spin" />
                  AI 思考中...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  生成配文
                </>
              )}
            </Button>

            {uploadedImage && !isGenerating && (
              <Button 
                variant="ghost"
                size="lg"
                className="w-full rounded-full h-14 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                onClick={handleDirectEdit}
              >
                跳过 AI，直接编辑
              </Button>
            )}
            
            {!uploadedImage && (
              <p className="text-xs text-center text-muted-foreground mt-4">
                或者先 <span className="underline cursor-pointer hover:text-foreground" onClick={handleExamplePic}>试试示例图片</span>
              </p>
            )}
          </div>
        </div>


      </main>
    </div>
  );
}
