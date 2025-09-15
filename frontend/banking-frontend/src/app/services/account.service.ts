 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, TransferRequest } from '../models/account.model';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/api/accounts`;

  constructor(private http: HttpClient) {}

  createAccount(accountData: { type: string }): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, accountData);
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  getAccount(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  deposit(accountId: string, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${accountId}/deposit`, { amount });
  }

  withdraw(accountId: string, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${accountId}/withdraw`, { amount });
  }

  transfer(transferData: TransferRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/transfer`, transferData);
  }
}
