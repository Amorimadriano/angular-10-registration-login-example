import { Component } from '@angular/core';

import { User, Endereco, Cidade, Conhecimento } from '@app/_models';
import { AccountService } from '@app/_services';
import { EnderecoModule } from '@app/enderecos/endereco.module';
import { UFModule } from '@app/cidades/uf.module';
import { ConhecimentoModule } from '@app/conhecimentos/conhecimento.module';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;
    endereco: Endereco;
    uf: Cidade;
    conhecimento: Conhecimento;
    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
        this.endereco = this.accountService.enderecoValue;
        this.uf = this.accountService.ufValue;
        this.conhecimento = this.accountService.conhecimentoValue;
    }
}