import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {
  title = 'app';
  socket = io('localhost:9500');
  memChart = undefined;
  cpuChart = undefined;
  cpuType = '';
  noOfCpu = '';
  constructor() { }

  ngOnInit(): void {
    // ---------------------------------------------------Section II
    const ctx = document.getElementById('mChart');
    const doughnutGraphData = {
      datasets: [{
        data: [1, 0],
        backgroundColor: ['#36a2eb', '#ff6384'],
      }],
      labels: [
        'Free',
        'Used',
      ]
    };

    const ctx2 = document.getElementById('cChart');
    const cpuLoadGraphData = {
      datasets: [{
        label: '15 min average',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
      }],
      labels: ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],

    };

// ----------------------------------------------------------------------Section III
    this.socket.on('connected', (connectData: any) => this.connected(connectData));
    //this.socket.on('os-update', (event: { freemem: number; totalmem: number; loadavg: any[]; }) => this.updateCharts(event));
  }

  connected(connectData: { types: string; cpus: string; freemem: string; resource: string; pythonCount: string;}) {
    this.cpuType = connectData.types;
    this.noOfCpu = connectData.cpus;
    console.log(this.cpuType);
    console.log(this.noOfCpu);
    console.log(connectData.freemem);
    console.log("resource: " + connectData.resource);
    console.log(connectData.pythonCount);
  }
}
