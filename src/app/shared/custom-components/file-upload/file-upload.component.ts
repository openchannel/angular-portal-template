import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { UploadFileResponseModel } from '../../models/upload-file-response-model';
import { DownloadFileService } from '../../services/download-file.service';
import { UploadFileService } from '../../services/upload-file.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';
import { ImageFileValidatorDirective } from '../image-file-validator.directive';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  constructor(
    private uploadFileService: UploadFileService,
    private downloadFileService: DownloadFileService) { }

  @ViewChild('fileInput') fileInput: any;

  @Input()
  btnLable = "Upload File";

  @Input()
  fileDetail = null;

  @Input()
  fileId=null;

  @Output()
  fileIdChange = new EventEmitter<any>();

  @Input()
  fileUrl=null;

  @Output()
  fileUrlChange = new EventEmitter<any>();

  @Input()
  isDownloadable='true';
  
  @Input()
  isDeletable='true';

  @Input()
  accept="*";

  @Input()
  isImageUploader='false';

  @Input()
  isMultiFile="false";

  @Input()
  isPrivate="true";

  @Input()
  imageOnly=false;

  @Input()
  disabled = false;

  tmpField=null;

  @Output()
  fileDetailChange = new EventEmitter<any>();
  
  @Input()
  fileControl: AbstractControlDirective | AbstractControl;
  

  uploadInProcess=false;
  uploadFileReq=null;
  invalidFileDroppedError=null;

  ngOnInit(): void {
    console.log("accept : "+this.accept);
  }

  fileDropped(uoloadFile, event){

    if(this.disabled){
      return;
    }
    if(this.imageOnly){
      let errors = new ImageFileValidatorDirective().validate({value:event[0].name});    
      if(errors && errors.appImageFileValidator){
        this.invalidFileDroppedError= errors.appImageFileValidator.message;
      }else{
        this.uploadFile(uoloadFile, event);
      }    
    }else{
      this.uploadFile(uoloadFile, event);
    }
  }

  /**
   * Upload the file using drag and drop or file upload feature
   * @param event 
   */
  uploadFile(uoloadFile, event) {

    if(this.imageOnly && event[0]){
      let errors = new ImageFileValidatorDirective().validate({value:event[0].name});
      if(errors && errors.appImageFileValidator){
        this.invalidFileDroppedError= errors.appImageFileValidator.message;
        let tmpFileUrlArr = this.fileDetail.map(a => a.fileUrl);
        let tmpFileIdArr  = this.fileDetail.map(a => a.fileId);  
        this.fileDetailChange.emit(this.fileDetail);
        this.fileIdChange.emit(tmpFileIdArr);
        this.fileUrlChange.emit(tmpFileUrlArr);        
        return;
      }
    }

    this.invalidFileDroppedError=null;
    if(this.fileControl &&
      this.fileControl.errors &&
      (this.fileControl.dirty || this.fileControl.touched)){
        if(this.fileControl.errors.required){
          let tmpFileUrlArr = this.fileDetail.map(a => a.fileUrl);
          let tmpFileIdArr  = this.fileDetail.map(a => a.fileId);  
          this.fileDetailChange.emit(this.fileDetail);
          this.fileIdChange.emit(tmpFileIdArr);
          this.fileUrlChange.emit(tmpFileUrlArr);        
        }
    }else{
      if(event[0]){
        const file = event[0];
        this.uploadInProcess = true;
        let tempFileDetails = new UploadFileResponseModel();
        tempFileDetails.fileName = file.name;
        let lastIndex=0;
        if(this.isMultiFile === 'true'){
          if(!this.fileDetail || this.fileDetail.length === 0){
            this.fileDetail=[];
            this.fileId=[];
            this.fileUrl=[];
          }
          this.fileDetail.push(tempFileDetails);
          lastIndex = this.fileDetail.length-1;
          this.uploadMultiFileToOpenChannel(file, lastIndex);
        }else{
          this.fileDetail = tempFileDetails;
          this.uploadFileToOpenChannel(file);
        }
  
      }
    }
  }
  
  uploadFileToOpenChannel(file){
    let formData: FormData = new FormData();
    formData.append('file', file);
    let tempPrivate = this.isPrivate === 'true'?true:false;
    this.uploadFileReq = this.uploadFileService.uploadToOpenchannel(formData,tempPrivate).subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.fileDetail.uploadProgress = Math.round((100 * event.loaded) / event.total) - 5;
        } else if (event.type == HttpEventType.ResponseHeader) {
          this.fileDetail.uploadProgress = 97;
        } else if (event.type == HttpEventType.DownloadProgress) {
          this.fileDetail.uploadProgress = 99;
        } else if (event instanceof HttpResponse) {
          let fileRes = this.uploadFileService.convertFileResponseToUploadFileModel(event);
          this.fileDetail = fileRes;
          this.uploadInProcess = false;
          this.uploadFileReq =null;
          this.fileDetailChange.emit(this.fileDetail);
          this.fileIdChange.emit(this.fileDetail.fileId);
          this.fileUrlChange.emit(this.fileDetail.fileUrl);
          if(this.fileInput){
            this.fileInput.nativeElement.value = '';
          }
        }
      },
      (err) => {
        this.uploadInProcess = false;
        if(this.fileInput){
          this.fileInput.nativeElement.value = '';
        }
      },
      ()=>{
        this.uploadInProcess = false;
        if(this.fileInput){
          this.fileInput.nativeElement.value = '';
        }
      });
  }


  uploadMultiFileToOpenChannel(file, lastIndex){
    let formData: FormData = new FormData();
    formData.append('file', file);
    let tempPrivate = this.isPrivate === 'true'?true:false;
    this.uploadFileReq = this.uploadFileService.uploadToOpenchannel(formData,tempPrivate).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.fileDetail[lastIndex].uploadProgress = Math.round((100 * event.loaded) / event.total) - 5;
      } else if (event.type == HttpEventType.ResponseHeader) {
        this.fileDetail[lastIndex].uploadProgress = 97;
      } else if (event.type == HttpEventType.DownloadProgress) {
        this.fileDetail[lastIndex].uploadProgress = 99;
      } else if (event instanceof HttpResponse) {
        let fileRes = this.uploadFileService.convertFileResponseToUploadFileModel(event);
        // this.fileUrl.push(fileRes.fileUrl);
        // this.fileId.push(fileRes.fileId);
        this.fileDetail[lastIndex] = fileRes;

        let tmpFileUrlArr = this.fileDetail.map(a => a.fileUrl);
        let tmpFileIdArr  = this.fileDetail.map(a => a.fileId);

        this.fileDetailChange.emit(this.fileDetail);
        this.fileIdChange.emit(tmpFileIdArr);
        this.fileUrlChange.emit(tmpFileUrlArr);
        
        this.uploadInProcess = false;
      }
    },
    (err) => {
      this.uploadInProcess = false;
    },
    ()=>{
      this.uploadInProcess = false;
    });
  }
  /***
   * This method is used to download the financial audit report.
   */
  downloadUploadedFiles(fileId) {
    this.downloadFileService.downloadFileDetails(fileId).subscribe((res) => {
      if (res && res.fileUrl) {
        window.open(res.fileUrl, "_blank");
        // this.downloadFileService.downloadFileFromUrl(res.fileUrl).subscribe();
      }
    },
      (res) => {
        console.error("Error in downloadUploadedFiles");
      });
  }

  /***
   * This method is used to download the financial audit report.
   */
  downloadFile(fileObj) {
    if(this.isPrivate){
      this.downloadUploadedFiles(fileObj.fileId);
    }else{
      if (fileObj.fileUrl) {
        window.open(fileObj.fileUrl, "_blank");
      }
    }
  }

/**
   * This method is used to delete the file from all input files
   */
  deleteFromMultiFile(index) {
    if(this.isMultiFile){
      let isCancel = index === this.fileDetail.length -1;
      if(this.uploadInProcess && this.uploadFileReq && isCancel){
        this.uploadFileReq.unsubscribe();
        this.uploadFileReq=null;
        this.uploadInProcess = false;
      }
      
      this.fileDetail.splice(index,1); 
      let tmpFileUrlArr = this.fileDetail.map(a => a.fileUrl);
      let tmpFileIdArr  = this.fileDetail.map(a => a.fileId);

      this.fileDetailChange.emit(this.fileDetail);
      this.fileIdChange.emit(tmpFileIdArr);
      this.fileUrlChange.emit(tmpFileUrlArr);
    }
    this.invalidFileDroppedError=null;
  }
  /**
   * Delete the file from file List 
   * @param index 
   */
  removeAttachment() {
    if(this.uploadInProcess && this.uploadFileReq ){
      this.uploadFileReq.unsubscribe();
      this.uploadFileReq=null;
      this.uploadInProcess = false;
    }
    // this.fileDetailChange.emit(null);
    // this.fileIdChange.emit(null);
    // this.fileUrlChange.emit(null);
    this.fileDetailChange.emit([]);
    this.fileIdChange.emit([]);
    this.fileUrlChange.emit([]);
    this.invalidFileDroppedError=null;
  }
}
