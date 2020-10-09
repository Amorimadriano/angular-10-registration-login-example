import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    cidades = null;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getUFAll()
            .pipe(first())
            .subscribe(cidades => this.cidades = cidades);

          
    }

    deleteUF(id: string) {
        const uf = this.cidades.find(x => x.id === id);
        uf.isDeleting = true;
        this.accountService.deleteUF(id)
            .pipe(first())
            .subscribe(() => {
                this.cidades = this.cidades.filter(x => x.id !== id) 
            });
    }
}