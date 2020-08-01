import { Component, OnInit } from '@angular/core';
import { FileDetails } from 'oc-ng-common-service';
import { DomSanitizer } from '@angular/platform-browser';
import FroalaEditor from 'froala-editor';

@Component({
  selector: 'app-app-new',
  templateUrl: './app-new.component.html',
  styleUrls: [
    './app-new.component.scss']
})
export class AppNewComponent implements OnInit {

  files: FileDetails[] = [];

  defaultFileIcon = '';
  defaultfile = '';
  icons: FileDetails[] = [];
  isMultiFile;
  url = "https://www.youtube.com/watch?v=dpnh-g55lPM";
  videoUrl = '';
  
  appCategories = ["cat1","cat2","cat3"];
  selectedCats = [];

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    FroalaEditor.DefineIcon('alert', {NAME: 'info'});
    FroalaEditor.RegisterCommand('alert', {
      title: 'Hello',
      focus: false,
      undo: false,
      refreshAfterCallback: false,
 
      callback: () => {
        alert('Hello!');
      }
    });


    this.getyouTubeId();
    const file1 = new FileDetails()
    file1.fileName = 'Product_image.png';
    file1.fileUploadProgress = 0;


    const file2 = new FileDetails();
    file2.fileName = 'Product_image.png';
    file2.fileUploadProgress = 50;

    const file3 = new FileDetails();
    file3.fileName = 'Product_side_image.png';
    file3.fileUploadProgress = 75;

    const file4 = new FileDetails();
    file4.fileName = "Product_backside_image.png";
    file4.fileUploadProgress = 100;
    file4.fileIconUrl = "https://stage1-philips-market-test.openchannel.io/assets/img/item-1.png"
    file4.fileUrl = "https://stage1-philips-market-test.openchannel.io/assets/img/item-1.png";
    file4.fileSize = 2048000;
    file4.fileUploadTime = 1595942005169;

    this.icons = [file4],
      this.defaultFileIcon = 'https://stage1-philips-market-test.openchannel.io/assets/img/item-1.png'

    this.isMultiFile = true,
      this.files = [file1],
      this.defaultfile = 'https://stage1-philips-market-test.openchannel.io/assets/img/item-1.png'

  }

  getValue(value) {
    return value;
  }

  getyouTubeId() {
    var video_id = this.url.split('v=')[1].split('&')[0];
    this.videoUrl = "https://www.youtube.com/embed/" + video_id;
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
  }

}
