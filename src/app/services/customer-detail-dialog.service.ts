import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerDetailDialogService {
  private dialogState = new BehaviorSubject<{ visible: boolean, customerId: number | null }>({ visible: false, customerId: null });

  getDialogState() {
    return this.dialogState.asObservable();
  }

  showDialog(customerId: number) {
    this.dialogState.next({ visible: true, customerId });
  }

  hideDialog() {
    this.dialogState.next({ visible: false, customerId: null });
  }
}
