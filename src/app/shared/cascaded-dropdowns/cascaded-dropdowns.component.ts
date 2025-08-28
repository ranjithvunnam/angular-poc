import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DropdownItem } from '../../core/models/body-types.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CascadedDropdownConfig {
  parentPlaceholder?: string;
  childPlaceholder?: string;
}

@Component({
  selector: 'app-cascaded-dropdowns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cascaded-dropdowns.component.html',
  styleUrls: ['./cascaded-dropdowns.component.css'],
})
export class CascadedDropdownsComponent {
  @Input() parentOptions: DropdownItem[] = [];
  @Input() childOptions: DropdownItem[] = [];
  @Input() config: CascadedDropdownConfig = {
    parentPlaceholder: 'Select Parent',
    childPlaceholder: 'Select Child',
  };
  childDropdownOpen = false;
  parentDropdownOpen = false;

  selectedParentId: number | null = null;
  selectedChildId: number | null = null;

  @Output() selectionChange = new EventEmitter<{ parentId: number | null; childId: number | null }>();

  get sortedParentOptions(): DropdownItem[] {
    return [...this.parentOptions].sort((a, b) => a.order - b.order);
  }

  get filteredChildOptions(): DropdownItem[] {
    if (!this.selectedParentId) {
      return [];
    }
    return this.childOptions
      .filter((item) => item.parentId === this.selectedParentId)
      .sort((a, b) => a.order - b.order);
  }

  onParentChange(selectedId: any) {
    const val = selectedId === '' || selectedId == null ? null : Number(selectedId);
    if (val !== this.selectedParentId) {
      this.selectedParentId = val;
      this.selectedChildId = null;
      this.emitSelectionChange();
    }
  }

  onChildChange(selectedId: any) {
    const val = selectedId === '' || selectedId == null ? null : Number(selectedId);
    if (val !== this.selectedChildId) {
      this.selectedChildId = val;
      this.emitSelectionChange();
    }
  }

  private emitSelectionChange() {
    this.selectionChange.emit({
      parentId: this.selectedParentId,
      childId: this.selectedChildId,
    });
  }

  get selectedParentLabel(): string {
    if (this.selectedParentId == null) {
      return this.config.parentPlaceholder || 'Select Parent';
    }
    const selected = this.sortedParentOptions.find(o => o.id === this.selectedParentId);
    return selected ? selected.label : this.config.parentPlaceholder || 'Select Parent';
  }

  get selectedChildLabel(): string {
    if (this.selectedChildId == null) {
      return this.config.childPlaceholder || 'Select Parent';
    }
    const selected = this.childOptions.find(o => o.id === this.selectedChildId);
    return selected ? selected.label : this.config.childPlaceholder || 'Select Parent';
  }
}
