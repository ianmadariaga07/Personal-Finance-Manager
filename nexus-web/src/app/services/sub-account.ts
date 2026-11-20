import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SubAccount} from '../interfaces/sub-account.interface';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubAccountService {
  private apiUrl: string = `${environment.apiUrl}/sub-accounts`;
  constructor(private http: HttpClient) { }

  getAllSubAccounts(){
    return this.http.get<SubAccount[]>(this.apiUrl)
  }

  createSubAccount(newSubAccount: SubAccount) {
    return this.http.post<SubAccount>(this.apiUrl, newSubAccount);
  }
}
