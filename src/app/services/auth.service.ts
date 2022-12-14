import {Injectable} from '@angular/core';
import {User} from '../shared/user';
import * as auth from 'firebase/auth';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
        if (this.router.url !== '/verification') {
          this.router.navigate(['dashboard'])
        }
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Login with email/password
  async login(email: string, password: string) {
    try {
      const result = await this.afAuth
        .signInWithEmailAndPassword(email, password);
      this.setUserData(result.user);
    } catch (error: any) {
      alert(error.message);
    }
  }

  // Register with email/password
  async register(email: HTMLInputElement, password: HTMLInputElement) {
    try {
      const result = await this.afAuth
        .createUserWithEmailAndPassword(email.value, password.value);
      this.sendVerificationMail();
      this.setUserData(result.user);
    } catch (error: any) {
      alert(error.message);
      email.value = '';
      password.value = '';
    }
  }

  // Send email verification when new user sign up
  async sendVerificationMail() {
    const u = await this.afAuth.currentUser;
    u!.sendEmailVerification();
    this.router.navigate(['verification']);
  }

  // Reset Forgot password
  async forgotPassword(passwordResetEmail: string) {
    try {
      await this.afAuth
        .sendPasswordResetEmail(passwordResetEmail);
      alert('Password reset email sent, check your inbox.');
      this.router.navigate(['login']);
    } catch (error) {
      alert(error);
    }
  }

  // Returns true when user is logged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  // Sign in with Google
  async googleAuth() {
    await this.authLogin(new auth.GoogleAuthProvider());
    this.router.navigate(['dashboard']);
  }

  // Auth logic to run auth providers
  async authLogin(provider: any) {
    try {
      const result = await this.afAuth
        .signInWithPopup(provider);
      this.setUserData(result.user);
      this.router.navigate(['dashboard']);
    } catch (error) {
      alert(error);
    }
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    await this.router.navigate(['login']);
  }
}
