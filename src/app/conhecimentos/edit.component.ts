import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'edit.component.html' })
export class EditComponent implements OnInit {
    form: FormGroup;
    id: string;
    titulo: string;
    file: Blob;
    descricao: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    conhecimentos = null;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.titulo = this.route.snapshot.params['titulo'];
        this.descricao = this.route.snapshot.params['descricao'];
        this.file = this.route.snapshot.params['file'];
        this.isAddMode = !this.id;
  
        this.accountService.getConhecimentoAll()
            .pipe(first())
            .subscribe(conhecimentos => this.conhecimentos = conhecimentos);

          

        this.form = this.formBuilder.group({
            titulo: ['', Validators.required],
            descricao: ['', Validators.required],
            file: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.accountService.getConhecimentoById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.titulo.setValue(x.titulo);
                    this.f.descricao.setValue(x.descricao);
                    this.f.file.setValue(x.file);

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
            this.createConhecimento();
        } else {
            this.updateConhecimento();
        }
    }

    private createConhecimento() {
        this.accountService.addConhecimento(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Conhecimento added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updateConhecimento() {
        this.accountService.updateConhecimento(this.id, this.form.value)
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


}