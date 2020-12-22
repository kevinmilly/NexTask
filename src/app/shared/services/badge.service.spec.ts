import { TestBed } from '@angular/core/testing';

import { BadgeService } from './badge.service';

import { testBadges } from '../test-data/test-badge';
import { testMetrics } from '../test-data/test-metrics';
import { AngularFirestore } from '@angular/fire/firestore';

xdescribe('BadgeService', () => {
  let service: BadgeService;


  let fakeFire = jasmine.createSpyObj("fakeFire",["collection"]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[fakeFire] 
    });
    service = TestBed.inject(BadgeService);
    fakeFire = TestBed.inject(AngularFirestore);



  });


});
 