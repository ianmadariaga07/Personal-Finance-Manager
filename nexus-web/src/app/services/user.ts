import {environment} from '../../environments/environment';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root',
})

export class UserService {
  private apiUrl: string = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) { }

  getAllUsers(){
    return this.http.get<User[]>(this.apiUrl)
  }

  createUser(newUser: User) {
    return this.http.post<User>(this.apiUrl, newUser);
  }
}
