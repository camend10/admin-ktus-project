import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { Sede } from 'src/app/modules/configuracion/sedes/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { DashboardService } from './service/dashboard.service';
import { User } from 'src/app/modules/users/interfaces';
import { AuthService } from 'src/app/modules/auth';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ArticuloArticulo, CategoriasMasVenta, Informacion, ResponseArticulo, ResponseVendedorMasVenta, SedeMasVenta, VendedorMasVenta, VendedorVentaSemana, VentaDiaDelMes, VentaSede, VentaXSegmentoCliente } from './interfaces';


declare var KTUtil: any;
declare var KTThemeMode: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  isLoading$: Observable<boolean>;

  sedes: Sede[] = [];
  sede_id: number = 9999999;
  sede_id_2: number = 9999999;
  year: string = '';
  years: number[] = [];
  month: string = '';
  months = [
    { value: '01', name: 'Enero' },
    { value: '02', name: 'Febrero' },
    { value: '03', name: 'Marzo' },
    { value: '04', name: 'Abril' },
    { value: '05', name: 'Mayo' },
    { value: '06', name: 'Junio' },
    { value: '07', name: 'Julio' },
    { value: '08', name: 'Agosto' },
    { value: '09', name: 'Septiembre' },
    { value: '10', name: 'Octubre' },
    { value: '11', name: 'Noviembre' },
    { value: '12', name: 'Diciembre' },
  ];
  year_vs: number = 0;
  year_2: number = 0;
  year_3: number = 0;
  year_4: number = 0;
  year_5: number = 0;
  month_vs: string = '';
  month_2: string = '';
  month_3: string = '';
  month_4: string = '';
  month_5: string = '';

  user: User;

  // INFORMACION GENERAL
  total_compra: number = 0;
  total_clientes: number = 0;
  total_ventas: number = 0;
  sede_mas_venta: SedeMasVenta | null = null;
  // INFORMACION GENERAL

  // VENTAS POR SEDES
  ventas_x_sedes: VentaSede[] = [];
  ventas_total_x_sedes: number = 0;
  porcentaje_ventas_sedes: number = 0;
  // VENTAS POR SEDES

  //VENTAS DIA DEL MES
  venta_dia_del_mes: VentaDiaDelMes[] = [];
  ventas_total_x_day_mes: number = 0;
  ventas_total_pasado_x_day_mes: number = 0;
  porcentaje_ventas_x_dia_mes: number = 0;
  nombre_sede: string = 'Todas las Sedes';
  //VENTAS DIA DEL MES

  //VENTAS POR SEGMENTO
  venta_x_segmento_clientes: VentaXSegmentoCliente[] = [];
  total_venta_segmento: number = 0;
  //VENTAS POR SEGMENTO

  //VENDEDOR MAS VENTAS
  vendedores: ResponseVendedorMasVenta;
  vendedor_mas_venta: VendedorMasVenta | null = null;
  vendedor_total_venta_mes_actual: number = 0;
  vendedor_total_venta_mes_anterior: number = 0;
  vendedor_porcentaje_mas_ventas: number = 0;
  vendedor_venta_semana: VendedorVentaSemana[] = [];
  //VENDEDOR MAS VENTAS

  //CATEGORIAS MAS VENTAS
  categorias_mas_ventas: CategoriasMasVenta[] = [];
  list_categories: ResponseArticulo[] = [];
  products_x_categories: ArticuloArticulo[] = [];
  option_selected: string = '';
  //CATEGORIAS MAS VENTAS

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;

  constructor(
    public generalService: GeneralesService,
    public dashboardService: DashboardService,
    public authService: AuthService,
    public toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.dashboardService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.closeSidebar();
    this.config_all();
    this.initializeYears();
    this.initializeCurrentMonth();
    // this.listar();
  }

  ngOnDestroy(): void {
    // Quitar el atributo cuando el componente se destruye
    document.body.removeAttribute('data-kt-app-sidebar-minimize');
  }

  closeSidebar() {
    const bodyTag = document.body;
    bodyTag.setAttribute('data-kt-app-sidebar-minimize', 'on');
  }

  config_all() {
    this.dashboardService.config_all()
      .subscribe((response) => {
        this.year = response.year;
        this.month = response.month;
        this.ventasXSedes();
        this.ventasXDiaMes();
        this.ventasXSegmentoCliente();
        this.ventasXVendedor();
        this.ventasXCategorias();
        this.isLoadingProcess();
      });
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguracionesArticulos(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.sedes = response.sedes;
      });
  }

  cargarInformacion() {
    if (this.year_vs === 9999999) {
      this.toast.error('Validación', 'Por favor seleccione un año');
      return false;
    }

    if (this.month_vs === '9999999') {
      this.toast.error('Validación', 'Por favor seleccione un mes');
      return false;
    }

    let data = {
      year: this.year_vs,
      month: this.month_vs
    }
    this.dashboardService.informacion(data).subscribe((response) => {
      this.total_compra = response.total_compra;
      this.total_clientes = response.total_clientes;
      this.total_ventas = response.total_ventas;
      this.sede_mas_venta = response.sede_mas_venta;
    });
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear(); // Año actual
    const startYear = 2024; // Año fijo inicial
    const range = 10; // Número de años en el rango

    // Generar el rango de años asegurando que 2024 esté incluido
    this.years = Array.from({ length: range }, (_, i) => startYear + i);

    // Establecer el año actual como valor predeterminado si está dentro del rango
    this.year_vs = this.years.includes(currentYear) ? currentYear : startYear;
    this.year_2 = this.years.includes(currentYear) ? currentYear : startYear;
    this.year_3 = this.years.includes(currentYear) ? currentYear : startYear;
    this.year_4 = this.years.includes(currentYear) ? currentYear : startYear;
    this.year_5 = this.years.includes(currentYear) ? currentYear : startYear;
  }

  initializeCurrentMonth(): void {
    const currentMonth = new Date().getMonth() + 1; // Mes actual (1-12)
    this.month_vs = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`; // Formato de dos dígitos
    this.month_2 = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`; // Formato de dos dígitos
    this.month_3 = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`; // Formato de dos dígitos
    this.month_4 = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`; // Formato de dos dígitos
    this.month_5 = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`; // Formato de dos dígitos
  }

  ventasXSedes() {
    if (this.year_vs === 9999999) {
      this.toast.error('Validación', 'Por favor seleccione un año');
      return false;
    }

    if (this.month_vs === '9999999') {
      this.toast.error('Validación', 'Por favor seleccione un mes');
      return false;
    }
    let data = {
      year: this.year_vs,
      month: this.month_vs
    }
    this.ventas_x_sedes = [];
    this.dashboardService.ventasXSedes(data).subscribe((response) => {
      this.cargarInformacion();

      this.ventas_x_sedes = response.venta_sedes;
      this.ventas_total_x_sedes = response.total_venta_sedes;
      this.porcentaje_ventas_sedes = response.porcentajeV;

      let series_data: number[] = [];
      let categories_labels: string[] = [];

      this.ventas_x_sedes.forEach((item: VentaSede) => {
        // const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
        // const formattedValue = formatter.format(Number(item.total_venta));
        series_data.push(item.total_venta);
        categories_labels.push(item.sede_nombre.replace("Sede", 'S.'));
      });

      var KTChartsWidget27 = function () {
        var e: any = {
          self: null,
          rendered: !1
        },
          t = function (e: any) {
            var t = document.getElementById("kt_charts_widget_27");
            if (t) {
              var a = KTUtil.getCssVariableValue("--bs-gray-800"),
                l = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
                r = {
                  series: [{
                    name: "Ventas",
                    data: series_data,//[12.478, 7.546, 6.083, 5.041, 4.42]
                  }],
                  chart: {
                    fontFamily: "inherit",
                    type: "bar",
                    height: 350,
                    toolbar: {
                      show: !1
                    }
                  },
                  plotOptions: {
                    bar: {
                      borderRadius: 8,
                      horizontal: !0,
                      distributed: !0,
                      barHeight: 50,
                      dataLabels: {
                        position: "bottom"
                      }
                    }
                  },
                  dataLabels: {
                    enabled: !0,
                    textAnchor: "start",
                    offsetX: 0,
                    // formatter: function(e:any, t:any) {
                    //     e *= 1e3;
                    //     return wNumb({
                    //         thousand: ","
                    //     }).to(e)
                    // },
                    formatter: function (val: number) {
                      const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
                      const formattedValue = formatter.format(Number(val));
                      return `${formattedValue}`;
                    },
                    style: {
                      fontSize: "14px",
                      fontWeight: "600",
                      align: "left"
                    }
                  },
                  legend: {
                    show: !1
                  },
                  colors: ["#3E97FF", "#F1416C", "#50CD89", "#FFC700", "#7239EA"],
                  xaxis: {
                    categories: categories_labels,//["USA", "India", "Canada", "Brasil", "France"],
                    labels: {
                      formatter: function (e: number) {
                        // return e.split(' ').join('\n');
                        if (e >= 1000) {
                          // Divide entre 1000 y añade la K
                          return (e / 1000).toFixed(0) + "K ";
                        }
                        return e.toString();
                      },
                      // formatter: function (val: number) {
                      //   const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
                      //   const formattedValue = formatter.format(Number(val));
                      //   return `${formattedValue}`;
                      // },
                      style: {
                        colors: a,
                        fontSize: "10px",
                        fontWeight: "700",
                        align: "left"
                      }
                    },
                    axisBorder: {
                      show: !1
                    }
                  },
                  yaxis: {
                    labels: {
                      formatter: function (et: any, t: any) {
                        let result = parseInt((100 * et / 18) + "");
                        return Number.isInteger(et) ? et + " - " + result.toString() + "%" : et
                      },
                      style: {
                        colors: a,
                        fontSize: "14px",
                        fontWeight: "600"
                      },
                      offsetY: 2,
                      align: "left"
                    }
                  },
                  grid: {
                    borderColor: l,
                    xaxis: {
                      lines: {
                        show: !0
                      }
                    },
                    yaxis: {
                      lines: {
                        show: !1
                      }
                    },
                    strokeDashArray: 4
                  },
                  tooltip: {
                    style: {
                      fontSize: "12px"
                    },
                    y: {
                      // formatter: function (e: any) {
                      //   return e
                      // }
                      formatter: function (val: number) {
                        const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
                        const formattedValue = formatter.format(Number(val));
                        return `${formattedValue}`;
                      },
                    }
                  }
                };
              e.self = new ApexCharts(t, r), setTimeout((function () {
                e.self.render(), e.rendered = !0
              }), 200)
            }
          };
        return {
          init: function () {
            t(e), KTThemeMode.on("kt.thememode.change", (function () {
              e.rendered && e.self.destroy(), t(e)
            }))
          }
        }
      }();

      setTimeout(() => {
        KTUtil.onDOMContentLoaded((function () {
          KTChartsWidget27.init()
        }));
      }, 50);
    });
  }

  ventasXDiaMes() {
    if (this.year_2 === 9999999) {
      this.toast.error('Validación', 'Por favor seleccione un año');
      return false;
    }

    if (this.month_2 === '9999999') {
      this.toast.error('Validación', 'Por favor seleccione un mes');
      return false;
    }

    let data = {
      year: this.year_2,
      month: this.month_2,
      sede_id: this.sede_id
    }

    this.venta_dia_del_mes = [];
    this.dashboardService.ventasXDiaMes(data).subscribe((response) => {

      let series_data: number[] = [];
      let categories_labels: string[] = [];


      this.venta_dia_del_mes = response.venta_dia_del_mes;
      this.venta_dia_del_mes.forEach((item: VentaDiaDelMes) => {
        series_data.push(item.total_venta);
        categories_labels.push(item.dia_created_format);
      });
      let MIN = Math.min(...series_data);
      let MAX = Math.max(...series_data);

      this.ventas_total_x_day_mes = response.total_venta_actual;
      this.ventas_total_pasado_x_day_mes = response.total_venta_pasada;
      this.porcentaje_ventas_x_dia_mes = response.porcentajeV;

      var KTChartsWidget3 = function () {
        var e: any = {
          self: null,
          rendered: !1
        },
          t = function (e: any) {
            var t = document.getElementById("kt_charts_widget_3");
            if (t) {
              var a = parseInt(KTUtil.css(t, "height")),
                l = KTUtil.getCssVariableValue("--bs-gray-500"),
                r = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
                o = KTUtil.getCssVariableValue("--bs-success"),
                i = {
                  series: [{
                    name: "Ventas",
                    data: series_data,//[18, 18, 20, 20, 18, 18, 22, 22, 20, 20, 18, 18, 20, 20, 18, 18, 20, 20, 22]
                  }],
                  chart: {
                    fontFamily: "inherit",
                    type: "area",
                    height: a,
                    toolbar: {
                      show: !1
                    }
                  },
                  plotOptions: {},
                  legend: {
                    show: !1
                  },
                  dataLabels: {
                    enabled: !1
                  },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: .4,
                      opacityTo: 0,
                      stops: [0, 80, 100]
                    }
                  },
                  stroke: {
                    curve: "smooth",
                    show: !0,
                    width: 3,
                    colors: [o]
                  },
                  xaxis: {
                    categories: categories_labels,//["", "Apr 02", "Apr 03", "Apr 04", "Apr 05", "Apr 06", "Apr 07", "Apr 08", "Apr 09", "Apr 10", "Apr 11", "Apr 12", "Apr 13", "Apr 14", "Apr 15", "Apr 16", "Apr 17", "Apr 18", ""],
                    axisBorder: {
                      show: !1
                    },
                    axisTicks: {
                      show: !1
                    },
                    tickAmount: 6,
                    labels: {
                      rotate: 0,
                      rotateAlways: !0,
                      style: {
                        colors: l,
                        fontSize: "12px"
                      }
                    },
                    crosshairs: {
                      position: "front",
                      stroke: {
                        color: o,
                        width: 1,
                        dashArray: 3
                      }
                    },
                    tooltip: {
                      enabled: !0,
                      formatter: void 0,
                      offsetY: 0,
                      style: {
                        fontSize: "12px"
                      }
                    }
                  },
                  yaxis: {
                    tickAmount: 4,
                    max: MAX,
                    min: MIN,
                    labels: {
                      style: {
                        colors: l,
                        fontSize: "12px"
                      },
                      // formatter: function (e: any) {
                      //   return "$" + e
                      // }
                      formatter: function (val: number) {
                        const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
                        const formattedValue = formatter.format(Number(val));
                        return `${formattedValue}`;
                      },
                    }
                  },
                  states: {
                    normal: {
                      filter: {
                        type: "none",
                        value: 0
                      }
                    },
                    hover: {
                      filter: {
                        type: "none",
                        value: 0
                      }
                    },
                    active: {
                      allowMultipleDataPointsSelection: !1,
                      filter: {
                        type: "none",
                        value: 0
                      }
                    }
                  },
                  tooltip: {
                    style: {
                      fontSize: "12px"
                    },
                    y: {
                      // formatter: function (e: any) {
                      //   return "$" + e + " k"
                      // }
                      formatter: function (val: number) {
                        const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
                        const formattedValue = formatter.format(Number(val));
                        return `${formattedValue}`;
                      },
                    }
                  },
                  colors: [KTUtil.getCssVariableValue("--bs-success")],
                  grid: {
                    borderColor: r,
                    strokeDashArray: 4,
                    yaxis: {
                      lines: {
                        show: !0
                      }
                    }
                  },
                  markers: {
                    strokeColor: o,
                    strokeWidth: 3
                  }
                };
              e.self = new ApexCharts(t, i), setTimeout((function () {
                e.self.render(), e.rendered = !0
              }), 200)
            }
          };
        return {
          init: function () {
            t(e), KTThemeMode.on("kt.thememode.change", (function () {
              e.rendered && e.self.destroy(), t(e)
            }))
          }
        }
      }();

      setTimeout(() => {
        KTUtil.onDOMContentLoaded((function () {
          KTChartsWidget3.init()
        }));
      }, 50);

    });
  }

  actualizarNombreSede(): void {
    
    if (this.sede_id === 9999999) {
      this.nombre_sede = 'Todas las Sedes';
    } else {
      const sedeSeleccionada = this.sedes.find((sede) => Number(sede.id) === Number(this.sede_id));
      this.nombre_sede = sedeSeleccionada ? sedeSeleccionada.nombre : 'Sede Desconocida';
    }
  }

  ventasXSegmentoCliente() {
    if (this.year_3 === 9999999) {
      this.toast.error('Validación', 'Por favor seleccione un año');
      return false;
    }

    if (this.month_3 === '9999999') {
      this.toast.error('Validación', 'Por favor seleccione un mes');
      return false;
    }

    let data = {
      year: this.year_3,
      month: this.month_3,
      sede_id: this.sede_id_2
    }

    this.venta_x_segmento_clientes = [];
    this.dashboardService.ventasXSegmentoCliente(data).subscribe((response) => {

      let series_data: number[] = [];
      let categories_labels: string[] = [];

      this.venta_x_segmento_clientes = response.venta_x_segmento_clientes;

      this.venta_x_segmento_clientes.forEach((item: VentaXSegmentoCliente) => {
        series_data.push(item.total_venta);
        categories_labels.push(item.nombre_segmento);
      });

      this.total_venta_segmento = response.total_venta_segmento;

      var KTChartsWidget18 = function () {
        var e: any = {
          self: null,
          rendered: !1
        },
          t = function (e: any) {
            var t = document.getElementById("kt_charts_widget_18_chart");
            if (t) {
              var a = parseInt(KTUtil.css(t, "height")),
                l = KTUtil.getCssVariableValue("--bs-gray-900"),
                r = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
                o = {
                  series: [{
                    name: "Ventas",
                    data: series_data,//[54, 42, 75, 110, 23, 87, 50]
                  }],
                  chart: {
                    fontFamily: "inherit",
                    type: "bar",
                    height: a,
                    toolbar: {
                      show: !1
                    }
                  },
                  plotOptions: {
                    bar: {
                      horizontal: !1,
                      columnWidth: ["28%"],
                      borderRadius: 5,
                      dataLabels: {
                        position: "top"
                      },
                      startingShape: "flat"
                    }
                  },
                  legend: {
                    show: !1
                  },
                  dataLabels: {
                    enabled: !0,
                    offsetY: -28,
                    style: {
                      fontSize: "13px",
                      colors: [l]
                    },
                    formatter: function (e: any) {
                      const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
                      return `${formatter.format(e)} `;
                    }
                  },
                  stroke: {
                    show: !0,
                    width: 2,
                    colors: ["transparent"]
                  },
                  xaxis: {
                    categories: categories_labels,//["QA Analysis", "Marketing", "Web Dev", "Maths", "Front-end Dev", "Physics", "Phylosophy"],
                    axisBorder: {
                      show: !1
                    },
                    axisTicks: {
                      show: !1
                    },
                    labels: {
                      style: {
                        colors: KTUtil.getCssVariableValue("--bs-gray-500"),
                        fontSize: "13px"
                      }
                    },
                    crosshairs: {
                      fill: {
                        gradient: {
                          opacityFrom: 0,
                          opacityTo: 0
                        }
                      }
                    }
                  },
                  yaxis: {
                    labels: {
                      style: {
                        colors: KTUtil.getCssVariableValue("--bs-gray-500"),
                        fontSize: "13px"
                      },
                      formatter: function (e: any) {
                        const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
                        return `${formatter.format(e)} `;
                      }
                    }
                  },
                  fill: {
                    opacity: 1
                  },
                  states: {
                    normal: {
                      filter: {
                        type: "none",
                        value: 0
                      }
                    },
                    hover: {
                      filter: {
                        type: "none",
                        value: 0
                      }
                    },
                    active: {
                      allowMultipleDataPointsSelection: !1,
                      filter: {
                        type: "none",
                        value: 0
                      }
                    }
                  },
                  tooltip: {
                    style: {
                      fontSize: "12px"
                    },
                    y: {
                      formatter: function (e: any) {
                        const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
                        return `${formatter.format(e)} `;
                      }
                    }
                  },
                  colors: [KTUtil.getCssVariableValue("--bs-primary"), KTUtil.getCssVariableValue("--bs-primary-light")],
                  grid: {
                    borderColor: r,
                    strokeDashArray: 4,
                    yaxis: {
                      lines: {
                        show: !0
                      }
                    }
                  }
                };
              e.self = new ApexCharts(t, o), setTimeout((function () {
                e.self.render(), e.rendered = !0
              }), 200)
            }
          };
        return {
          init: function () {
            t(e), KTThemeMode.on("kt.thememode.change", (function () {
              e.rendered && e.self.destroy(), t(e)
            }))
          }
        }
      }();

      setTimeout(() => {
        KTUtil.onDOMContentLoaded((function () {
          KTChartsWidget18.init()
        }));
      }, 50);

    });
  }

  ventasXVendedor() {
    if (this.year_4 === 9999999) {
      this.toast.error('Validación', 'Por favor seleccione un año');
      return false;
    }

    if (this.month_4 === '9999999') {
      this.toast.error('Validación', 'Por favor seleccione un mes');
      return false;
    }

    let data = {
      year: this.year_4,
      month: this.month_4,
    }

    this.vendedor_mas_venta = null;
    this.dashboardService.ventasXVendedor(data).subscribe((response) => {

      this.vendedores = response;
      this.vendedor_mas_venta = response.vendedor_mas_venta;
      this.vendedor_total_venta_mes_actual = response.vendedor_total_venta_mes_actual;
      this.vendedor_porcentaje_mas_ventas = response.porcentajeV;
      let series_data: number[] = [];
      let categories_labels: string[] = [];
      let MONTH_CURRENT: string = response.nombre_mes;

      // this.vendedor_venta_semana = response.vendedor_venta_semana;
      response.vendedor_venta_semana.forEach((item: VendedorVentaSemana) => {
        series_data.push(item.total_venta);
        categories_labels.push(item.dia);
      });

      let KTCardsWidget6 = {
        init: function () {
          var e = document.getElementById("kt_card_widget_6_chart");
          if (e) {
            var t = parseInt(KTUtil.css(e, "height")),
              a = KTUtil.getCssVariableValue("--bs-gray-500"),
              l = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
              r = KTUtil.getCssVariableValue("--bs-primary"),
              o = KTUtil.getCssVariableValue("--bs-gray-300"),
              i = new ApexCharts(e, {
                series: [{
                  name: "Ventas",
                  data: series_data,//[30, 60, 53, 45, 60, 75, 53]
                }],
                chart: {
                  fontFamily: "inherit",
                  type: "bar",
                  height: t,
                  toolbar: {
                    show: !1
                  },
                  sparkline: {
                    enabled: !0
                  }
                },
                plotOptions: {
                  bar: {
                    horizontal: !1,
                    columnWidth: ["55%"],
                    borderRadius: 6
                  }
                },
                legend: {
                  show: !1
                },
                dataLabels: {
                  enabled: !1
                },
                stroke: {
                  show: !0,
                  width: 9,
                  colors: ["transparent"]
                },
                xaxis: {
                  categories: categories_labels,
                  axisBorder: {
                    show: !1
                  },
                  axisTicks: {
                    show: !1,
                    tickPlacement: "between"
                  },
                  labels: {
                    show: !1,
                    style: {
                      colors: a,
                      fontSize: "12px"
                    }
                  },
                  crosshairs: {
                    show: !1
                  }
                },
                yaxis: {
                  labels: {
                    show: !1,
                    style: {
                      colors: a,
                      fontSize: "12px"
                    }
                  }
                },
                fill: {
                  type: "solid"
                },
                states: {
                  normal: {
                    filter: {
                      type: "none",
                      value: 0
                    }
                  },
                  hover: {
                    filter: {
                      type: "none",
                      value: 0
                    }
                  },
                  active: {
                    allowMultipleDataPointsSelection: !1,
                    filter: {
                      type: "none",
                      value: 0
                    }
                  }
                },
                tooltip: {
                  style: {
                    fontSize: "12px"
                  },
                  x: {
                    formatter: function (e: any) {
                      return MONTH_CURRENT + ": " + e
                    }
                  },
                  y: {
                    formatter: function (e: any) {
                      const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
                      return `${formatter.format(e)} `;
                    }
                  }
                },
                colors: [r, o],
                grid: {
                  padding: {
                    left: 10,
                    right: 10
                  },
                  borderColor: l,
                  strokeDashArray: 4,
                  yaxis: {
                    lines: {
                      show: !0
                    }
                  }
                }
              });
            setTimeout((function () {
              i.render()
            }), 300)
          }
        }
      };

      setTimeout(() => {
        KTUtil.onDOMContentLoaded((function () {
          KTCardsWidget6.init()
        }))
      }, 50);

    });
  }

  ventasXCategorias() {
    if (this.year_5 === 9999999) {
      this.toast.error('Validación', 'Por favor seleccione un año');
      return false;
    }

    if (this.month_5 === '9999999') {
      this.toast.error('Validación', 'Por favor seleccione un mes');
      return false;
    }

    let data = {
      year: this.year_5,
      month: this.month_5,
    };

    this.categorias_mas_ventas = [];
    this.list_categories = [];
    this.products_x_categories = [];
    this.dashboardService.ventasXCategorias(data).subscribe((response) => {
      
      if (!response || !response.categorias_mas_ventas || !response.categorias_articulos) {
        console.error("Error: Respuesta inválida del backend.");
        return;
      }

      this.categorias_mas_ventas = response.categorias_mas_ventas;

      let series_data: number[] = [];
      let categories_labels: string[] = [];
      this.categorias_mas_ventas.forEach((item: CategoriasMasVenta) => {
        series_data.push(item.total_venta);
        categories_labels.push(item.categoria);
      });

      this.list_categories = response.categorias_articulos;
      
      if (this.list_categories.length > 0) {
        this.optionSelected(this.list_categories[0].id, this.list_categories[0].articulos);
      }

      var KTChartsWidget22 = function () {
        var e = function (e: any, t: any, a: any, l: any) {
          var r = document.querySelector(t);
          if (!r) {
            console.error(`Elemento con selector ${t} no encontrado.`);
            return;
          }
          var o = {
            series: a,
            chart: {
              fontFamily: "inherit",
              type: "donut",
              width: 250,
            },
            plotOptions: {
              pie: {
                donut: {
                  size: "50%",
                  labels: {
                    value: {
                      fontSize: "10px",
                    },
                  },
                },
              },
            },
            colors: [
              KTUtil.getCssVariableValue("--bs-info"),
              KTUtil.getCssVariableValue("--bs-success"),
              KTUtil.getCssVariableValue("--bs-primary"),
              KTUtil.getCssVariableValue("--bs-danger"),
              "#7fffd4",
              "#87ceeb",
              "#4169e1",
              "#3cb371",
              "#808000",
              "#008080",
              "#fff8dc",
              "#bc8f8f",
              "#a0522d",
              "#cd853f",
              "#b8860b",
              "#2f4f4f",
              "#d2b48c",
            ],
            stroke: {
              width: 0,
            },
            labels: categories_labels,
            legend: {
              show: false,
            },
            fill: {
              type: "solid",
            },
          };
          var i = new ApexCharts(r, o),
            s: any = false,
            n = document.querySelector(e);
          if (!n) {
            console.error(`Elemento con selector ${e} no encontrado.`);
            return;
          }
          if (l) {
            i.render();
            s = true;
          }
          n.addEventListener("shown.bs.tab", function () {
            if (!s) {
              i.render();
              s = true;
            }
          });
        };
        return {
          init: function () {
            e(
              "#kt_chart_widgets_22_chart_1",
              "#kt_chart_widgets_22_chart_1",
              series_data,
              true
            );
          },
        };
      }();

      setTimeout(() => {
        KTUtil.onDOMContentLoaded(function () {
          KTChartsWidget22.init();
        });
      }, 50);
    });
  }

  getColorTag(i: number) {
    let colors = [
      KTUtil.getCssVariableValue("--bs-info"),
      KTUtil.getCssVariableValue("--bs-success"),
      KTUtil.getCssVariableValue("--bs-primary"),
      KTUtil.getCssVariableValue("--bs-danger"),
      '#7fffd4', '#87ceeb', '#4169e1', '#3cb371', '#808000', '#008080', '#fff8dc',
      '#bc8f8f', '#a0522d', '#cd853f', '#b8860b', '#2f4f4f', '#d2b48c'
    ];
    return colors[i];
  }

  optionSelected(categorie_id: any, articulos: ArticuloArticulo[] = []) {    
    this.option_selected = categorie_id;
    this.products_x_categories = [];
    setTimeout(() => {
      this.products_x_categories = articulos;
      this.isLoadingProcess();
    }, 50);
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  isLoadingProcess() {
    this.dashboardService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.dashboardService.isLoadingSubject.next(false);
    }, 50);
  }
}
