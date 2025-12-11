import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';

interface Count {
  from: number;
  Duration: number;
  ShoppingAmount: number;
  Orders: number;
  CashOnDelivery: number;
  Cancelled: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  count: Count = {
    from: 0,
    Duration: 0,
    ShoppingAmount: 0,
    Orders: 0,
    CashOnDelivery: 0,
    Cancelled: 0,
  };

  stats: { title: string; key: keyof Count; bg: string; icon: string; iconClass: string }[] = [
    { title: "Orders", key: "Orders", bg: "bg-warning", icon: "navigation", iconClass: "font-secondary" },
    { title: "Shipping Amount", key: "ShoppingAmount", bg: "bg-secondary", icon: "box", iconClass: "font-secondary" },
    { title: "Cash On Delivery", key: "CashOnDelivery", bg: "bg-primary", icon: "message-square", iconClass: "font-primary" },
    { title: "Cancelled", key: "Cancelled", bg: "bg-danger", icon: "users", iconClass: "font-danger" }
  ];

  // AG Grid
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

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  public rowData: any[] = [];

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    private _http: HttpService,
    private _toaster: ToastrService
  ) { }

  ngOnInit() {
    this.getNetFigure();
  }

  getNetFigure() {
    this._http.get(environment.BASE_API_PATH + 'PaymentMaster/GetReportNetFigure')
      .subscribe((res: any) => {
        if (res.isSuccess && res.data.length > 0) {
          const data = res.data[0];
          this.count.ShoppingAmount = data.shippingAmount;
          this.count.Orders = data.orders;
          this.count.CashOnDelivery = data.cashOnDelivery;
          this.count.Cancelled = data.cancelled;
        } else {
          this._toaster.error(res.errors?.[0] || 'Error fetching data', 'Dashboard');
        }
      });
  }

  onGridReady(params: GridReadyEvent) {
    this.agGrid.api = params.api;
    this.agGrid.columnApi = params.columnApi;

    this._http.get(environment.BASE_API_PATH + 'PaymentMaster/GetReportManageOrder')
      .subscribe((res: any) => {
        if (res.isSuccess) {
          debugger;
          this.rowData = res.data;
        } else {
          this._toaster.error(res.errors?.[0] || 'Error fetching orders', 'Dashboard');
        }
      });
  }

  onCellClicked(e: CellClickedEvent): void {
    console.log('Cell clicked', e);
  }

  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }
}
