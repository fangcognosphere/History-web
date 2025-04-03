import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileVideo, Upload, X } from "lucide-react";

interface VideoUploadProps {
  onVideoSelected: (file: File | null) => void;
  onExternalLinkChanged: (link: string) => void;
  defaultVideo?: string;
  className?: string;
}

export function VideoUpload({ 
  onVideoSelected, 
  onExternalLinkChanged, 
  defaultVideo, 
  className 
}: VideoUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultVideo || null);
  const [isExternalLink, setIsExternalLink] = useState<boolean>(
    defaultVideo ? !defaultVideo.startsWith('/uploads/') && !defaultVideo.startsWith('data:') : false
  );
  const [externalLink, setExternalLink] = useState<string>(
    isExternalLink && defaultVideo ? defaultVideo : ''
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Không đúng định dạng",
        description: "Vui lòng chọn file video",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File quá lớn",
        description: "Kích thước file không được vượt quá 100MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setIsExternalLink(false);
      setExternalLink('');
    };
    reader.readAsDataURL(file);
    onVideoSelected(file);
    onExternalLinkChanged('');
  };

  const handleExternalLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setExternalLink(link);
    setIsExternalLink(true);
    setPreview(link || null);
    onExternalLinkChanged(link);
    onVideoSelected(null);
  };

  const handleRemoveVideo = () => {
    setPreview(null);
    setExternalLink('');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onVideoSelected(null);
    onExternalLinkChanged('');
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const toggleUploadMethod = () => {
    if (isExternalLink) {
      setIsExternalLink(false);
      onExternalLinkChanged('');
      if (externalLink) {
        setPreview(null);
      }
    } else {
      setIsExternalLink(true);
      onVideoSelected(null);
      if (preview && !externalLink) {
        setPreview(null);
      }
    }
  };

  return (
    <div className={`${className || ''}`}>
      <div className="mb-2 flex items-center justify-between">
        <Label htmlFor="video-upload">Video</Label>
        {preview && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRemoveVideo} 
            className="h-8 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleUploadMethod} 
            type="button"
          >
            {isExternalLink ? "Tải lên file" : "Sử dụng link"}
          </Button>
        </div>
        
        {isExternalLink ? (
          <div>
            <Input
              type="url"
              placeholder="Nhập đường dẫn video (YouTube, Vimeo, v.v.)"
              value={externalLink}
              onChange={handleExternalLinkChange}
            />
            {externalLink && (
              <div className="mt-2 p-3 bg-muted rounded-md text-center">
                <span className="text-sm">Link video: {externalLink}</span>
              </div>
            )}
          </div>
        ) : (
          <>
            <Input
              ref={fileInputRef}
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {preview && preview.startsWith('data:video/') ? (
              <div className="relative rounded-md overflow-hidden border border-border">
                <video controls className="w-full">
                  <source src={preview} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video tag.
                </video>
              </div>
            ) : preview && !isExternalLink ? (
              <div className="relative rounded-md overflow-hidden border border-border">
                <video controls className="w-full">
                  <source src={preview} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video tag.
                </video>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={handleUploadButtonClick}
                className="w-full h-32 flex flex-col items-center justify-center gap-2 border-dashed"
                type="button"
              >
                <FileVideo className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Nhấn để tải lên video</span>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
