import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
export interface Product {
  select: boolean; // for checkbox, optional
  name: string;
  category: string;
  cost: number;
  selling: number;
  desc: string;
  stock: string;
  sold: number;
}

const ELEMENT_DATA: Product[] = [
  {
    select: false,
    name: 'Gio - Note Pad',
    category: 'Stationary',
    cost: 1.2,
    selling: 2.7,
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    stock: '1,21,2123',
    sold: 131244
  },
  {
    select: false,
    name: 'Jazz - Sticky Notes',
    category: 'Stationary',
    cost: 2.5,
    selling: 3.3,
    desc: 'Sed do eiusmod tpor incididunt...',
    stock: '21,200',
    sold: 653121
  }
  // Add more rows as needed
];

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  displayedColumns: string[] = [
    'select', 'name', 'category', 'cost', 'selling', 'desc', 'stock', 'sold', 'action'
  ];
  dataSource = ELEMENT_DATA;
  filteredData: Product[] = [...this.dataSource];

search = '';
  categoryFilter = '';
  selection = new SelectionModel<Product>(true, []); // allow multi-selection

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
  }

  /** The array of selected data rows:  */
  get selectedRowsArray() {
    return this.selection.selected; // This is the array of checked row objects
  }

  applyFilter() {
    // this.filteredData = this.dataSource.filter(row => {
    //   const matchesCategory = this.categoryFilter ? row.productCategory === this.categoryFilter : true;
    //   const matchesSearch = this.search ? (
    //     row.productName.toLowerCase().includes(this.search.toLowerCase()) ||
    //     row.description.toLowerCase().includes(this.search.toLowerCase())
    //   ) : true;
    //   return matchesCategory && matchesSearch;
    // });
  }


  clearSearch() {
    this.search = '';
    this.applyFilter();
  }

  onBack() {
    window.history.back();
  }

  onAddProduct() {
    // Open dialog or navigate to add product form
    alert('Add New Product clicked!');
  }
}
