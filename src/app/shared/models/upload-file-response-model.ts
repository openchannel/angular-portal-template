export class UploadFileResponseModel {    
    uploadDate: number;
    fileId: string;
    fileName: string;
    contentType: string;
    size: number;
    isPrivate: Boolean;
    mimeCheck: string;
    fileUrl: string; 
    isError: boolean;
    uploadProgress=0;
}
