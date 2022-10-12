import { NgModule, Component, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClientModule, HttpClient } from '@angular/common/http';

class SearchItem {
  constructor(
    public track: string,
    public artist: string,
    public link: string,
    public thumbnail: string,
    public artistId: string
  ) {}
}

@Injectable()
export class SearchService {
  apiRoot: string = 'https://itunes.apple.com/search';
  results: SearchItem[];
  loading: boolean;

  constructor(private http: HttpClient) {
    this.results = [];
    this.loading = false;
  }

  search(term: string) {
    let promise = new Promise((resolve, reject) => {
      let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      this.http
        .get(apiURL)
        .toPromise()
        .then(
          (res: any) => {
            // Success
            this.results = res.results.map(
              (item: {
                trackName: string;
                artistName: string;
                trackViewUrl: string;
                artworkUrl30: string;
                artistId: string;
              }) => {
                return new SearchItem(
                  item.trackName,
                  item.artistName,
                  item.trackViewUrl,
                  item.artworkUrl30,
                  item.artistId
                );
              }
            );
            reject();
          },
          (msg) => {
            // Error
            reject(msg);
          }
        );
    });
    return promise;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'practice';
  loading: boolean = false;
  constructor(public itunes: SearchService) {}
  doSearch(term: string) {
    this.loading = true;
    this.itunes.search(term).then((_) => (this.loading = false));
  }
}
