import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  assoc_assemblies: any;
  assoc_name: any;
  assoc_id: any;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.assoc_id = '609dd3ede5d62620435615f8';
    this.setAssemblies();
  }

  private setAssemblies() {
    this.http.get(`/api/association/${this.assoc_id}`).subscribe((data: any) => {
        this.assoc_name = `${data.DATA.name.assoc_name} ${data.DATA.name.assoc_type}`;
        this.assoc_assemblies = data.DATA.assembly;
      },
      (error: any) => console.log(error)
    );
  }

  public isOrdinary(ordinary: any) {
    if(ordinary) return "Ordinaria";
    return "Extraordinaria"
  }

  public goToAssembly(id: any) {
    this.router.navigate(['assembly', {assembly_id: id, assoc_id: this.assoc_id}]);
  }

  public goToCreateAssembly() {
    this.router.navigate(['create_assembly', {assoc_id: this.assoc_id}]);
  }

}
