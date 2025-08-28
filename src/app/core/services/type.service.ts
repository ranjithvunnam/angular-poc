import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { DropdownItem } from '../models/body-types.model';
import { DEFAULT_BODY_TYPES, DEFAULT_BODY_SUBTYPES } from '../../mock/mock-data';

const COOKIE_KEYS = {
  TYPES: 'bodyTypes',
  SUBTYPES: 'bodySubTypes'
};

@Injectable({ providedIn: 'root' })
export class TypeService {
  private bodyTypes$ = new BehaviorSubject<DropdownItem[]>([]);
  private bodySubTypes$ = new BehaviorSubject<DropdownItem[]>([]);

  constructor(private cookie: CookieService) {
    this.bodyTypes$.next(this.getData(COOKIE_KEYS.TYPES) || DEFAULT_BODY_TYPES);
    this.bodySubTypes$.next(this.getData(COOKIE_KEYS.SUBTYPES) || DEFAULT_BODY_SUBTYPES);
  }

  private getData<T>(key: string): T | null {
    const val = this.cookie.get(key);
    return val ? JSON.parse(val) : null;
  }

  private setData(key: string, value: any) {
    this.cookie.set(key, JSON.stringify(value));
  }

  private update(subject: BehaviorSubject<DropdownItem[]>, list: DropdownItem[]) {
    subject.next([...list].sort((a, b) => a.order - b.order));
    this.persist();
  }

  private persist() {
    this.setData(COOKIE_KEYS.TYPES, this.bodyTypes$.value);
    this.setData(COOKIE_KEYS.SUBTYPES, this.bodySubTypes$.value);
  }

  // Public getters
  getBodyTypes() { return this.bodyTypes$.asObservable(); }
  getBodySubTypes() { return this.bodySubTypes$.asObservable(); }

  // CRUD operations
  addMainType(item: DropdownItem) { this.update(this.bodyTypes$, [...this.bodyTypes$.value, item]); }
  addSubType(item: DropdownItem) { this.update(this.bodySubTypes$, [...this.bodySubTypes$.value, item]); }
  setBodyTypes(list: DropdownItem[]) { this.update(this.bodyTypes$, list); }
  setSubTypes(list: DropdownItem[]) { this.update(this.bodySubTypes$, list); }
  removeMainType(id: number) { this.update(this.bodyTypes$, this.bodyTypes$.value.filter(i => i.id !== id)); }
  removeSubType(id: number) { this.update(this.bodySubTypes$, this.bodySubTypes$.value.filter(i => i.id !== id)); }
  updateMainType(item: DropdownItem) {
    const updated = this.bodyTypes$.value.map(t => (t.id === item.id ? { ...t, ...item } : t));
    this.update(this.bodyTypes$, updated);
  }
  updateSubType(item: DropdownItem) {
    const updated = this.bodySubTypes$.value.map(t => (t.id === item.id ? { ...t, ...item } : t));
    this.update(this.bodySubTypes$, updated);
  }
}