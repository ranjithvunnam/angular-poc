import { Component } from '@angular/core';
import { DropdownItem } from '../../core/models/body-types.model';
import { TypeService } from '../../core/services/type.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CascadedDropdownsComponent } from '../../shared/cascaded-dropdowns/cascaded-dropdowns.component';

@Component({
  selector: 'home-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, CascadedDropdownsComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  bodyTypeOptions: DropdownItem[] = [];
  bodySubTypeOptions: DropdownItem[] = [];

  constructor(private typeService: TypeService) {
    this.typeService.getBodyTypes().subscribe(mt => {
      this.bodyTypeOptions = mt;
    });

    this.typeService.getBodySubTypes().subscribe(st => {
      this.bodySubTypeOptions = st;
    });
  }

  onCascadeSelectionChange(selection: { parentId: number | null; childId: number | null }) {
    console.log('Selected body Type ID:', selection.parentId);
    console.log('Selected Sub Type ID:', selection.childId);
    if (selection.parentId && selection.childId) {
      const selectedItem = this.bodySubTypeOptions.find(item => item.id === selection.childId);
      alert('Selected Sub Type ID: '+ selectedItem?.label);
    }
  }
}