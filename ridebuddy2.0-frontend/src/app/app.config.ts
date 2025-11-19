import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environment';
import {initializeAuth, provideAuth, indexedDBLocalPersistence} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';

if (typeof window !== 'undefined') {
  import('bootstrap/dist/js/bootstrap.bundle.min.js')
    .then((m: any) => {})
    .catch(err => console.error(err));
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi()),

    // Firebase (AngularFire) providers — tree-shakable, recommended pattern.
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    provideAuth(() => {
      const app = getApp(); // get the already created app
      return initializeAuth(app, {
        persistence: indexedDBLocalPersistence
      });
    }),

    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ]
};
