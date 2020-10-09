import { Component } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';
import { Endereco } from './_models';
import { Cidade } from './_models';
import { Conhecimento } from './_models';



@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    user: User;
    endereco: Endereco;
    uf: Cidade;
    conhecimento: Conhecimento;
    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
        this.accountService.endereco.subscribe(x=> this.endereco = x);
        this.accountService.uf.subscribe(x=> this.uf = x);
        this.accountService.conhecimento.subscribe(x=> this.conhecimento = x);
    }



    logout() {
        this.accountService.logout();
    }
}