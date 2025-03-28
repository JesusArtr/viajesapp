import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import { isNullOrUndefined } from "util";
import {User} from '../models/user';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private htttp: HttpClient) {}
  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  registerUser(nombre: string, apellidos: string, email: string, password: string): Observable<any> {
    const url_api = "http://ec2-52-8-193-255.us-west-1.compute.amazonaws.com:8080/user/save";
    return this.htttp
      .post<any>(
        url_api,
        {
          nombre ,
          apellidos,
          email ,
          password ,
          activo: true
        },
        { headers: this.headers }
      );
  }

  loginuser(email: string, password: string): Observable<any> {
    const url_api = "http://localhost:3000/api/Users/login?include=user";
    return this.htttp
      .post<User>(
        url_api,
        { email, password },
        { headers: this.headers }
      )
      .pipe(map(data => data));
  }

  setUser(user: User): void {
    let user_string = JSON.stringify(user);
    localStorage.setItem("currentUser", user_string);
  }

  setToken(token): void {
    localStorage.setItem("accessToken", token);
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  getCurrentUser(): User {
    let user_string = localStorage.getItem("currentUser");
    if (!isNullOrUndefined(user_string)) {
      let user: User = JSON.parse(user_string);
      return user;
    } else {
      return null;
    }
  }

  logoutUser() {
    let accessToken = localStorage.getItem("accessToken");
    const url_api = `http://localhost:3000/api/Users/logout?access_token=${accessToken}`;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    return this.htttp.post<User>(url_api, { headers: this.headers });
  }
}
