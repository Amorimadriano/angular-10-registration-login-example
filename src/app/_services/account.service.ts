import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Endereco } from '@app/_models';
import { Cidade } from '@app/_models';
import { Conhecimento } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    private enderecoSubject: BehaviorSubject<Endereco>;
    public endereco: Observable<Endereco>;
    private cidadeSubject: BehaviorSubject<Cidade>;
    public uf: Observable<Cidade>;
    private conhecimentoSubject: BehaviorSubject<Conhecimento>;
    public conhecimento: Observable<Conhecimento>;
    resultado:Endereco;
    myFiles:string [] = [];
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.enderecoSubject = new BehaviorSubject<Endereco>(JSON.parse(localStorage.getItem('endereco')));
        this.endereco = this.enderecoSubject.asObservable();
        this.cidadeSubject = new BehaviorSubject<Cidade>(JSON.parse(localStorage.getItem('uf')));
        this.uf = this.cidadeSubject.asObservable();
        this.conhecimentoSubject = new BehaviorSubject<Conhecimento>(JSON.parse(localStorage.getItem('conhecimento')));
        this.conhecimento = this.conhecimentoSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get enderecoValue(): Endereco {
        return this.enderecoSubject.value;
    }

    public get ufValue(): Cidade {
        return this.cidadeSubject.value;
    }

    public get conhecimentoValue(): Conhecimento {
        return this.conhecimentoSubject.value;
    }


    login(username, password) {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
            
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        localStorage.removeItem('endereco');
        localStorage.removeItem('uf');
        localStorage.removeItem('conhecimento');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }

   /*Endereco */

   getEnderecoAll() {
    return this.http.get<Endereco[]>(`${environment.apiUrl}/enderecos`);
    
    }

    

    buscarCep(cep: string){
        return this.http
        .get(`https://viacep.com.br/ws/${cep}/json/`)
        .pipe(map(data => this.resultado = this.converterRespostaParaCep(data)));
  }

  private converterRespostaParaCep(cepNaResposta):Endereco{
    let cep = new Endereco();

    cep.cep = cepNaResposta.cep;
    cep.logradouro = cepNaResposta.logradouro;
    cep.bairro = cepNaResposta.bairro;
    cep.uf = cepNaResposta.uf;
    return cep;
}

    getEnderecoById(id: string) {
        return this.http.get<Endereco>(`${environment.apiUrl}/enderecos/${id}`);
    }
    addEndereco(endereco: Endereco) {
        return this.http.post<Endereco>(`${environment.apiUrl}/enderecos/addEndereco`, endereco)
        .pipe(map(endereco => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('endereco', JSON.stringify(endereco));
            this.enderecoSubject.next(endereco);
            return endereco;
        }));
    }

    updateEndereco(id, params) {
        return this.http.put<Endereco>(`${environment.apiUrl}/enderecos/${id}`, params)
           
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.enderecoValue.id) {
                    // update local storage
                    const endereco = { ...this.enderecoValue, ...params };
                    localStorage.setItem('endereco', JSON.stringify(endereco));

                    // publish updated user to subscribers
                    this.enderecoSubject.next(endereco);
                }
                return x;
            }));
    }

    deleteEndereco(id: string) {
        return this.http.delete(`${environment.apiUrl}/enderecos/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                
                return x;
            }));
    }


    getUFAll() {
        return this.http.get<Cidade[]>(`${environment.apiUrl}/cidades`);
        
        }
    
       
        getUFById(id: string) {
            return this.http.get<Cidade>(`${environment.apiUrl}/cidades/${id}`);
        }
        addUF(uf: Cidade) {
            return this.http.post<Cidade>(`${environment.apiUrl}/cidades/addUF`, uf)
            .pipe(map(uf => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('uf', JSON.stringify(uf));
                this.cidadeSubject.next(uf);
                return uf;
            }));
        }
    
        updateUF(id, params) {
            return this.http.put<Cidade>(`${environment.apiUrl}/cidades/${id}`, params)
               
                .pipe(map(x => {
                    // update stored user if the logged in user updated their own record
                    if (id == this.ufValue.id) {
                        // update local storage
                        const uf = { ...this.ufValue, ...params };
                        localStorage.setItem('uf', JSON.stringify(uf));
    
                        // publish updated user to subscribers
                        this.enderecoSubject.next(uf);
                    }
                    return x;
                }));
        }
    
        deleteUF(id: string) {
            return this.http.delete(`${environment.apiUrl}/cidades/${id}`)
                .pipe(map(x => {
                    // auto logout if the logged in user deleted their own record
                    
                    return x;
                }));
        }

        getConhecimentoAll() {
            return this.http.get<Conhecimento[]>(`${environment.apiUrl}/conhecimentos`);
            
            }
        
        
            getConhecimentoById(id: string) {
                return this.http.get<Conhecimento>(`${environment.apiUrl}/conhecimentos/${id}`);
            }
            addConhecimento(conhecimento: Conhecimento) {
                return this.http.post<Conhecimento>(`${environment.apiUrl}/conhecimento/addConhecimento`, conhecimento)
                .pipe(map(conhecimento => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('conhecimento', JSON.stringify(conhecimento));
                    this.conhecimentoSubject.next(conhecimento);
                    return conhecimento;
                }));
            }
        
            updateConhecimento(id, params) {
                return this.http.put<Conhecimento>(`${environment.apiUrl}/conhecimentos/${id}`, params)
                   
                    .pipe(map(x => {
                        // update stored user if the logged in user updated their own record
                        if (id == this.conhecimentoValue.id) {
                            // update local storage
                            const conhecimento = { ...this.conhecimentoValue, ...params };
                            localStorage.setItem('conhecimento', JSON.stringify(conhecimento));
        
                            // publish updated user to subscribers
                            this.conhecimentoSubject.next(conhecimento);
                        }
                        return x;
                    }));
            }
        
            deleteConhecimento(id: string) {
                return this.http.delete(`${environment.apiUrl}/conhecimentos/${id}`)
                    .pipe(map(x => {
                        // auto logout if the logged in user deleted their own record
                        
                        return x;
                    }));
            }

            onFileChange(event) {

                for (var i = 0; i < event.target.files.length; i++) { 
                    this.myFiles.push(event.target.files[i]);
                }
          }
}