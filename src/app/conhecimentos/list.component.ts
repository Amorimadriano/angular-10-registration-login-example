import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    conhecimentos = null;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getConhecimentoAll()
            .pipe(first())
            .subscribe(conhecimentos => this.conhecimentos = conhecimentos);

          
    }

    deleteConhecimento(id: string) {
        const conhecimento = this.conhecimentos.find(x => x.id === id);
        conhecimento.isDeleting = true;
        this.accountService.deleteConhecimento(id)
            .pipe(first())
            .subscribe(() => {
                this.conhecimentos = this.conhecimentos.filter(x => x.id !== id) 
            });
    }
}