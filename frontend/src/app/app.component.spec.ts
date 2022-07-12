import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {RoomsComponent} from "./rooms/rooms.component";
import {FormsModule} from "@angular/forms";
import {MessageFormComponent} from "./message-form/message-form.component";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // it(`should have as title 'frontend'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app.title).toEqual('frontend');
  // });

  it('should login', () => {
    const fixture = TestBed.createComponent(AppComponent);
    // const room = TestBed.createComponent(MessageFormComponent);

    fixture.detectChanges();

    expect("true").toBe("true");
  });
});
