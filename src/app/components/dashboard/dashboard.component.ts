import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
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

  orders = [];

  orderStatusChart: any;

  stats: {
    title: string;
    key: keyof Count;
    bg: string;
    icon: string;
    iconClass: string;
  }[] = [
    {
      title: 'Orders',
      key: 'Orders',
      bg: 'bg-warning',
      icon: 'navigation',
      iconClass: 'font-secondary',
    },
    {
      title: 'Shipping Amount',
      key: 'ShoppingAmount',
      bg: 'bg-secondary',
      icon: 'box',
      iconClass: 'font-secondary',
    },
    {
      title: 'Cash On Delivery',
      key: 'CashOnDelivery',
      bg: 'bg-primary',
      icon: 'message-square',
      iconClass: 'font-primary',
    },
    {
      title: 'Cancelled',
      key: 'Cancelled',
      bg: 'bg-danger',
      icon: 'users',
      iconClass: 'font-danger',
    },
  ];

  // AG Grid
  public columnDefs: ColDef[] = [
    {
      field: 'orderId',
      headerName: 'Order ID',
    },
    {
      field: 'invoiceNo',
      headerName: 'Invoice No',
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      cellRenderer: (params: any) => params.value,
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment Method',
    },
    {
      field: 'orderStatus',
      headerName: 'Order Status',
      cellRenderer: (params: any) => params.value,
    },
    {
      field: 'subTotalAmount',
      headerName: 'Sub Total',
    },
    {
      field: 'shippingAmount',
      headerName: 'Shipping Amount',
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
    },
    {
      field: 'paymentDate',
      headerName: 'Payment Date',
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return (
          date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) +
          ' ' +
          date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
      },
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  public rowData: any[] = [];

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(private _http: HttpService, private _toaster: ToastrService) {}

  ngOnInit() {
    this.getNetFigure();
    this.getOrdersData();
    this.GetOrderStatusChart();
  }

  getNetFigure() {
    this._http
      .get(environment.BASE_API_PATH + 'PaymentMaster/GetReportNetFigure')
      .subscribe((res: any) => {
        if (res.isSuccess && res.data.length > 0) {
          const data = res.data[0];
          this.count.ShoppingAmount = data.shippingAmount;
          this.count.Orders = data.orders;
          this.count.CashOnDelivery = data.cashOnDelivery;
          this.count.Cancelled = data.cancelled;
        } else {
          this._toaster.error(
            res.errors?.[0] || 'Error fetching data',
            'Dashboard'
          );
        }
      });
  }

  onGridReady(params: GridReadyEvent) {
    this.agGrid.api = params.api;
    this.agGrid.columnApi = params.columnApi;

    this._http
      .get(environment.BASE_API_PATH + 'PaymentMaster/GetReportManageOrder')
      .subscribe((res: any) => {
        if (res.isSuccess) {
          this.rowData = res.data;
        } else {
          this._toaster.error(
            res.errors?.[0] || 'Error fetching orders',
            'Dashboard'
          );
        }
      });
  }

  onCellClicked(e: CellClickedEvent): void {}

  getOrdersData() {
    this._http
      .get(environment.BASE_API_PATH + 'PaymentMaster/GetReportManageOrder')
      .subscribe((res) => {
        if (res.isSuccess) {
          this.orders = res.data;
        } else {
          this._toaster.error(res.errors[0], 'Dashboard');
        }
      });
  }

  GetOrderStatusChart() {
    let objOrderStatusData: any[] = [];
    let arr = ['Date'];

    this._http
      .get(environment.BASE_API_PATH + 'PaymentMaster/GetChartOrderStatus')
      .subscribe((res) => {
        if (res.isSuccess) {
          // counts : 5 date: "02-08-2022" orderStatus: "Processing"
          let allData = res.data;
          let allDates = allData
            .map((item: any) => item.date)
            .filter(
              (value: any, index: any, self: string | any[]) =>
                self.indexOf(value) === index
            );
          let allOrderStatus = allData
            .map((item: any) => item.orderStatus)
            .filter(
              (value: any, index: any, self: string | any[]) =>
                self.indexOf(value) === index
            );

          for (let status of allOrderStatus) {
            arr.push(status);
          }
          objOrderStatusData.push(arr);

          var setZero: any = 0;
          for (let date of allDates) {
            arr = [];
            arr.push(date);

            for (let status of allOrderStatus) {
              arr.push(setZero);
            }

            for (let i in allOrderStatus) {
              for (let index in allData) {
                if (
                  allOrderStatus[i] === allData[index].orderStatus &&
                  date === allData[index].date
                ) {
                  arr[parseInt(i) + 1] = allData[index].counts;
                }
              }
            }

            objOrderStatusData.push(arr);
          }

          //google-chart - ColumnChart
          this.orderStatusChart = {
            chartType: 'ColumnChart',
            dataTable: objOrderStatusData,
            options: {
              legend: { position: 'none' },
              bars: 'vertical',
              vAxis: {
                format: 'decimal',
              },
              height: 340,
              width: '100%',
              colors: ['#ff7f83', '#a5a5a5'],
              backgroundColor: 'transparent',
            },
          };
        } else {
          this._toaster.error(res.errors[0], 'Dashboard');
        }
      });
    // //google-chart - ColumnChart
    // this.orderStatusChart = {
    //   chartType: 'ColumnChart',
    //   dataTable: [
    //     ["Year", "Sales", "Expenses"],
    //     ["100", 2.5, 3.8],
    //     ["200", 3, 1.8],
    //     ["300", 3, 4.3],
    //     ["400", 0.9, 2.3],
    //     ["500", 1.3, 3.6],
    //     ["600", 1.8, 2.8],
    //     ["700", 3.8, 2.8],
    //     ["800", 1.5, 2.8]
    //   ],
    //   options: {
    //     legend: { position: 'none' },
    //     bars: "vertical",
    //     vAxis: {
    //       format: "decimal"
    //     },
    //     height: 340,
    //     width: '100%',
    //     colors: ["#ff7f83", "#a5a5a5"],
    //     backgroundColor: 'transparent'
    //   },
    // };
  }
}
