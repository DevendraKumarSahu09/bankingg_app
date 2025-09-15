import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectCurrentUser } from '../store/auth/auth.selectors';

export const AdminGuard = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectCurrentUser).pipe(
    map(user => {
      console.log('AdminGuard checking user:', user); // Debug log
      if (user && user.role === 'admin') {
        return true;
      } else {
        console.log('Access denied - not admin'); // Debug log
        router.navigate(['/dashboard']);
        return false;
      }
    })
  );
};
