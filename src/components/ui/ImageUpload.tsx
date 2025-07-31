import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  bucket: string;
  onUpload: (url: string) => void;
  currentImage?: string;
  className?: string;
  accept?: string;
  maxSize?: number; // في MB
}

const ImageUpload = ({ 
  bucket, 
  onUpload, 
  currentImage, 
  className,
  accept = "image/*",
  maxSize = 5
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // التحقق من حجم الملف
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "خطأ",
        description: `حجم الملف كبير جداً. الحد الأقصى هو ${maxSize} ميجابايت`,
        variant: "destructive"
      });
      return;
    }

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطأ",
        description: "يجب أن يكون الملف صورة",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // إنشاء اسم فريد للملف
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // رفع الملف إلى Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // الحصول على الرابط العام
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onUpload(publicUrl);

      toast({
        title: "تم الرفع بنجاح",
        description: "تم رفع الصورة بنجاح"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "خطأ في الرفع",
        description: "لم نتمكن من رفع الصورة، حاول مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl("");
    onUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-border"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                تغيير
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                disabled={uploading}
              >
                <X className="w-4 h-4 mr-2" />
                حذف
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 cursor-pointer transition-colors"
        >
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">اضغط لرفع صورة</p>
          <p className="text-sm text-muted-foreground">
            PNG, JPG, WEBP حتى {maxSize}MB
          </p>
        </div>
      )}

      {uploading && (
        <div className="text-center">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            جاري الرفع...
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;