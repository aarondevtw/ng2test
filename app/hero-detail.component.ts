import { Component,OnInit  } from '@angular/core';
import { ActivatedRoute,Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { HeroService } from './hero.service';
import { Hero } from './hero';

@Component({
  moduleId:module.id,
  selector:'my-hero-detail',
  templateUrl:'hero-detail.component.html',
  styleUrls:['hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit{

  hero:Hero;
  constructor(
    private heroService:HeroService,
    private route:ActivatedRoute,
    private location:Location
    ){}

    ngOnInit():void{
      //關於 +params['id']寫法的詳細資訊
      //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators
      this.route.params.switchMap((params:Params)=>this.heroService.getHero(+params["id"])).subscribe(hero => this.hero=hero);
    }

    goBack():void{
      this.location.back();
    }

}
