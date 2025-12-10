import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../app.models';
import { AuthService } from '../../core/services/auth.service';
import {
  faUserCircle,
  faSpellCheck,
  faSync,
  faShield,
  faBell,
  faQuestionCircle,
  faChartLine,
  faExclamationTriangle,
  faBolt,
  faCheck,
  faCarSide,
} from '@fortawesome/free-solid-svg-icons';
import {AsyncPipe, UpperCasePipe} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

type AsyncState = 'idle' | 'saving' | 'success' | 'error';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [
    UpperCasePipe,
    AsyncPipe,
    FaIconComponent,
    FormsModule,
  ],
})
export class ProfileComponent implements OnDestroy {
  user$: BehaviorSubject<User | null>;

  editingName = false;
  nameDraft = '';
  nameStatus: AsyncState = 'idle';
  nameError?: string;

  roleSwitchState: AsyncState = 'idle';
  roleSwitchError?: string;

  // Icônes
  faUserCircle = faUserCircle;
  faShieldCheck = faSpellCheck;
  faSync = faSync;
  faShield = faShield;
  faBell = faBell;
  faQuestionCircle = faQuestionCircle;
  faChartLine = faChartLine;
  faExclamationTriangle = faExclamationTriangle;
  faBolt = faBolt;
  faCheck = faCheck;

  private nameStatusTimeout?: ReturnType<typeof setTimeout>;
  private roleSwitchTimeout?: ReturnType<typeof setTimeout>;

  constructor(private auth: AuthService) {
    this.user$ = this.auth.userSubject;
  }

  startEditingName() {
    const displayName = this.user$.value?.displayName ?? '';
    this.nameDraft = displayName;
    this.nameError = undefined;
    this.nameStatus = 'idle';
    this.editingName = true;
  }

  cancelNameEdit() {
    this.editingName = false;
    this.nameError = undefined;
    this.nameStatus = 'idle';
  }

  async saveNameEdit() {
    if (!this.editingName) return;
    const trimmedName = (this.nameDraft || '').trim();
    if (!trimmedName) {
      this.nameError = 'Name cannot be empty.';
      this.nameStatus = 'error';
      return;
    }
    this.nameStatus = 'saving';
    this.nameError = undefined;

    try {
      await this.auth.updateDisplayName(trimmedName);
      this.nameStatus = 'success';
      this.editingName = false;
      this.clearNameTimeout();
      this.nameStatusTimeout = setTimeout(() => {
        this.nameStatus = 'idle';
      }, 2200);
    } catch (error) {
      this.nameStatus = 'error';
      this.nameError = (error as Error).message || 'Unable to update the name right now.';
    }
  }

  get nextRole(): User['role'] {
    return this.user$.value?.role === 'CONDUCTOR' ? 'PASSENGER' : 'CONDUCTOR';
  }

  get nextRoleLabel() {
    return this.nextRole === 'CONDUCTOR' ? 'Driver' : 'Passenger';
  }

  async switchRole() {
    if (this.roleSwitchState === 'saving') {
      return;
    }

    const targetRole = this.nextRole;
    if (!targetRole) {
      return;
    }

    this.roleSwitchError = undefined;
    this.roleSwitchState = 'saving';
    this.clearRoleTimeout();

    try {
      await this.auth.updateUserRole(targetRole);
      this.roleSwitchState = 'success';
      this.roleSwitchTimeout = setTimeout(() => {
        this.roleSwitchState = 'idle';
      }, 2200);
    } catch (error) {
      this.roleSwitchState = 'error';
      this.roleSwitchError = (error as Error).message || 'Unable to switch roles right now.';
    }
  }

  getRoleIcon() {
    const role = this.user$.value?.role;
    if (role === 'CONDUCTOR') {
      return faCarSide;
    } else if (role === 'PASSENGER') {
      return faUserCircle;
    }
    return faUserCircle;
  }

  ngOnDestroy() {
    this.clearNameTimeout();
    this.clearRoleTimeout();
  }

  private clearNameTimeout() {
    if (this.nameStatusTimeout) {
      clearTimeout(this.nameStatusTimeout);
      this.nameStatusTimeout = undefined;
    }
  }

  private clearRoleTimeout() {
    if (this.roleSwitchTimeout) {
      clearTimeout(this.roleSwitchTimeout);
      this.roleSwitchTimeout = undefined;
    }
  }
}
