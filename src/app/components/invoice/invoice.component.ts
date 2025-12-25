import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {
  public rowData: any[] = [];
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    private _http: HttpService,
    private _toaster: ToastrService
  ) { }

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  public columnDefs: ColDef[] = [
    {
      field: 'orderId',
      headerName: 'Order ID'
    },
    {
      field: 'invoiceNo',
      headerName: 'Invoice No'
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      cellRenderer: (params: any) => params.value
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment Method'
    },
    {
      field: 'orderStatus',
      headerName: 'Order Status',
      cellRenderer: (params: any) => params.value
    },
    {
      field: 'subTotalAmount',
      headerName: 'Sub Total'
    },
    {
      field: 'shippingAmount',
      headerName: 'Shipping Amount'
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount'
    },
    {
      field: 'paymentDate',
      headerName: 'Payment Date',
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric'
        }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.agGrid.api = params.api;
    this.agGrid.columnApi = params.columnApi;

    this._http.get(environment.BASE_API_PATH + 'PaymentMaster/GetReportInvoiceList')
      .subscribe((res: any) => {
        if (res.isSuccess) {
          this.rowData = res.data;
        } else {
          this._toaster.error(res.errors?.[0] || 'Error fetching orders', 'Dashboard');
        }
      });
  }

  onCellClicked(e: CellClickedEvent): void {
    // console.log('Cell clicked', e);
  }
}
