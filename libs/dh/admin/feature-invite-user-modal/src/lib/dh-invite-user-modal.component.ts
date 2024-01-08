﻿/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { distinctUntilChanged, filter, map, take } from 'rxjs';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import {
  DhAdminAssignableUserRolesStore,
  DhUserActorsDataAccessApiStore,
  DhAdminInviteUserStore,
  ErrorDescriptor,
} from '@energinet-datahub/dh/admin/data-access-api';
import { DhAssignableUserRolesComponent } from './dh-assignable-user-roles/dh-assignable-user-roles.component';
import { MarketParticipantUserRoleDto } from '@energinet-datahub/dh/shared/domain';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { dhDkPhoneNumberValidator } from '@energinet-datahub/dh/shared/ui-validators';
import { Apollo } from 'apollo-angular';
import {
  GetAssociatedActorsDocument,
  GetKnownEmailsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [DhAdminAssignableUserRolesStore, DhAdminInviteUserStore],
  selector: 'dh-invite-user-modal',
  templateUrl: './dh-invite-user-modal.component.html',
  styleUrls: ['./dh-invite-user-modal.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    WATT_MODAL,
    WattButtonComponent,
    TranslocoModule,
    WattIconComponent,
    ReactiveFormsModule,
    WattDropdownComponent,
    RxPush,
    DhAssignableUserRolesComponent,
    WATT_STEPPER,
    WattTextFieldComponent,
    WattFieldErrorComponent,
  ],
})
export class DhInviteUserModalComponent implements AfterViewInit {
  private readonly actorStore = inject(DhUserActorsDataAccessApiStore);
  private readonly assignableUserRolesStore = inject(DhAdminAssignableUserRolesStore);
  private readonly inviteUserStore = inject(DhAdminInviteUserStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(WattToastService);
  private readonly translocoService = inject(TranslocoService);
  private readonly apollo = inject(Apollo);
  private readonly changeDectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  private readonly userEmailExistsQuery = this.apollo.watchQuery({
    returnPartialData: false,
    useInitialLoading: false,
    notifyOnNetworkStatusChange: true,
    query: GetKnownEmailsDocument,
  });

  @ViewChild('inviteUserModal') inviteUserModal!: WattModalComponent;
  @Output() closed = new EventEmitter<void>();

  readonly actors$ = this.actorStore.actors$;

  isInvitingUser$ = this.inviteUserStore.isSaving$;

  domain: string | undefined = undefined;
  inOrganizationMailDomain = false;
  emailExists = false;
  knownEmails: string[] = [];
  isLoadingEmails = true;
  currentEmail?: string;

  baseInfo = this.formBuilder.group({
    actorId: ['', Validators.required],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
      [
        () => {
          return this.apollo
            .mutate({
              mutation: GetAssociatedActorsDocument,
              variables: {
                email: this.currentEmail ?? '',
              },
            })
            .pipe(
              takeUntilDestroyed(this.destroyRef),
              filter((x) => !x.loading),
              filter((x) => x.data?.associatedActors.email === this.currentEmail),
              map((result) => {
                const associatedActors = result.data?.associatedActors.actors ?? [];

                const isAlreadyAssociatedToActor: boolean =
                  associatedActors &&
                  associatedActors.includes(this.baseInfo.controls.actorId.value ?? '');

                if (isAlreadyAssociatedToActor) return { userAlreadyAssignedActor: true };
                return null;
              })
            );
        },
      ],
    ],
  });

  userInfo = this.formBuilder.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(12),
        Validators.minLength(12),
        dhDkPhoneNumberValidator,
      ],
    ],
  });
  userRoles = this.formBuilder.group({
    selectedUserRoles: [[] as string[], Validators.required],
  });

  ngAfterViewInit(): void {
    this.inviteUserModal.open();

    this.userEmailExistsQuery.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((x) => {
        this.knownEmails = x.data?.knownEmails?.map((x) => x.toUpperCase()) ?? [];
        this.isLoadingEmails = false;
        this.changeDectorRef.detectChanges();
      });

    this.baseInfo.controls.actorId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((actorId) => {
        actorId !== null
          ? this.baseInfo.controls.email.enable()
          : this.baseInfo.controls.email.disable();

        if (actorId === null) {
          this.actorStore.resetOrganizationState();
          return;
        }

        this.assignableUserRolesStore.getAssignableUserRoles(actorId);
        this.actorStore.getActorOrganization(actorId);
        this.baseInfo.updateValueAndValidity();
        this.changeDectorRef.detectChanges();
      });

    this.actorStore.organizationDomain$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((domain) => {
        this.domain = domain;
      });

    this.baseInfo.controls.email.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe((email) => {
        this.inOrganizationMailDomain =
          !!email &&
          !!this.domain &&
          this.baseInfo.controls.email.valid &&
          email.toUpperCase().endsWith(this.domain.toUpperCase());

        this.emailExists =
          !!email &&
          this.baseInfo.controls.email.valid &&
          this.knownEmails.includes(email.toUpperCase());

        this.currentEmail = email ?? '';

        this.changeDectorRef.detectChanges();
      });

    this.actors$.pipe(take(1)).subscribe((actors) => {
      if (actors.length === 1) {
        this.baseInfo.controls.actorId.setValue(actors[0].value);
      }
    });
  }

  inviteUser() {
    if (!this.isBaseInfoValid() || !this.isNewUserInfoValid() || !this.isRolesInfoValid()) {
      return;
    }

    const { firstname, lastname, phoneNumber } = this.userInfo.controls;
    const { email, actorId } = this.baseInfo.controls;

    this.inviteUserStore.inviteUser({
      invitation: {
        firstName: firstname.value ? firstname.value : 'J',
        lastName: lastname.value ? lastname.value : 'D',
        email: email.value ?? '',
        phoneNumber: phoneNumber.value ? phoneNumber.value : '+45 12345678',
        assignedActor: actorId.value ?? '',
        assignedRoles: this.userRoles.controls.selectedUserRoles.value ?? [],
      },
      onSuccess: () => this.onInviteSuccess(email.value),
      onError: (e) => this.onInviteError(e),
    });
  }

  onSelectedUserRoles(userRoles: MarketParticipantUserRoleDto[]) {
    this.userRoles.controls.selectedUserRoles.markAsTouched();
    this.userRoles.controls.selectedUserRoles.setValue(userRoles.map((userRole) => userRole.id));
  }

  closeModal(status: boolean) {
    this.closed.emit();
    this.actorStore.resetOrganizationState();
    this.inviteUserModal.close(status);
  }

  private onInviteSuccess(email: string | null) {
    this.toastService.open({
      type: 'success',
      message: `${this.translocoService.translate(
        'admin.userManagement.inviteUser.successMessage',
        { email: email }
      )}`,
    });
    this.closeModal(true);
  }

  private onInviteError(e: ErrorDescriptor) {
    this.toastService.open({
      type: 'danger',
      message: e.details
        ? e.details
            .map((x) =>
              this.translocoService.translate(
                `admin.userManagement.inviteUser.serverErrors.${x.code}`
              )
            )
            .join('\n')
        : this.translocoService.translate(`admin.userManagement.inviteUser.serverErrors.${e.code}`),
      duration: 600000,
    });
  }

  private isBaseInfoValid() {
    return this.baseInfo.valid;
  }

  private isNewUserInfoValid() {
    return this.userInfo.valid || this.emailExists || !this.inOrganizationMailDomain;
  }

  private isRolesInfoValid() {
    return this.userRoles.valid;
  }
}
