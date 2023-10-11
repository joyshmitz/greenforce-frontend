/**
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
import { Component, OnInit } from "@angular/core";
import { WattButtonComponent } from "../../button/watt-button.component";
import { WATT_MODAL } from "../watt-modal.component";
import { WattModalService } from "../watt-modal.service";
import { WattTextFieldComponent } from "../../text-field/watt-text-field.component";
import { FormControl } from "@angular/forms";

@Component({
  standalone: true,
  selector: 'watt-modal-from-class',
  imports: [
    WATT_MODAL,
    WattTextFieldComponent,
    WattButtonComponent,
  ],
  template: `
    <watt-modal #modal [title]="title" closeLabel="Close modal" [loading]="isLoading">
      <watt-text-field [formControl]="exampleFormControl" label="Username" />
      <watt-text-field [formControl]="exampleFormControl" label="Password" type="password" />
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">Cancel</watt-button>
        <watt-button (click)="modal.close(true)">Save</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class WattModalComponent implements OnInit {
  title = 'This is a modal opened from a class'
  exampleFormControl = new FormControl('');
  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  }
}

@Component({
  standalone: true,
  selector: 'watt-modal-from-class',
  imports: [
    WattButtonComponent,
    WattModalComponent,
  ],
  providers: [WattModalService],
  template: `<watt-button (click)="openModal()">Open modal from service</watt-button>`,
})
export class WattModalFromClassComponent {
  constructor(private modalService: WattModalService) {}

  openModal() {
    this.modalService.open({
      component: WattModalComponent,
      onClosed: (result) => {
        alert(`Modal closed with result: ${result}`);
      }
    });
  }
}

