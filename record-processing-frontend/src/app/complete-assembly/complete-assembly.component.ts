import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-complete-assembly',
  templateUrl: './complete-assembly.component.html',
  styleUrls: ['./complete-assembly.component.css']
})
export class CompleteAssemblyComponent implements OnInit {
  count_socios: number;
  assembly_id: any;
  assembly: any;
  loading: boolean;

  nestedForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private _fb: FormBuilder
  ) { }

  async ngOnInit() {
    this.loading = true;
    // Get url params
    this.assembly_id = this.route.snapshot.paramMap.get('assembly_id');

    // Validate params
    if(!this.assembly_id) this.router.navigate(['table-list']);

    this.assembly = (await this.getAssembly() as any)?.DATA[0]?.assembly[0];
    this.loading = false;
  }

  private async getAssembly() {
    return await this.http.get(`/api/assembly/${this.assembly_id}`).toPromise();
  }

}
