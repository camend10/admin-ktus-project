import { Component, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { DashboardService } from 'src/app/pages/dashboard/service/dashboard.service';
import { ResponseVentaXMesDelYearA, VentaXMesDelYearA } from 'src/app/pages/dashboard/interfaces';

interface SeriesData {
  name: string;
  data: number[];
}


@Component({
  selector: 'app-mixed-widget11',
  templateUrl: './mixed-widget11.component.html',
})

export class MixedWidget11Component implements OnInit {


  @Input() chartColor: string = '';
  @Input() chartHeight: string;
  @Input() year: number = 0;
  total_venta_year_actual: number = 0;
  years: number[] = [];
  chartOptions: any = {};

  ventas_x_mes_del_year: ResponseVentaXMesDelYearA | null = null; // Acepta null inicialmente

  constructor(public dashboardService: DashboardService,) { }

  ngOnInit(): void {
    this.initializeYears();
    this.ventasXMesDelYear();
  }

  ventasXMesDelYear() {
    let data = {
      year: this.year,
    }

    this.ventas_x_mes_del_year = null;

    this.dashboardService.ventasXMesDelYear(data).subscribe((response) => {
      // console.log(response);
      let series_data: SeriesData[] = [];
      let categories_labels: string[] = response.meses_nombre;

      this.ventas_x_mes_del_year = response;
      this.total_venta_year_actual = response.total_venta_year_actual;

      // let ventas_por_mes_year_actual: number[] = [];
      // Inicializar ventas por mes con valores en 0 para ambos años
      let ventas_por_mes_year_actual: number[] = new Array(12).fill(0);
      let ventas_por_mes_year_anterior: number[] = new Array(12).fill(0);

      response.venta_x_mes_del_year_actual.forEach((item: VentaXMesDelYearA) => {
        // ventas_por_mes_year_actual.push(item.total_venta);
        const mesIndex = parseInt(item.created_at_format.split("-")[1], 10) - 1; // Obtener el índice del mes (base 0)
        ventas_por_mes_year_actual[mesIndex] = item.total_venta;
      });

      // let ventas_por_mes_year_anterior: number[] = [];
      response.venta_x_mes_del_year_anterior.forEach((item: VentaXMesDelYearA) => {
        // ventas_por_mes_year_anterior.push(item.total_venta);
        const mesIndex = parseInt(item.created_at_format.split("-")[1], 10) - 1; // Obtener el índice del mes (base 0)
        ventas_por_mes_year_anterior[mesIndex] = item.total_venta;
      });

      // Agregar las series al gráfico
      series_data.push({
        name: `Ventas del año ${this.year}`,
        data: ventas_por_mes_year_actual,
      });

      series_data.push({
        name: `Ventas del año ${this.year - 1}`,
        data: ventas_por_mes_year_anterior,
      });

      this.chartOptions = getChartOptions(this.chartHeight, this.chartColor, categories_labels, series_data);
    });
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear(); // Año actual
    const startYear = 2024; // Año fijo inicial
    const range = 10; // Número de años en el rango

    // Generar el rango de años asegurando que 2024 esté incluido
    this.years = Array.from({ length: range }, (_, i) => startYear + i);

    // Establecer el año actual como valor predeterminado si está dentro del rango
    this.year = this.years.includes(currentYear) ? currentYear : startYear;
  }
}

function getChartOptions(chartHeight: string, chartColor: string, meses_nombre: string[] = [], series_data: { name: string; data: number[] }[] = []) {
  const labelColor = getCSSVariableValue('--bs-gray-500');
  const borderColor = getCSSVariableValue('--bs-gray-200');
  const secondaryColor = getCSSVariableValue('--bs-gray-300');
  const baseColor = getCSSVariableValue('--bs-' + chartColor);

  return {
    series: series_data,
    // [
    //   {
    //     name: 'Net Profit',
    //     data: [50, 60, 70, 80, 60, 50, 70, 60],
    //   },
    //   {
    //     name: 'Revenue',
    //     data: [50, 60, 70, 80, 60, 50, 70, 60],
    //   },
    // ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: chartHeight,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 5,
      },
    },
    legend: {
      show: true,
      position: 'top',
      labels: {
        colors: labelColor,
        useSeriesColors: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: meses_nombre,//['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      axisBorder: {
        show: true,
        color: borderColor,
      },
      axisTicks: {
        show: true,
        color: borderColor,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
        formatter: function (val: number) {
          const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
          const formattedValue = formatter.format(Number(val));
          return `${formattedValue}`;
        },
      },
    },
    fill: {
      type: 'solid',
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        // formatter: function (val: number) {
        //   return '$' + val + ' revenue';
        // },
        formatter: function (val: number) {
          const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });
          const formattedValue = formatter.format(Number(val));
          return `${formattedValue}`;
        },
      },
    },
    colors: [baseColor, secondaryColor],
    // colors: ['#FF4560', '#008FFB'],
    grid: {
      padding: {
        top: 10,
      },
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };
}
