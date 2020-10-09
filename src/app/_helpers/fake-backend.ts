import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];
let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
let cidades = JSON.parse(localStorage.getItem('cidades')) || [];
let conhecimentos = JSON.parse(localStorage.getItem('conhecimentos')) || [];
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                case url.endsWith('/enderecos/addEndereco') && method === 'POST':
                    return addEndereco();
                case url.endsWith('/enderecos') && method === 'GET':
                    return getEnderecoAll();
                case url.match(/\/enderecos\/\d+$/) && method === 'GET':
                    return getEnderecoById();
                case url.match(/\/enderecos\/\d+$/) && method === 'PUT':
                    return updateEndereco();
                case url.match(/\/enderecos\/\d+$/) && method === 'DELETE':
                    return deleteEndereco();
                    case url.endsWith('/cidades/addUF') && method === 'POST':
                        return addUF();
                    case url.endsWith('/cidades') && method === 'GET':
                        return getUFAll();
                    case url.match(/\/cidades\/\d+$/) && method === 'GET':
                        return getUFById();
                    case url.match(/\/cidades\/\d+$/) && method === 'PUT':
                        return updateUF();
                    case url.match(/\/cidades\/\d+$/) && method === 'DELETE':
                        return deleteUF();    
                        case url.endsWith('/conhecimentos/addConhecimento') && method === 'POST':
                            return addConhecimento();
                        case url.endsWith('/conhecimentos') && method === 'GET':
                            return getConhecimentoAll();
                        case url.match(/\/conhecimentos\/\d+$/) && method === 'GET':
                            return getConhecimentoById();
                        case url.match(/\/conhecimentos\/\d+$/) && method === 'PUT':
                            return updateConhecimento();
                        case url.match(/\/conhecimentos\/\d+$/) && method === 'DELETE':
                            return deleteConhecimento();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(user);
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let user = users.find(x => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }

            // update and save user
            Object.assign(user, params);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function addEndereco() {
            const endereco = body

            endereco.id = enderecos.length ? Math.max(...enderecos.map(x => x.id)) + 1 : 1;
            enderecos.push(endereco);
            localStorage.setItem('enderecos', JSON.stringify(enderecos));
            return ok();
        }

        function getEnderecoAll() {
            if (!isLoggedIn()) return unauthorized();
            return ok(enderecos);
        }

        function getEnderecoById() {
            if (!isLoggedIn()) return unauthorized();

            const endereco = enderecos.find(x => x.id === idFromUrl());
            return ok(endereco);
        }

        function updateEndereco() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let endereco = enderecos.find(x => x.id === idFromUrl());

            // update and save user
            Object.assign(endereco, params);
            localStorage.setItem('enderecos', JSON.stringify(enderecos));

            return ok();
        }

        function deleteEndereco() {
            if (!isLoggedIn()) return unauthorized();

            enderecos = enderecos.filter(x => x.id !== idFromUrl());
            localStorage.setItem('enderecos', JSON.stringify(enderecos));
            return ok();
        }

        function addUF() {
            const uf = body

            uf.id = cidades.length ? Math.max(...cidades.map(x => x.id)) + 1 : 1;
            cidades.push(uf);
            localStorage.setItem('cidades', JSON.stringify(cidades));
            return ok();
        }

        function getUFAll() {
            if (!isLoggedIn()) return unauthorized();
            return ok(cidades);
        }

        function getUFById() {
            if (!isLoggedIn()) return unauthorized();

            const uf = cidades.find(x => x.id === idFromUrl());
            return ok(uf);
        }

        function updateUF() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let uf = cidades.find(x => x.id === idFromUrl());

            // update and save user
            Object.assign(uf, params);
            localStorage.setItem('cidades', JSON.stringify(cidades));

            return ok();
        }

        function deleteUF() {
            if (!isLoggedIn()) return unauthorized();

            cidades = cidades.filter(x => x.id !== idFromUrl());
            localStorage.setItem('cidades', JSON.stringify(cidades));
            return ok();
        }


        function addConhecimento() {
            const conhecimento = body

            conhecimento.id = conhecimentos.length ? Math.max(...conhecimentos.map(x => x.id)) + 1 : 1;
            conhecimentos.push(conhecimento);
            localStorage.setItem('conhecimentos', JSON.stringify(conhecimentos));
            return ok();
        }

        function getConhecimentoAll() {
            if (!isLoggedIn()) return unauthorized();
            return ok(conhecimentos);
        }

        function getConhecimentoById() {
            if (!isLoggedIn()) return unauthorized();

            const conhecimento = conhecimentos.find(x => x.id === idFromUrl());
            return ok(conhecimento);
        }

        function updateConhecimento() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let conhecimento = conhecimentos.find(x => x.id === idFromUrl());

            // update and save user
            Object.assign(conhecimento, params);
            localStorage.setItem('conhecimentos', JSON.stringify(conhecimentos));

            return ok();
        }

        function deleteConhecimento() {
            if (!isLoggedIn()) return unauthorized();

            conhecimentos = conhecimentos.filter(x => x.id !== idFromUrl());
            localStorage.setItem('conhecimentos', JSON.stringify(conhecimentos));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};