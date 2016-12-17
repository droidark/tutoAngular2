import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
  moduleId: module.id,
  selector: 'hero-search',
  templateUrl: 'hero-search.component.html',
  styleUrls: [ 'hero-search.component.css' ],
  providers: [HeroSearchService]
})

export class HeroSearchComponent implements OnInit {
  heroes: Observable<Hero[]>;
  // A Subject is a producer of of an observable event stream; searchTerms
  // produces an Observable of strings, the filter criteria for the name search.
  private searchTerms = new Subject<string>();

  constructor(
    private heroSearchService: HeroSearchService,
    private router: Router){ }

  // Push a search term into the Observable stream.
  search(term: string): void{
    this.searchTerms.next(term);
  }

  ngOnInit(): void{
    this.heroes = this.searchTerms
      .debounceTime(300)      // wait for 300ms pause event
      .distinctUntilChanged() // ignore if next search term is same or previous
      .switchMap(term => term //switch to next observable each time
        // return the http search Observable
        ? this.heroSearchService.search(term)
        // or the Observable of empty heroes if not search term
        : Observable.of<Hero[]>([]))
      .catch(error => {
        // TODO: read error handling
        console.log(error);
        return Observable.of<Hero[]>([]);
      });
  }

  gotoDetail(hero: Hero): void {
    let link = ['/detail', hero.id];
    this.router.navigate(link);
  }
}
