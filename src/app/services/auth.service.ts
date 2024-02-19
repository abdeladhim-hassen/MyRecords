import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { delay, filter, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import IUser from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  public redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = this.db.collection('users');

    this.isAuthenticated$ = this.auth.user.pipe(
      map(user => !!user)
    );

    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    );

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({authOnly: false}))
    ).subscribe(data => {
      this.redirect = data.authOnly ?? false
    })
  }

  public async createUser(userData: IUser): Promise<void> {
    const userCredentials = await this.auth.createUserWithEmailAndPassword(userData.Email, userData.Password);

    if (!userCredentials.user) {
      throw new Error("User can't be found");
    }

    await this.usersCollection.doc(userCredentials.user.uid).set({
      Name: userData.Name,
      Email: userData.Email,
      Age: userData.Age,
      PhoneNumber: userData.PhoneNumber,
      Gender: userData.Gender,
      Country: userData.Country,
    });

    await userCredentials.user.updateProfile({
      displayName: userData.Name
    });
  }

  async logout($event?: Event): Promise<void> {
    if ($event) {
      $event.preventDefault();
    }

    await this.auth.signOut();

    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
