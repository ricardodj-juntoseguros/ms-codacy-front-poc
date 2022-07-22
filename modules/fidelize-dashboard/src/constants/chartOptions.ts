import { ApexOptions } from 'apexcharts';
import ptBR from 'apexcharts/dist/locales/pt-br.json';

export const CHART_OPTIONS: ApexOptions = {
  chart: {
    type: 'line',
    fontFamily: 'Metropolis',
    locales: [ptBR],
    defaultLocale: 'pt-br',
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    opacity: 1,
  },
  grid: {
    strokeDashArray: 2,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  legend: {
    position: 'top',
    fontSize: '14px',
    offsetX: -55,
    fontWeight: 400,
    itemMargin: { horizontal: 8 },
    markers: {
      height: 10,
      width: 10,
      radius: 5,
      offsetX: -8,
      offsetY: -8,
    },
    onItemClick: { toggleDataSeries: false },
  },
  markers: {
    size: [3],
    hover: { size: 6 },
    strokeColors: ['#180a33'],
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
    },
  },
  stroke: {
    width: [1, 2],
    curve: 'smooth',
    lineCap: 'round',
  },
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    fixed: {
      enabled: true,
      position: 'topLeft',
      offsetX: 25,
      offsetY: 10,
    },
  },
  xaxis: {
    labels: {
      rotate: 0,
      style: { fontSize: '10px', colors: '#4A5365' },
      hideOverlappingLabels: false,
      show: true,
    },
    axisTicks: { show: true },
    tooltip: { enabled: false },
  },
  yaxis: [
    {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        style: {
          colors: '#85909A',
        },
      },
    },
    {
      opposite: true,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        style: {
          colors: '#85909A',
        },
      },
    },
  ],
};
