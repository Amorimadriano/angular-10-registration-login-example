import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    enderecos = null;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getEnderecoAll()
            .pipe(first())
            .subscribe(enderecos => this.enderecos = enderecos);

          
    }

    deleteEndereco(id: string) {
        const endereco = this.enderecos.find(x => x.id === id);
        endereco.isDeleting = true;
        this.accountService.deleteEndereco(id)
            .pipe(first())
            .subscribe(() => {
                this.enderecos = this.enderecos.filter(x => x.id !== id) 
            });
    }
}