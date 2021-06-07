import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signage',
  templateUrl: './signage.component.html',
  styleUrls: ['./signage.component.css']
})
export class SignageComponent implements OnInit {
  assembly_id: any;
  assoc_id: any;
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
    this.assoc_id = this.route.snapshot.paramMap.get('assoc_id');
    this.assembly_id = this.route.snapshot.paramMap.get('assembly_id');

    // Validate params
    if(!this.assembly_id || !this.assoc_id) this.router.navigate(['table-list']);

    this.assembly = (await this.getAssembly() as any)?.DATA[0]?.assembly[0];
    const shareholders = this.assembly.present_shareholders;
    const agreements = this.assembly.agreements;

    // Create form
    this.nestedForm = this._fb.group({
      assembly_date: new FormControl({value: this.assembly.date, disabled: true}, Validators.required),
      time: new FormControl({value: this.assembly.time, disabled: true}, Validators.required),
      present_shareholders: this._fb.array([this.addShareholderGroup()]),
      agreements: this._fb.array([this.addAgreementGroup()])
    });

    //init shareholders
    if(shareholders) {
      this.ShareholderArray.removeAt(0);
      for(let shareholder of shareholders) {
        this.ShareholderArray.push(
          this._fb.group({
            name: [{value:shareholder.name, disabled: true}],
            part: [{value:shareholder.part, disabled: true}]
          })
        );
      }
    }

    if(agreements) {
      this.AgreementsArray.removeAt(0);
      for(let agreement of agreements) {
        this.AgreementsArray.push(
          this._fb.group({
            description: [{value: agreement.description, disabled: true}]
          })
        );
      }
    }
    this.loading = false;
  }


  private addShareholderGroup() {
    return this._fb.group({
      name: [],
      part: []
    });
  }

  private addAgreementGroup() {
    return this._fb.group({
      description: []
    })
  }

  get ShareholderArray() {
    return <FormArray>this.nestedForm.get('present_shareholders');
  }

  get AgreementsArray() {
    return <FormArray>this.nestedForm.get('agreements');
  }

  private async getAssembly() {
    return await this.http.get(`/api/assembly/${this.assembly_id}`).toPromise();
  }

  async save() {
    const assembly_update = this.nestedForm.value;
    const shareholders = assembly_update.present_shareholders || this.assembly.present_shareholders;
    const agreements = assembly_update.agreements;
    const body = {
      assoc_id: this.assoc_id,
      assembly: {
        date: this.assembly.date,
        time: this.assembly.time,
        order_of_the_day: "Orden del día",
        ordinary: this.assembly.ordinary,
        present_shareholders: shareholders,
        agreements
      }
    };
    await this.http.put(`/api/assembly/${this.assembly_id}`, body).toPromise();
    this.ngOnInit();
  }

}
