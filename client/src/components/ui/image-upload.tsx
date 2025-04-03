import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, X } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (file: File | null) => void;
  defaultImage?: string;
  className?: string;
}

export function ImageUpload({ onImageSelected, defaultImage, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Không đúng định dạng",
        description: "Vui lòng chọn file hình ảnh",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File quá lớn",
        description: "Kích thước file không được vượt quá 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelected(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageSelected(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`${className || ''}`}>
      <div className="mb-2 flex items-center justify-between">
        <Label htmlFor="image-upload">Hình ảnh</Label>
        {preview && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRemoveImage} 
            className="h-8 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa
          </Button>
        )}
      </div>
      
      <Input
        ref={fileInputRef}
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative rounded-md overflow-hidden border border-border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={handleButtonClick}
          className="w-full h-48 flex flex-col items-center justify-center gap-2 border-dashed"
        >
          <Image className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Nhấn để tải lên hình ảnh</span>
        </Button>
      )}
    </div>
  );
}
