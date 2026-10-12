import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Role, ROLES } from '../constants/role.constants';
import { APP_URLS } from '../constants/route.constants';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { LoginResponse, Session } from '../models/auth.model';

/**
 * Keeps the signed-in session as a signal, so templates update on login/logout.
 * sessionStorage (not localStorage) ends the session when the tab closes.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private session = signal<Session | null>(this.loadSession());

  username = computed(() => this.session()?.username ?? null);
  role = computed(() => this.session()?.role ?? null);
  isAuthenticated = computed(() => this.session() !== null);
  isAdmin = computed(() => this.role() === ROLES.ADMIN);

  get token(): string | null {
    return this.session()?.token ?? null;
  }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(API_ENDPOINTS.auth.login, { username, password }).pipe(
      tap((res) => this.startSession({ token: res.token, username: res.username, role: res.role })),
    );
  }

  logout(redirect = true): void {
    sessionStorage.removeItem(STORAGE_KEYS.session);
    this.session.set(null);
    if (redirect) this.router.navigateByUrl(APP_URLS.login);
  }

  hasAnyRole(roles: Role[]): boolean {
    const current = this.role();
    return current !== null && roles.includes(current);
  }

  private startSession(session: Session): void {
    sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    this.session.set(session);
  }

  private loadSession(): Session | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.session);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null; // corrupt storage must never break app start
    }
  }
}
