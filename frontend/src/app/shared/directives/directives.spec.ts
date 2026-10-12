import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ROLES } from '../../core/constants/role.constants';
import { STORAGE_KEYS } from '../../core/constants/storage.constants';
import { ConfirmClickDirective } from './confirm-click.directive';
import { DebounceInputDirective } from './debounce-input.directive';
import { HasRoleDirective } from './has-role.directive';

@Component({
  imports: [HasRoleDirective, ConfirmClickDirective, DebounceInputDirective],
  template: `
    <button *appHasRole="roles.ADMIN" id="admin-only">Edit</button>
    <button id="confirm" [appConfirmClick]="'Sure?'" (confirmed)="confirmedCount = confirmedCount + 1">Delete</button>
    <input id="search" appDebounceInput [debounceMs]="50" (debounced)="lastValue = $event" />
  `,
})
class HostComponent {
  roles = ROLES;
  confirmedCount = 0;
  lastValue = '';
}

describe('directives', () => {
  function create(role: string) {
    sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ token: 't', username: 'u', role }));
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient()] });
    const fixture = TestBed.createComponent(HostComponent);
    return fixture;
  }

  afterEach(() => {
    sessionStorage.clear();
    jest.restoreAllMocks();
  });

  it('appHasRole shows the element for an admin', async () => {
    const fixture = create('HR_ADMIN');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('#admin-only')).not.toBeNull();
  });

  it('appHasRole hides the element for a viewer', async () => {
    const fixture = create('HR_VIEWER');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('#admin-only')).toBeNull();
  });

  it('appConfirmClick runs the action only after the user confirms', async () => {
    const fixture = create('HR_ADMIN');
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('#confirm');

    jest.spyOn(window, 'confirm').mockReturnValueOnce(false);
    button.click();
    expect(fixture.componentInstance.confirmedCount).toBe(0);

    jest.spyOn(window, 'confirm').mockReturnValueOnce(true);
    button.click();
    expect(fixture.componentInstance.confirmedCount).toBe(1);
  });

  it('appDebounceInput emits once, after the user stops typing', async () => {
    jest.useFakeTimers();
    const fixture = create('HR_ADMIN');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#search');

    input.value = 'a';
    input.dispatchEvent(new Event('input'));
    input.value = 'ab';
    input.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.lastValue).toBe('');

    jest.advanceTimersByTime(60);
    expect(fixture.componentInstance.lastValue).toBe('ab');
    jest.useRealTimers();
  });
});
