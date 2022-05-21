import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabWashingPage } from './tab-washing.page';

describe('TabWashingPage', () => {
  let component: TabWashingPage;
  let fixture: ComponentFixture<TabWashingPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TabWashingPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabWashingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
