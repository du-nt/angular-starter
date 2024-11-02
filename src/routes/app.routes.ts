import { Route, Routes } from '@angular/router';
import { LoginComponent } from '../app/login/login.component';
import { HomeComponent } from '../app/home/home.component';
import { ProfileComponent } from '../app/profile/profile.component';
import { authGuard } from '../guards/auth.guard';
import { NotfoundComponent } from '../app/notfound/notfound.component';
import { unauthenticatedGuard } from '../guards/unauthenticated.guard';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { UnauthenticateRouteComponent } from './unauthenticate-route.component';
import { ProtectRouteComponent } from './protect-route.component';
import { BlankLayoutComponent } from '../layouts/blank-layout/blank-layout.component';
import { Type } from '@angular/core';

type RouteObject = {
  path: string;
  layout?: Type<any>;
  variant?: 'unauthenticate' | 'public' | 'protect';
  children?: Routes;
};

const routeObjects: RouteObject[] = [
  {
    path: '',
    layout: MainLayoutComponent,
    variant: 'public',
    children: [
      {
        path: '',
        component: HomeComponent,
      },
    ],
  },
  {
    path: '',
    layout: BlankLayoutComponent,
    variant: 'unauthenticate',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
  {
    path: '',
    layout: MainLayoutComponent,
    variant: 'protect',
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ],
  },
];

const routes = routeObjects.map(
  ({ path, variant, layout = MainLayoutComponent, children }) => {
    let wrapperComponent;
    let canActivate;

    switch (variant) {
      case 'unauthenticate':
        wrapperComponent = UnauthenticateRouteComponent;
        canActivate = [unauthenticatedGuard];
        break;

      case 'protect':
        wrapperComponent = ProtectRouteComponent;
        canActivate = [authGuard];
        break;
    }

    const route: Route = {
      path: '',
      component: wrapperComponent,
      canActivate,
      children: [
        {
          path,
          component: layout,
          children,
        },
      ],
    };
    return route;
  }
);

export const allRoutes = [
  ...routes,
  { path: '**', component: NotfoundComponent },
];
