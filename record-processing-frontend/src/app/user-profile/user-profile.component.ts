import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  loading: boolean = false;
  assoc: any;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    this.loading = true;
    this.setAssoc();
  }

  private setAssoc(){
    this.http.get("/api/association/609dd3ede5d62620435615f8").subscribe((data: any) => {
        this.assoc = data.DATA;
        console.log(this.assoc);
        this.loading = false;
      },
      (error: any) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

}
