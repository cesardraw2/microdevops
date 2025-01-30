import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of, switchMap, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ServiceConteiner} from "app/modules/admin/models/serviceConteiner";
import {IServiceContainer} from "app/modules/admin/models/service-conteiner.types";

@Injectable({
  providedIn: 'root'
})
export class ConteinersService {

  private _service: BehaviorSubject<ServiceConteiner> = new BehaviorSubject(null);
  private _services: BehaviorSubject<ServiceConteiner[]> = new BehaviorSubject<ServiceConteiner[]>(null);

  private readonly apiV1Services:string = 'api/v1/services';

  constructor(private _httpClient: HttpClient) {

  }

  /**
   * Getter for chat
   */
  get service$(): Observable<IServiceContainer>
  {
    return this._service.asObservable();
  }

  /**
   * Getter for chat
   */
  get services$(): Observable<IServiceContainer[]>
  {
    return this._services.asObservable();
  }



  /**
   * Get chat
   *
   * @param id
   */
  getServiceById(id: string): Observable<any>
  {
    return this._httpClient.get<ServiceConteiner>(this.apiV1Services, {params: {id}}).pipe(
        map((service) =>
        {

          this._service.next(service);

          return service;
        }),
        switchMap((service) =>
        {
          if ( !service )
          {
            return throwError(() => new Error('Could not found service with id of ' + id + '!'));
          }

          return of(service);
        }),
    );
  }


  /**
   * Get services
   */
  getServices(): Observable<any>
  {
    return this._httpClient.get<ServiceConteiner[]>(this.apiV1Services).pipe(
        tap((response: ServiceConteiner[]) =>
        {
          this._services.next(response);
        }),
    );
  }


}
