import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DropdownItem } from '../../core/models/body-types.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TypeService } from '../../core/services/type.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModelComponent } from '../../shared/shared-modal/shared-modal.component';
import Sortable from 'sortablejs';

@Component({
  selector: 'home-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class AdminHomeComponent implements OnInit, AfterViewInit {
  bodyTypes: DropdownItem[] = [];
  subTypes: DropdownItem[] = [];
  toggleStates: Record<number, boolean> = {};

  @ViewChild('bodyTypesList', { static: false }) bodyList!: ElementRef;
  @ViewChildren('subTypesList') subLists!: QueryList<ElementRef>;
  @ViewChild(SharedModelComponent) formModel!: SharedModelComponent;

  parentType = '';
  subTypeName = '';

  constructor(
    private typeService: TypeService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.typeService.getBodyTypes().subscribe(types => {
      this.bodyTypes = types;
      this.cd.detectChanges();
    });

    this.typeService.getBodySubTypes().subscribe(subTypes => {
      this.subTypes = subTypes;
      this.cd.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    const bodyList = document.getElementById('bodyTypesList');
    if (bodyList) {
      new Sortable(bodyList, {
        handle: '.drag-handle',
        animation: 150,
        onEnd: (evt) => {
          console.log(`Body type moved: ${evt.oldIndex} → ${evt.newIndex}`);
          const moved = this.bodyTypes.splice(evt.oldIndex!, 1)[0];
          this.bodyTypes.splice(evt.newIndex!, 0, moved);

          this.bodyTypes.forEach((item, index) => (item.order = index + 1));
          this.typeService.setBodyTypes(this.bodyTypes);
        }
      });
    }

    const subLists = document.querySelectorAll('[id$="SubTypesList"]');
    subLists.forEach((list) => {
      new Sortable(list as HTMLElement, {
        handle: '.drag-handle',
        animation: 150,
        draggable: '.sub-body-item',
        onEnd: (evt) => {
          console.log(`Sub-body moved: ${evt.oldIndex} → ${evt.newIndex}`);
          const parentId = parseInt((list as HTMLElement).getAttribute('id')!, 10);
          const children = this.getChildrenForParent(parentId);

          const moved = children.splice(evt.oldIndex!, 1)[0];
          children.splice(evt.newIndex!, 0, moved);

          children.forEach((item, index) => (item.order = index + 1));

          this.subTypes = [
            ...this.subTypes.filter(sub => sub.parentId !== parentId),
            ...children
          ];

          this.typeService.setSubTypes(this.subTypes);
        }
      });
    });
  }

  toggleCollapse(id: number) {
    this.toggleStates[id] = !this.toggleStates[id];
  }

  addParent(label: string) {
    if (!label) return;
    const exists = this.bodyTypes.some(p => p.label.trim().toLowerCase() === label.toLowerCase());
    if (exists) {
      alert(`Parent "${label}" already exists.`);
      console.warn(`Parent "${label}" already exists.`);
      return;
    }

    const maxId = this.bodyTypes.length ? Math.max(...this.bodyTypes.map(s => s.id)) : 0;
    const parent: DropdownItem = {
      id: maxId + 1,
      label,
      order: this.bodyTypes.length + 1
    };
    this.bodyTypes = [...this.bodyTypes, parent];
    this.typeService.addMainType(parent);
  }

  addChild(parentId: number, label: string) {
    if (!label) return;

    const subTypesForParent = this.subTypes.filter(c => c.parentId === parentId);
    const exists = subTypesForParent.some(p => p.label.trim().toLowerCase() === label.toLowerCase());
    if (exists) {
      alert(`Child "${label}" already exists.`);
      console.warn(`Child "${label}" already exists.`);
      return;
    }

    const maxId = subTypesForParent.length ? Math.max(...subTypesForParent.map(s => s.id)) : 0;
    const child: DropdownItem = {
      id: maxId + 1,
      parentId,
      label,
      order: this.getChildrenForParent(parentId).length + 1
    };

    this.typeService.addSubType(child);
  }

  updateParent(updatedItem: DropdownItem) {
    this.typeService.updateMainType(updatedItem);
    const idx = this.bodyTypes.findIndex(p => p.id === updatedItem.id);
    if (idx !== -1) {
      this.bodyTypes[idx] = { ...this.bodyTypes[idx], ...updatedItem };
      this.bodyTypes = [...this.bodyTypes];
    }
  }

  updateChild(updatedItem: DropdownItem) {
    this.typeService.updateSubType(updatedItem);
    const idx = this.subTypes.findIndex(c => c.id === updatedItem.id);
    if (idx !== -1) {
      this.subTypes[idx] = { ...this.subTypes[idx], ...updatedItem };
      this.subTypes = [...this.subTypes];
    }
  }

  removeParent(index: number) {
    const removed = this.bodyTypes[index];
    if (removed) {
      this.typeService.removeMainType(removed.id);
      this.subTypes = this.subTypes.filter(c => c.parentId !== removed.id);
      this.typeService.setSubTypes(this.subTypes);
    }
  }

  removeChild(child: DropdownItem) {
    const idx = this.subTypes.findIndex(c => c.id === child.id && c.parentId === child.parentId);
    if (idx !== -1) {
      this.typeService.removeSubType(child.id);
    }
  }

  getChildrenForParent(parentId: number): DropdownItem[] {
    return this.subTypes.filter(c => c.parentId === parentId).sort((a, b) => a.order - b.order);
  }

  openTypeModal(item?: DropdownItem, isTypeOnly: boolean = true) {
    (document.activeElement as HTMLElement)?.blur();
    const modalRef = this.modalService.open(SharedModelComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.title = isTypeOnly ? 'Add Vehicle Type' : 'Add Vehicle Sub Type';
    modalRef.componentInstance.options = {
      isTypeOnly,
      bodyTypes: this.bodyTypes
    };
    modalRef.componentInstance.options.item = isTypeOnly ? item : item?.parentId ? item : { parentId: item?.id};
    modalRef.componentInstance.close = () => modalRef.close();
    modalRef.componentInstance.dismiss = () => modalRef.dismiss();

    modalRef.result.then(payload => {
      if (!payload) return;

      if (payload.parentId) {
        if (payload.id) {
          this.updateChild(payload);
        } else {
          this.addChild(payload.parentId, payload.label);
        }
      } else {
        if (payload.id) {
          this.updateParent(payload);
        } else {
          this.addParent(payload.label);
        }
      }
    }, reason => console.log('Modal dismissed', reason));
  }
}
