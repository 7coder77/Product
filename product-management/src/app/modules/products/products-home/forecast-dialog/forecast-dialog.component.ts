import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as d3 from 'd3';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-forecast-dialog',
  templateUrl: './forecast-dialog.component.html',
  styleUrls: ['./forecast-dialog.component.scss'],
})
export class ForecastDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ForecastDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiservice: ApiService
  ) {
    console.log('Received data:', this.data);
  }
  loader= false;
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  ngOnInit(): void {
    this.getDataPoints();
    //   let multiLineData = [
    //   {
    //     name: 'Forecast A',
    //     values: [
    //       { price: 90.0, demand: 150 },
    //       { price: 95.0, demand: 140 },
    //       { price: 100.0, demand: 130 },
    //       { price: 105.0, demand: 120 },
    //       { price: 110.0, demand: 100 }
    //     ]
    //   },
    // ];

    // this.createChart(multiLineData);
  }

  getDataPoints() {
    let payload: any = [];
    this.data.forEach((item: any) => {
      payload.push(item.id);
    });
    console.log('Payload for forecast:', payload);
    this.loader = true;
    this.apiservice
      .post('/v1/product/forecast/multiple', {
        products: payload,
      })
      .subscribe(
        (response: any) => {
          this.loader = false;
          console.log('Forecast data:', response);
          this.createChart(response);
        },
        (error) => {
          console.error('Error fetching forecast data:', error);
        }
      );
  }
  createChart(dataSets: any[]): void {
    const element = this.chartContainer.nativeElement;
    const margin = { top: 20, right: 30, bottom: 60, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous SVG if any
    d3.select(element).select('svg').remove();

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Flatten all data to find extents
    const allValues = dataSets.flatMap((d) => d.values);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(allValues, (d: any) => d.price) as [number, number])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(allValues, (d: any) => d.demand)!])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g').call(d3.axisLeft(y));

    // Axis Labels
    svg
      .append('text')
      .attr('x', width - 50)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text('Selling Price');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Demand Quantity');

    // Line generator
    const line = d3
      .line<any>()
      .x((d: any) => x(d.price))
      .y((d: any) => y(d.demand));

    // Draw lines + points
    dataSets.forEach((dataset, i) => {
      svg
        .append('path')
        .datum(dataset.values)
        .attr('fill', 'none')
        .attr('stroke', color(i.toString()))
        .attr('stroke-width', 2)
        .attr('d', line);

      svg
        .selectAll(`.dot-${i}`)
        .data(dataset.values)
        .enter()
        .append('circle')
        .attr('class', `dot-${i}`)
        .attr('cx', (d: any) => x(d.price))
        .attr('cy', (d: any) => y(d.demand))
        .attr('r', 4)
        .attr('fill', color(i.toString()));
    });

    // Legend
    const legend = svg
      .selectAll('.legend')
      .data(dataSets)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${i * 150}, ${height + 30})`);

    legend
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .style('fill', (d, i) => color(i.toString()));

    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 10)
      .text((d) => d.name);
  }
  onCancel() {
    this.dialogRef.close();
  }
}
