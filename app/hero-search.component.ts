import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

//Observable class extensions
import 'rxjs/add/observable/of';

//Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
  moduleId: module.id,
  selector: 'hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
  providers: [HeroSearchService]
})
export class HeroSearchComponent implements OnInit {

  heroes: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroSearchService: HeroSearchService, private router: Router) { }

  //push a search term into the observable stream
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes = this.searchTerms
      //wait 300ms after each keystroke before considering the term
      .debounceTime(300)
      //ignore if next search term is same as previous
      .distinctUntilChanged()
      //switch to new observable each time the term changes
      .switchMap(
        //switchMap保留了原始的请求顺序，
        //并且只返回最近一次 http 调用返回的可观察对象。
        //这是因为以前的调用都被取消或丢弃了。
        //(取消HeroSearchService的可观察对象并不会实际中止 (abort) 一个未完成的 HTTP 请求，
        // 除非服务支持这个特性)
        //如果搜索框为空，我们还可以短路掉这次http方法调用，
        //并且直接返回一个包含空数组的可观察对象。
      term => term
        //return the http search observable
        ? this.heroSearchService.search(term)
        //or the observable of empty heroes if there was no search term
        : Observable.of<Hero[]>([])
      )
      .catch(error => {
        //TODO: add real error handleing
        console.log(error);
        return Observable.of<Hero[]>([]);
      });
  }

  gotoDetail(hero: Hero): void {
    let link = ['/detail', hero.id];
    this.router.navigate(link);
  }

}
