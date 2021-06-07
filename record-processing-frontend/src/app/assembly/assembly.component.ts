import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-assembly',
  templateUrl: './assembly.component.html',
  styleUrls: ['./assembly.component.css']
})
export class AssemblyComponent implements OnInit {
  assoc_id: any;
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
    this.assoc_id = this.route.snapshot.paramMap.get('assoc_id');

    // Validate params
    if (!this.assoc_id) this.router.navigate(['table-list']);

    // Create form
    this.nestedForm = this._fb.group({
      date: new FormControl(),
      time: new FormControl(),
      ordinary: new FormControl(),
      day_order: new FormControl()
    });

    this.loading = false;
  }

  async save() {
    const form = this.nestedForm.value;
    if (form.date && form.time && form.day_order) {
      form.ordinary = (form.ordinary)? true : false;
      const body = {
        assoc_id: this.assoc_id,
        assembly: {
          date: form.date,
          time: form.time,
          order_of_the_day: form.day_order,
          ordinary: form.ordinary,
        }
      };
      const response: any = await this.http.post(`/api/assembly`, body).toPromise();
      this.router.navigate(['table-list']);
    }
    this.ngOnInit();
  }

}
