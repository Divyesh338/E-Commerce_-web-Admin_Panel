import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];

  columnDefs = [
    { headerName: 'Order Id', field: 'orderId' },
    {
      headerName: 'Order Status',
      field: 'orderStatus',
      cellRenderer: (params: any) => params.value,
    },
    { headerName: 'Payment Date', field: 'paymentDate' },
    { headerName: 'Payment Method', field: 'paymentMethod' },
    {
      headerName: 'Payment Status',
      field: 'paymentStatus',
      cellRenderer: (params: any) => params.value,
    },
    { headerName: 'Shipping Amount', field: 'shippingAmount' },
    { headerName: 'SubTotal Amount', field: 'subTotalAmount' },
    { headerName: 'Total Amount', field: 'totalAmount' },
  ];

  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  };

  constructor(
    private _httpService: HttpService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getTransactionsData();
  }

  getTransactionsData() {
    this._httpService
      .get(
        environment.BASE_API_PATH + 'PaymentMaster/GetReportTransactionDetails'
      )
      .subscribe((res: any) => {
        if (res.isSuccess) {
          this.transactions = res.data;
        } else {
          this._toastr.error(res.errors[0], 'Sales');
        }
      });
  }
}
