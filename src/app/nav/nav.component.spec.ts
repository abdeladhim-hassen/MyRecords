import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { NavComponent } from './nav.component';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { By } from '@angular/platform-browser';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  const mockAuthService = jasmine.createSpyObj('AuthService',[
    'createUser','logout'
  ], {
    isAuthenticated$: of(true),
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavComponent],
      providers: [
        {provide: AuthService , useValue:  mockAuthService}
      ],
      imports: [RouterTestingModule]
    }).compileComponents()
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have logout button', () => {
    const logout = fixture.debugElement.query(By.css('li:nth-child(3) a'))
    expect(logout).withContext('not login').toBeTruthy();
    logout.triggerEventHandler('click')
    const service = TestBed.inject(AuthService)
    expect(service.logout)
      .withContext('we can not click logout link')
      .toHaveBeenCalledTimes(1)
  });
});
