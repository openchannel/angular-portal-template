import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  socialLinks = [
    {
      link: 'https://facebook.com',
      iconSrc: 'assets/img/facebook-icon.svg',
      iconAlt: 'facebook-icon'
    },
    {
      link: 'https://instagram.com',
      iconSrc: 'assets/img/instagram.svg',
      iconAlt: 'instagram-icon'
    },
    {
      link: 'https://linkedin.com',
      iconSrc: 'assets/img/linkedin.svg',
      iconAlt: 'linkedin-icon'
    },
    {
      link: 'https://twitter.com',
      iconSrc: 'assets/img/twitter-icon.svg',
      iconAlt: 'twitter-icon'
    },
    {
      link: 'https://tiktok.com',
      iconSrc: 'assets/img/tik-tok.svg',
      iconAlt: 'tiktok-icon'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
