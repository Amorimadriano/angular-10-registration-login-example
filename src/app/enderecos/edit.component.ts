import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'edit.component.html' })
export class EditComponent implements OnInit {
    form: FormGroup;
    id: string;
    cep: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    cidades = null;
    enderecos = null;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.cep = this.route.snapshot.params['cep'];
        this.isAddMode = !this.id;
  
        this.accountService.getUFAll()
            .pipe(first())
            .subscribe(cidades => this.cidades = cidades);

          

        this.form = this.formBuilder.group({
            cep: ['', Validators.required],
            logradouro: ['', Validators.required],
            numero: ['', Validators.required],
            bairro: ['', Validators.required],
            uf: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.accountService.getEnderecoById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.cep.setValue(x.cep);
                    this.f.logradouro.setValue(x.logradouro);
                    this.f.numero.setValue(x.numero);
                    this.f.bairro.setValue(x.bairro);
                    this.f.uf.setValue(x.uf);
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createEndereco();
        } else {
            this.updateEndereco();
        }
    }

    onChange() {
        this.buscarCep();
    }
    
    private createEndereco() {
        this.accountService.addEndereco(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Endereço added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updateEndereco() {
        this.accountService.updateEndereco(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private buscarCep(){
        this.accountService.buscarCep(this.form.value.cep)
        .pipe(first())
        .subscribe(enderecos => this.enderecos = enderecos);
    }
}