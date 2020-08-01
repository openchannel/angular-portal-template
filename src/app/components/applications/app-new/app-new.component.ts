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

  icons: FileDetails[] = [];
  productImages: FileDetails[] = [];

  url = "https://www.youtube.com/watch?v=dpnh-g55lPM";
  videoUrl = '';
  
  defaultFileIconUrl = "https://drive.google.com/u/0/uc?id=1vDDzbS--o_UIgXFE_LmMfVmSAKuprCyb&export=download";
  appCategories = ["cat1","cat2","cat3"];
  selectedCats:string[] = [];

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
  }

  getValue(value) {
    return value;
  }

  getyouTubeId() {
    var video_id = this.url.split('v=')[1].split('&')[0];
    this.videoUrl = "https://www.youtube.com/embed/" + video_id;
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
  }
  
  saveNewApp(){
  }

  updateCategory(){
  }
}
