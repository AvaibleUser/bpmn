import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStore } from '@shared/stores/local-store';
import { Observable } from 'rxjs';

const excludedUrls: string[] = ['/auth'];

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const localStore = inject(LocalStore);
  const shouldSkip = excludedUrls.some((url) => req.url.includes(url));

  if (shouldSkip) {
    return next(req);
  }

  let { token } = localStore.getSession().session;
  if (!token) {
    return next(req);
  }

  const reqWithHeaders = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(reqWithHeaders);
};
