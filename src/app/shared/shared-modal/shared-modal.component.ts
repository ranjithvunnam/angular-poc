import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DropdownItem } from "../../core/models/body-types.model";

@Component({
  selector: 'shared-model',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './shared-modal.component.html',
  styleUrls: ['./shared-modal.component.css']
})
export class SharedModelComponent {

  @Input() title: string = '';
  @Input() options?: { isTypeOnly: true, item: DropdownItem, bodyTypes: DropdownItem[] };
  form!: FormGroup;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.form = this.fb.group({
      parentBodyType: [{ value: '', disabled: true }],
      name: ['', Validators.required]
    });

    if (!this.options?.isTypeOnly) {
      this.form.get('parentBodyType')?.setValidators(Validators.required);
      if (this.options?.item?.parentId) {
        this.form.patchValue({ parentBodyType: this.options.item.parentId });
      }
    }

    if (this.options?.item?.label) {
      this.form.patchValue({ name: this.options.item.label });
    }
  }

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: DropdownItem = {
      id: this.options?.item?.id || 0,
      label: this.form.value.name,
      parentId: this.options?.item?.parentId || undefined,
      order: this.options?.item?.order || 0
    };

    this.activeModal.close(payload);
  }
}