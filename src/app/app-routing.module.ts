import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const enderecoModule = () => import('./enderecos/endereco.module').then(x => x.EnderecoModule);
const ufModule = () => import('./cidades/uf.module').then(x => x.UFModule);
const conhecimentoModule = () => import('./conhecimentos/conhecimento.module').then(x => x.ConhecimentoModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'enderecos', loadChildren: enderecoModule,canActivate: [AuthGuard] },
    { path: 'cidades', loadChildren: ufModule,canActivate: [AuthGuard] },
    { path: 'conhecimentos', loadChildren: conhecimentoModule,canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }