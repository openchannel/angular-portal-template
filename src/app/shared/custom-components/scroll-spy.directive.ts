import { Directive, Input, Output, HostListener, ElementRef, EventEmitter } from '@angular/core';
import { debounce } from './debounce.decorator';

@Directive({
  selector: '[scrollSpy]'
})

export class ScrollSpyDirective {
  @Input() public spiedTags = [];
  @Output() public sectionChange = new EventEmitter<String>();
  private currentSection: string;

  constructor(private _el: ElementRef) { }

  @HostListener('window:scroll', ['$event'])
  @debounce(100)
  onScroll(event: any) {
    let currentSection: string;
    const children = this._el.nativeElement.children;
    const scrollTop = window.scrollY;
    // const parentOffset = 68;
    // const children = this._el.nativeElement.children;
    // const scrollTop = event.target.scrollTop;
    // const parentOffset = event.target.offsetTop;
    

    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      const parentOffset = children[0].offsetTop;
      //console.log("=============================");
      //console.log("element.tagName :"  + element.id + " element.offsetTop :"  + element.offsetTop + " parentOffset :"  + parentOffset + " scrollTop :"  + scrollTop);
      //console.log("element.height :"  + element.offsetHeight);
      //console.log("=============================");
      var bounding = element.getBoundingClientRect();
      if (this.checkIfElementIsPartiallyInViewport(element)) {
          currentSection = element.id;
          //console.log("currentSection :"  + currentSection);      
        }
    }
    // if user reach to bottom of page make last element selected.
    //console.log("(window.innerHeight + window.pageYOffset)" +(window.innerHeight + window.pageYOffset)+ "  document.body.offsetHeight  "+ (document.body.offsetHeight -1) );
    if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight -1) ) {
      currentSection = children[children.length - 1].id;
      //console.log("bottom");
    }
    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.sectionChange.emit(this.currentSection);
      //console.log("emmiteed currentSection :"  + currentSection);      
    }
  }

  checkIfElementIsPartiallyInViewport(element) {
    if((element != undefined) && (element != null)) { 
          var ele_top = element.offsetTop;
          var ele_bottom = element.offsetHeight;
          while(element.offsetParent) {
            element = element.offsetParent;
            ele_top += element.offsetTop;
          }
          //ele_top < (window.pageYOffset + window.innerHeight) &&
          return (
            ele_top < (window.pageYOffset + 100) &&
            (ele_top + ele_bottom) > (window.pageYOffset)
          );
    } else {
        return false;
    }
  }

}
