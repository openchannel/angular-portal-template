import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper/lib/interfaces/image-cropped-event.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadFileService } from '../../services/upload-file.service';
import { base64ToFile } from 'ngx-image-cropper';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { UploadFileResponseModel } from '../../models/upload-file-response-model';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {

  constructor(private modalService: NgbModal,
  private uploadFileService: UploadFileService) { }

  @ViewChild('fileInput', { static: false })
  fileInputVar: ElementRef;

  // image properties
  @Input()
  imageWidth: number;

  @Input()
  imageHeight: number;

  @Input()
  logoControl: AbstractControlDirective | AbstractControl;
  
  isImageCropped = false;
  croppedImage: any = '';
  hasImageLoadError = false;
  cropperFormat = 'png';
  serviceError = '';
  browsedFileEvent: any;
  browsedFile: any;
  fileName = '';
  cropperModalRef: any;
  showBtnLoader = false;
  uploading = false;
  contentType = 'image/*'
  maintainAspectRatio = false;
  aspectRatio: any;
  
  loaderValue = 0;

  @Input()
  resizeToWidth = 0;

  @Input()
  resizeToHeight = 0;

  @Output()
  cancelPopup = new EventEmitter<any>();

  @Input()
  isMultiImage: boolean;

  @Input()
  imageFileObj: any;

  @Input()
  imageFileUrl: any;

  @Output()
  imageFileObjChange = new EventEmitter<any>();

  @Output()
  imageFileUrlChange = new EventEmitter<any>();

  hash = null;
  croppedFileObj: any;
  imageLoadErrorMessage = 'Please provide valid image';
  diffArray = [];
  uploadImageInProcess = false;
  uploadImageResponse : any;
  
  invalidFileDroppedError=null;
  
  
  @Output()
  textEvent = new EventEmitter<any>();

  ngOnInit(): void {
    // console.log('resizeHeight : '+this.resizeToHeight+" resizeWidth : "+this.resizeToWidth);
    this.calculateAspectRatio();
  }

  
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppedFileObj = base64ToFile(event.base64);
  }

  loadImageFailed() {
    this.hasImageLoadError = true;
  }

  fileChangeEvent(event: any, content?): void {
    if(this.logoControl &&
      this.logoControl.errors &&
      (this.logoControl.dirty || this.logoControl.touched)){
        if (this.fileInputVar) {
          this.fileInputVar.nativeElement.value = '';
        }
        if(this.logoControl.errors.appImageFileValidator){
          this.invalidFileDroppedError= this.logoControl.errors.appImageFileValidator.message;
        }        
        this.imageFileUrlChange.emit(this.imageFileObj.fileUrl);
    }else{
      this.invalidFileDroppedError=null;
      this.serviceError = '';
      if (event.target && event.target.files && event.target.files.length > 0) {
        this.browsedFileEvent = event;
        this.browsedFile = event.target.files[0]; //browsedFileData
        this.fileName = event.target.files[0].name;
  
        this.cropperFormat = event.target.files[0].type.split('/')[1];
        this.isImageCropped = true;
          this.cropperModalRef = this.modalService
            .open(content, {
              centered: true,
              backdrop: 'static',
              keyboard: false,
              size:'lg'
            })
            .result.then(
              () => {
                // Do Nothing
              },
              () => {
                this.resetSelection();
              }
            );
        }
    }
      // this.emitValidState(this.fileUrlForm.status);
    }

    resetSelection() {
      this.serviceError = '';
      this.hasImageLoadError = false;
      this.showBtnLoader = false;
      this.uploading = false;
      this.isImageCropped = false;
      this.fileName = '';
      this.croppedImage = '';
      if (this.fileInputVar) {
        this.fileInputVar.nativeElement.value = '';
      }
      this.browsedFileEvent = null;
      this.browsedFile = null;
      this.cancelPopup.emit();
    }
  
    // emitValidState(status) {
    //   const isValid = status === 'VALID' && !this.uploading && !this.isImageCropped;
    //   this.textEvent.emit({
    //     isValid: isValid,
    //     value: this.fileUrlForm.value.fileUrl,
    //     fileData: data,
    //     fieldDefinition: this.inputData.fieldDefinition
    //   });
    // }

    uploadFile(){
      if(!this.hasImageLoadError){
        this.uploadImageInProcess=true;
        let fileToUpload = this.croppedFileObj;
        const formData = new FormData();
        formData.append('file', fileToUpload, this.fileName);
        console.log("found file : "+fileToUpload);
        this.uploadFileService.uploadToOpenchannel(formData, false).subscribe((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            // This is an upload progress event. Compute and show the % done:
            this.loaderValue = Math.round((100 * event.loaded) / event.total) - 5;
          } else if (event.type == HttpEventType.ResponseHeader) {
            this.loaderValue = 97;
          } else if (event.type == HttpEventType.DownloadProgress) {
            this.loaderValue = 99;
          } else if (event instanceof HttpResponse) {
            this.loaderValue = 100;
            this.uploading = false;
  
            this.showBtnLoader = false;
            this.fileName = event.body.name;
            if (this.fileInputVar) {
              this.fileInputVar.nativeElement.value = '';
            }
            this.loaderValue = 0;
            this.uploadImageInProcess = false;
            let imageRes = this.convertResToUploadFile(event);
            this.imageFileObjChange.emit(imageRes);
            this.imageFileUrlChange.emit(imageRes.fileUrl);
            this.modalService.dismissAll();
          }
          
          // this.uploadImageResponse = res;
          // this.uploadSuccess.emit(this.uploadImageResponse);
        },
        (err) => {
          this.uploadImageInProcess = false;
        },
        ()=>{
          this.uploadImageInProcess = false;
        });
      }
    }

    imageLoaded(){

    }

    cropperReady(){

    }

    ngOnDestroy() {
      this.resetSelection();
    }


    calculateAspectRatio() {
     if (this.imageWidth) {
        this.resizeToWidth = this.imageWidth;
      }
  
      if (this.imageWidth && this.imageHeight) {
        this.aspectRatio = this.imageWidth / this.imageHeight;
        this.maintainAspectRatio = true;
      } else {
        this.aspectRatio = 1;
      }
    }

    convertResToUploadFile(res){
      let uploadFileRes = new UploadFileResponseModel();
      uploadFileRes.uploadDate=res.body.uploadDate;
      uploadFileRes.fileId =res.body.fileId;
      uploadFileRes.fileName =res.body.name;
      uploadFileRes.contentType = res.body.contentType;
      uploadFileRes.size = res.body.size;
      uploadFileRes.isPrivate = res.body.isPrivate;
      uploadFileRes.mimeCheck = res.body.mimeCheck;
      uploadFileRes.fileUrl = res.body.fileUrl;
      uploadFileRes.isError = res.body.isError;
      return uploadFileRes;
    }
 }
