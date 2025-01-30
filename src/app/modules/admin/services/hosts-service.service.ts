import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HostsService {
  constructor(private http: HttpClient) {}

  getHosts(): Observable<{ ip:string, hostname: string }[]> {
    return this.http.get<{ ip:string, hostname: string }[]>('https://api.example.com/hosts');
  }
}
