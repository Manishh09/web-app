import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrivilegesService {

  private privileges: string[] = [];

  setPrivileges(privileges: string[]): void {
    this.privileges = privileges;
  }

  getPrivileges(): string[] {
    return this.privileges;
  }
}
