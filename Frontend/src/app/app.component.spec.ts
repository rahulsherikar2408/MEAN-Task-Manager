import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavbarComponent } from './components/navbar/navbar.component';
import { of } from 'rxjs';
import { TaskService } from './services/task.service';
import { LoadingService } from './services/loading.service';

describe('AppComponent', () => {
  let mockTaskService: any;
  let mockLoadingService: any;

  beforeEach(() => {
    mockTaskService = {
      getTasks: jasmine.createSpy('getTasks').and.returnValue(of({ tasks: [], pagination: {} }))
    };
    mockLoadingService = {
      loading$: of(false),
      hide: jasmine.createSpy('hide'),
      show: jasmine.createSpy('show')
    };

    return TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [AppComponent, NavbarComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Angular-Todo-App'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Angular-Todo-App');
  });
});
