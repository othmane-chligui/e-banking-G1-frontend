import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAutenticated:boolean = false;
  roles:any;
  username:any;
  accessToken!: any;

  constructor(private http:HttpClient ,private router:Router) { }

    public Login(username : string, password : string){
      let options = {
        headers : new HttpHeaders().set("Content-Type","application/x-www-form-urlencoded")
      }

      let params = new HttpParams()
      .set("username", username).set("password", password);
    return this.http.post("http://localhost:8085/auth/login", params, options)
  }
  loadProfile(data:any){
    this.isAutenticated=true;
    this.accessToken = data['access-token']; 
    let decodedJwt:any = jwtDecode(this.accessToken);
    this.username=decodedJwt.sub;
    this.roles=decodedJwt.scope;
    window.localStorage.setItem("jwt-token",this.accessToken);
  }
  Logout(){
    this.isAutenticated=false;
    this.accessToken=undefined;
    this.username=undefined;
    this.roles=undefined;
    window.localStorage.removeItem("jwt-token");
    this.router.navigateByUrl("/login");
  }
  loadJwtTokenFromLocalStorage(){
    let token = window.localStorage.getItem("jwt-token");
    if(token){
      this.loadProfile({"access-token":token});
      this.router.navigateByUrl("/admin/customers");
    }
  }
}
