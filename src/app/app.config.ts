import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import { uiReducer } from './store/ui/ui.reducer';
import { inscripcionesReducer } from './store/inscripciones/inscripciones.reducer';
import { alumnosReducer } from './store/alumnos/alumnos.reducer';
import { cursosReducer } from './store/cursos/cursos.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { InscripcionesEffects } from './store/inscripciones/inscripciones.effects';
import { AlumnosEffects } from './store/alumnos/alumnos.effects';
import { CursosEffects } from './store/cursos/cursos.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideStore({
      auth: authReducer,
      ui: uiReducer,
      inscripciones: inscripcionesReducer,
      alumnos: alumnosReducer,
      cursos: cursosReducer
    }),
    provideEffects([
      AuthEffects,
      InscripcionesEffects,
      AlumnosEffects,
      CursosEffects
    ]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    })
  ]
};
