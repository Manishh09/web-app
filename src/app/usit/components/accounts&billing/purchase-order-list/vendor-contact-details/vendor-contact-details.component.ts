import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PurchaseOrderService } from 'src/app/usit/services/purchase-order.service';

@Component({
  selector: 'app-vendor-contact-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './vendor-contact-details.component.html',
  styleUrls: ['./vendor-contact-details.component.scss']
})
export class VendorContactDetailsComponent implements OnInit {

  dataSource: any;
  private purchaseOrderServ = inject(PurchaseOrderService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<VendorContactDetailsComponent>);

  ngOnInit(): void {
    this.getVendorContactDetails()
  }

  getVendorContactDetails() {
    this.purchaseOrderServ.getPoById(this.data.id).subscribe(
      (resp: any) => {
        if(resp.status === 'success'){
          if(resp.data){
            this.dataSource = resp.data;
          }
        }
      }
    )
  }

}
