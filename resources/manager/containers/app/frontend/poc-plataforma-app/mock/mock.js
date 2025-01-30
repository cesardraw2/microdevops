/**
 * @author Rafael Fernandes Silva
 * 10/01/2019
 *  Mock para autenticação de usuário SISBR usando CAS + API Manager
 *
 * Dependencias:
 *  json-server -> npm install -g json-server
 *
 * Usage: node mock.js
 *  Inicia um servidor node provendo o mock
 */
const jsonServer = require('json-server')
const server = jsonServer.create();
const router = jsonServer.router('mock/rest-mock.json');
const middlewares = jsonServer.defaults();

const accessToken = "80aaadc2-1a94-339a-b776-2ca499469a19";
const refreshToken = "8de29471-c1e0-3f58-ac44-2fb62ff7f0ce";
const JWT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiZXdvZ0luVnpkV0Z5YVc4aU9pQjdDaUFnSW14dloybHVJam9nSWtkRlFWSlJRekF6TURCZk1EQWlMQW9nSUNKdWIyMWxJam9nSWxWVFZVRlNTVThnUTA5U1VFOVNRVlJKVms4Z1JFRWdSMFZCVWxFaUxBb2dJQ0pqY0dZaU9pQWlOakkyTmpNMU1qSTNNeklpTEFvZ0lDSmxiV0ZwYkNJNklDSmhaMjVsYkdsMGJ5NWpZVzVuWlhKaGJtRkFjMmxqYjI5aUxtTnZiUzVpY2lJc0NpQWdJbTUxYldWeWIwTnZiM0JsY21GMGFYWmhJam9nTXpBd0xBb2dJQ0pwWkVsdWMzUnBkSFZwWTJGdlQzSnBaMlZ0SWpvZ01pd0tJQ0FpYVdSVmJtbGtZV1JsU1c1emRFOXlhV2RsYlNJNklEQXNDaUFnSW1SaGRHRkliM0poVld4MGFXMXZURzluYVc0aU9pQXhOVFl6TnprM01UYzVOREU1TEFvZ0lDSndaWEp0YVhOemIyVnpJam9nZXdvZ0lDQWdJQ0FpYzJsemRHVnRZWE1pT2lCYkNpQWdJQ0FnSUNBZ0lDQjdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0ltbGtJam9nTVRnNE5pd0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBaWJtOXRaU0k2SUNKUVQxSlVRVXdnTXk0d0lpd0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBaWMybG5iR0VpT2lBaVVGSlVNeTR3SWl3S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FpYlc5a2RXeHZjeUk2SUZzS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2V3b2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSW1sa0lqb2dNVGt4TXl3S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0p1YjIxbElqb2dJbEJQVWxSQlRDQXpMakFpTEFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJbVp2Y20xMWJHRnlhVzhpT2lBaVVFOVNWRUZNSURNdU1DSXNDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBaWRHbHdieUk2SUNKUVQxSlVRVXdpTEFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJbTlpYW1WMGIzTWlPaUJiQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZXdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWlibTl0WlNJNklDSk5UbFZRVWtsT1EwbFFRVXdpTEFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWlkR2x3YnlJNklDSk5SVTVWSWl3S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJbVJsYzJOeWFXTmhieUk2SUNKTlRsVlFVa2xPUTBsUVFVd2lMQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBaWJHRmlaV3dpT2lBaVNHOXRaU0lzQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDSnBZMjl1WlNJNklDSnRaR2t0YUc5dFpTMWphWEpqYkdVaUxBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FpWTJGdGFXNW9ieUk2SUNJdklpd0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSW5OMVlrOWlhbVYwYjNNaU9pQmJDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSW01dmJXVWlPaUFpVFU1VlNVNVVSVkpPVHpFaUxBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0owYVhCdklqb2dJazFGVGxVaUxBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0prWlhOamNtbGpZVzhpT2lBaVRVNVZTVTVVUlZKT1R6RWlMQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKc1lXSmxiQ0k2SUNKTlpXNTFJREVpTEFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDSnBZMjl1WlNJNklDSnRaR2t0WW1GdWF5SXNDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSW1OaGJXbHVhRzhpT2lBaUwzSnZkR0V4SWl3S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWljM1ZpVDJKcVpYUnZjeUk2SUZzS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZXdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0ltNXZiV1VpT2lBaVJrNURRMDlPVTFWTVZFRlNUMVJCTVNJc0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWlkR2x3YnlJNklDSkdWVTVEU1U5T1FVeEpSRUZFUlNJc0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWljM1ZpVDJKcVpYUnZjeUk2SUZzS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I3Q2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKdWIyMWxJam9nSWxKRFUwTlBUbE5WVEZSQlVsSlBWRUV4SWl3S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0luUnBjRzhpT2lBaVVrVkRWVkpUVHlJS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5Q2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCZENpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwc0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhzS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDSnViMjFsSWpvZ0lrWk9RMGxPUTB4VlNWSlNUMVJCTVNJc0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWlkR2x3YnlJNklDSkdWVTVEU1U5T1FVeEpSRUZFUlNJc0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWljM1ZpVDJKcVpYUnZjeUk2SUZzS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I3Q2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKdWIyMWxJam9nSWxKRFUwbE9RMHhWU1ZKU1QxUkJNU0lzQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKMGFYQnZJam9nSWxKRlExVlNVMDhpQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmUW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWFFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5Q2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1hRb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTd0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIc0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FpYm05dFpTSTZJQ0pOVGxWSlRsUkZVazVQTWlJc0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJblJwY0c4aU9pQWlUVVZPVlNJc0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJbVJsYzJOeWFXTmhieUk2SUNKTlRsVkpUbFJGVWs1UE1pSXNDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSW14aFltVnNJam9nSWsxbGJuVWdNaUlzQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0ltbGpiMjVsSWpvZ0ltMWthUzFvYjIxbExYWmhjbWxoYm5RaUxBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0pqWVcxcGJtaHZJam9nSWk5eWIzUmhNaUlzQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0luTjFZazlpYW1WMGIzTWlPaUJiQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSHNLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKdWIyMWxJam9nSWtaT1EwTlBUbE5WVEZSQlVrOVVRVElpTEFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0luUnBjRzhpT2lBaVJsVk9RMGxQVGtGTVNVUkJSRVVpQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBzQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSHNLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKdWIyMWxJam9nSWtaT1EwVllRMHhWU1ZKU1QxUkJNaUlzQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBaWRHbHdieUk2SUNKR1ZVNURTVTlPUVV4SlJFRkVSU0lzQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBaWMzVmlUMkpxWlhSdmN5STZJRnNLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0p1YjIxbElqb2dJbEpEVTBWWVEweFZTVkpTVDFSQk1pSXNDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0owYVhCdklqb2dJbEpGUTFWU1UwOGlDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZRb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdYUW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWFFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmRDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmUW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1hRb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlDaUFnSUNBZ0lDQWdJQ0FnSUNBZ1hRb2dJQ0FnSUNBZ0lDQWdmUW9nSUNBZ0lDQmRMQW9nSUNBZ0lDQWlhVzUwWldkeVlXTnZaWE1pT2lCYkNpQWdJQ0FnSUNBZ2V3b2dJQ0FnSUNBZ0lDQWdJbTV2YldVaU9pQWlkSEpoYm5ObVpYSmxibU5wWVY5aVlXNWpZWEpwWVNJc0NpQWdJQ0FnSUNBZ0lDQWlkR2x3YnlJNklDSlNSVU5WVWxOUElnb2dJQ0FnSUNBZ0lIMEtJQ0FnSUNBZ1hRb2dJQ0FnZlFvZ0lIMEtmUT09IiwiaWF0IjoxNTYzODIxMzQ0LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAiLCJpc3MiOiJodHRwczovL2JvdGkuc2lzYnIuY29vcC5iciIsInN1YiI6ImdlYXJxYzAzMDBfMDAifQ.0vlWzIUd1LpVbKnsr6t2Nt2pElo_QwWsHC6Uk5X_Yj9437fEUknkaEMwmIszf_ImAjkVHUYv5ghwsGQeoFr1pMEujGCCvb2SAp6NgTsLTAX09H5Ji23PXRnYZ_fQiq5moBrvcE5u5MkRdyXxAkm9o6gVJQsz-L__Ov7s9OQ4nBVO-yI-DYsKJt0oy1wOxsxOU-9n-OjQcHGOksGthbcL4A7T9JNxA1t5wxRVKaHx0hqLPbSz773ah5b7vKQ99gwFMROiHZ3BdQqBYKljEv5SmRXy_9CvR0F5AHgQqNbJdz-7iHwLmBnbRDNq3vBh99r3oU_tW1Ldc23w-0giu1s1mg";
//const JWT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiZXdvZ0lDSjFjM1ZoY21sdklqb2dld29nSUNBZ0lteHZaMmx1SWpvZ0lrZEZRVkpSUXpBek1EQmZNREFpTEFvZ0lDQWdJbTV2YldVaU9pQWlWVk5WUVZKSlR5QkRUMUpRVDFKQlZFbFdUeUJFUVNCSFJVRlNVU0lzQ2lBZ0lDQWlZM0JtSWpvZ0lqWXlOall6TlRJeU56TXlJaXdLSUNBZ0lDSmxiV0ZwYkNJNklDSmhaMjVsYkdsMGJ5NWpZVzVuWlhKaGJtRkFjMmxqYjI5aUxtTnZiUzVpY2lJc0NpQWdJQ0FpYm5WdFpYSnZRMjl2Y0dWeVlYUnBkbUVpT2lBek1EQXNDaUFnSUNBaWFXUkpibk4wYVhSMWFXTmhiMDl5YVdkbGJTSTZJRElzQ2lBZ0lDQWlhV1JWYm1sa1lXUmxTVzV6ZEU5eWFXZGxiU0k2SURBc0NpQWdJQ0FpWkdGMFlVaHZjbUZWYkhScGJXOU1iMmRwYmlJNklERTFOak0zT1RjeE56azBNVGtzQ2lBZ0lDQWljR1Z5YldsemMyOWxjeUk2SUhzS0lDQWdJQ0FnSW5OcGMzUmxiV0Z6SWpvZ1d3b2dJQ0FnSUNBZ0lIc0tJQ0FnSUNBZ0lDQWdJQ0pwWkNJNklERTRPRFlzQ2lBZ0lDQWdJQ0FnSUNBaWJtOXRaU0k2SUNKUVQxSlVRVXdnTXk0d0lpd0tJQ0FnSUNBZ0lDQWdJQ0p6YVdkc1lTSTZJQ0pRVWxRekxqQWlMQW9nSUNBZ0lDQWdJQ0FnSW0xdlpIVnNiM01pT2lCYkNpQWdJQ0FnSUNBZ0lDQWdJSHNLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWlhV1FpT2lBeE9URXpMQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDSnViMjFsSWpvZ0lsQlBVbFJCVENBekxqQWlMQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDSm1iM0p0ZFd4aGNtbHZJam9nSWxCUFVsUkJUQ0F6TGpBaUxBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNKMGFYQnZJam9nSWxCUFVsUkJUQ0lzQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJbTlpYW1WMGIzTWlPaUJiQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I3Q2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKdWIyMWxJam9nSWsxT1ZWQlNTVTVEU1ZCQlRDSXNDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0owYVhCdklqb2dJazFGVGxVaUxBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWlaR1Z6WTNKcFkyRnZJam9nSWsxT1ZWQlNTVTVEU1ZCQlRDSXNDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0pzWVdKbGJDSTZJQ0pKYm1samFXOGlMQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FpYVdOdmJtVWlPaUFpYldScExXaHZiV1VpTEFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBaVkyRnRhVzVvYnlJNklDSXZJaXdLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSW5OMVlrOWlhbVYwYjNNaU9pQmJYUW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmU3dLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSHNLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSW01dmJXVWlPaUFpVFU1VlVFeEJWRUZHVDFKTlFTSXNDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0owYVhCdklqb2dJazFGVGxVaUxBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWlaR1Z6WTNKcFkyRnZJam9nSWsxT1ZWQk1RVlJCUms5U1RVRWlMQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FpYkdGaVpXd2lPaUFpUTI5dmNHVnlZV1J2SWl3S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0ltbGpiMjVsSWpvZ0ltMWthUzFoWTJOdmRXNTBMV05wY21Oc1pTSXNDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0pqWVcxcGJtaHZJam9nSWk4aUxBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWljM1ZpVDJKcVpYUnZjeUk2SUZ0ZENpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUxBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2V3b2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWlibTl0WlNJNklDSk5UbFZFUVZOSVFrOUJVa1FpTEFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBaWRHbHdieUk2SUNKTlJVNVZJaXdLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSW1SbGMyTnlhV05oYnlJNklDSk5UbFZFUVZOSVFrOUJVa1FpTEFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBaWJHRmlaV3dpT2lBaVIyVnpkR0Z2SWl3S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0ltbGpiMjVsSWpvZ0ltMWthUzFoY0hCc2FXTmhkR2x2YmlJc0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDSmpZVzFwYm1odklqb2dJaThpTEFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBaWMzVmlUMkpxWlhSdmN5STZJRnNLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCN0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FpYm05dFpTSTZJQ0pCVlZSUElpd0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKMGFYQnZJam9nSWsxRlRsVWlMQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0ltUmxjMk55YVdOaGJ5STZJQ0pCVlZSUElpd0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKc1lXSmxiQ0k2SUNKUWJHRjBZV1p2Y20xaElHUmxJRk5sWjNWeWIzTWlMQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0ltbGpiMjVsSWpvZ0ltMWthUzFqWVhJdGFHRjBZMmhpWVdOcklpd0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKallXMXBibWh2SWpvZ0lpOWtZWE5vWW05aGNtUXZZWFYwYnlJc0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FpYzNWaVQySnFaWFJ2Y3lJNklGc0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2V3b2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDSnViMjFsSWpvZ0lrWk9RME5QVGxOVlRGUkJRVlZVVHlJc0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0luUnBjRzhpT2lBaVJsVk9RMGxQVGtGTVNVUkJSRVVpQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGMEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5TEFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIc0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKdWIyMWxJam9nSWxKRlUwbEVSVTVEU1VGTUlpd0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKMGFYQnZJam9nSWsxRlRsVWlMQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0ltUmxjMk55YVdOaGJ5STZJQ0pTUlZOSlJFVk9RMGxCVENJc0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FpYkdGaVpXd2lPaUFpVTJsamIyOWlJRk5sWjNWeVlXUnZjbUVpTEFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJbWxqYjI1bElqb2dJbTFrYVMxb2IyMWxMWFpoY21saGJuUXRiM1YwYkdsdVpTSXNDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBaVkyRnRhVzVvYnlJNklDSXZjMlZuZFhKaFpHOXlZU0lzQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWljM1ZpVDJKcVpYUnZjeUk2SUZzS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZXdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKdWIyMWxJam9nSWtaT1EwTlBUbE5WVEZSQlVrVlRTVVJGVGtOSlFVd2lMQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0owYVhCdklqb2dJa1pWVGtOSlQwNUJURWxFUVVSRklnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUNpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JkQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTd0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I3Q2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWlibTl0WlNJNklDSldTVVJCSWl3S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0owYVhCdklqb2dJazFGVGxVaUxBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSW1SbGMyTnlhV05oYnlJNklDSldTVVJCSWl3S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0pzWVdKbGJDSTZJQ0pUWldkMWNtOXpJRWRsY21GcGN5SXNDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBaWFXTnZibVVpT2lBaWJXUnBMV2hsWVhKMElpd0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNKallXMXBibWh2SWpvZ0lpOWtZWE5vWW05aGNtUXZkbWxrWVNJc0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FpYzNWaVQySnFaWFJ2Y3lJNklGc0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2V3b2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDSnViMjFsSWpvZ0lrWk9RME5QVGxOVlRGUkJWa2xFUVNJc0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0luUnBjRzhpT2lBaVJsVk9RMGxQVGtGTVNVUkJSRVVpQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGMEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5Q2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUYwS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwS0lDQWdJQ0FnSUNBZ0lDQWdJQ0JkQ2lBZ0lDQWdJQ0FnSUNBZ0lIMEtJQ0FnSUNBZ0lDQWdJRjBLSUNBZ0lDQWdJQ0I5Q2lBZ0lDQWdJRjBzQ2lBZ0lDQWdJQ0pwYm5SbFozSmhZMjlsY3lJNklGc0tJQ0FnSUNBZ0lDQjdDaUFnSUNBZ0lDQWdJQ0FpYm05dFpTSTZJQ0puWlhOMFlXOHRaRzlqZFcxbGJuUnZjeTFuWldRdFoyWjBMWE5wYzJKeUlpd0tJQ0FnSUNBZ0lDQWdJQ0owYVhCdklqb2dJbEpGUTFWU1UwOGlDaUFnSUNBZ0lDQWdmUW9nSUNBZ0lDQmRDaUFnSUNCOUNpQWdmUXA5IiwiYXBsaWNhY2FvIjoiYzJselluSXpMakE9IiwiaWF0IjoxNTY5OTYzMjczLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAiLCJpc3MiOiJodHRwczovL2JvdGkuc2lzYnIuY29vcC5iciIsInN1YiI6IkdFQVJRQzAzMDBfMDAifQ.i7MtRn0Kko5Y01W31vk_NEa1VzdW72sXJnFjJw5CrfWLRf5MWaTXE0LKkp5rWe2_9yesjXohNU93mEFlG6oc2Qpfzj5TkRDxUAAvTxTgPCMVxjoUCgpq3mZ4ieRir2OdCwA0TdCv8spmfhKLwCekLKsL1iCW_J4n8hpUQdN7cP7XsEUxMn2hIMFckOSFmxjs2ouC3m06KArXOsEItPU3sAyR7wBZsRq80pM9WUxu1QBujYdyBqATGsUHoHn0DHXoijVjVC-YZzGMWds1-dZMv1cRI7uGllDubAfUTToj7LE1tw6jRqNizfRnr3sQrfye25gF4WZ0SBNwx9Q1ckS_CA";

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
    const urlsAllowed = ['/token', '/cas/auth/token', '/cas/login', '/cars', "/faturamento", "/central", "/cooperativa", "/devolucao", '/propostas', '/centrais', '/singulares', '/corretorass'];

    const allowed = urlsAllowed.filter(i => req.url.includes(i)).length > 0;

    if (!allowed) {
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Nao autorizado! (Você deve informar um header Authorization!)' });
        }

        if (authHeader != `Bearer ${accessToken}`) {
            return res.status(401).json({ error: `Nao autorizado! (Você deve informar Bearer com o accessToken '${accessToken}'!)` });
        }
    }
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    next();
});

/*
 * Passo 1:
 * Recupera dados e permissões do usuário
 */
server.post('/cas/auth/token', (req, res) => {
    res.jsonp({
        token: JWT,
        ticket: req.body.ticket
    });
});


/*
 * Passo 2:
 *  Recupera o acess token para requisições no API manager.
 */
server.post('/token', (req, res) => {
    var authHeader = req.headers.authorization;
    if (!authHeader.startsWith("Basic")) {
        return res.status(401).json({ error: 'Nao autorizado! (Você deve informar basic com o base64(clientId:ClientSecrete)!)' });
    }

    if (req.body.grant_type == "st") {
        if (!req.body.ST) {
            return res.status(400).json({ error: 'Session Token invalido!' });
        }
        if (!req.body.service) {
            return res.status(400).json({ error: 'Servico invalido!' });
        }

        return res.jsonp({
            "access_token": accessToken,
            "refresh_token": refreshToken,
            "scope": "openid",
            "id_token": JWT,
            "token_type": "Bearer",
            "expires_in": 3600
        });
    }

    if (req.body.grant_type == "refresh_token") {
        if (req.body.refresh_token != refreshToken) {
            return res.status(400).json({ error: 'refresh_token invalido! (Utilize o refresh_token recebido ao buscar o access token original.)' });
        }

        return res.jsonp({
            "access_token": accessToken,
            "refresh_token": refreshToken,
            "scope": "openid",
            "id_token": JWT,
            "token_type": "Bearer",
            "expires_in": 3600
        });
    }

    return res.status(400).json({ error: 'Grant type invalido! (Utilize st ou refresh_token)' });
});

/*
 * Passo 3:
 *  Recupera recupera a foto do usuário
 */
server.get('/rhs/api/successfactors/v1/fotos/:cpf/:numeroCooperativa/perfil', (req, res) => {
    res.jsonp({
        "resultado": {
            "foto": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJycfLT0tMTU3Ojo6Iys/QEE/QCo/QT8BCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc1NTcyNzc3Nzc3Nzc3NzU1NzU3LS83KzU1LS01Nf/AABEIACgAKAMBIgACEQEDEQH/xAAbAAADAQADAQAAAAAAAAAAAAAABQYEAQMHAv/EAC8QAAIBAwMCBAUDBQAAAAAAAAECAwAEBRESMSFBBhNRYRQycYHBUpGhByIjJEL/xAAYAQADAQEAAAAAAAAAAAAAAAADBAUCBv/EACERAAICAQMFAQAAAAAAAAAAAAECABEhAxIxBBMiUbEF/9oADAMBAAIRAxEAPwBPZ+IJZLhmR9VLBSf069dBVPjMvJeyiADo52Ivr069akf6XYqK8lu5buIyw2oDFG4Lnj+OavbC+waXJs8XbW8rMwVpIJA5Rj2PcVLdc4ljSI22Z8z2VhIHTykOwEqw4JrDcXkUKgWsIQhux57VtyN5j8ZeNYvLKs8vUBoy5Y+utL7yyJinEL75GGqAjSsCxDEKRJbxVcxzyfFQptG0CRfzXNIsjfSQBzIAApI2sOx5FcU0qkiT3YAz2XFYm3xfiLJeWqJb3ao6x9uCG0+9MbaPEDJPDahGnTR2baAqHsNdOfasueubbz4LRpf9l1YhFOjBdNeex76e1K7fEPbYj4ZzFc28ztIHuGMco69CSP8Ar36VL/M1W1elRm5r5iNIAwwZsv7LGZLLSwZFIpHm3eSXXcCRyNfXTtWO5xVhgYX+C3lj101/tB9gSdKUHESwWk1pi40gckT/ABMl2ZXVxwSQPtp710tfvFjnvcpOHMUZaTaNFJA7d6db1CUAbk94rxAvLOO7LKs11c7vQLGo6lj9dKKXPlZMtFC+XmTyRF/hCJtXaT6Dkg8/SijqGqokX02Nyg8QPcXYe8SUreROt0kg53Kev201GlXaeI7fE2vk5aMONA8U23VXU8fQ0UUtp4wIr0DnY1xPk/GGPlhaPGwqJG+ZtNAo9SfxUheY+bxDjrweaYY/mRiOjbep/fiiiiHxyJRHng8TNZ2MTYiwjuV3JHHseMdOunzA8g0UUVnusODOe3sCaM//2Q=="
        }
    });

});

/*
 * Redireciona em caso de atualização
 */
server.get('/cas/login', (req, res) => {
    res.redirect('http://localhost:4200?ticket=ST1-EwTccaaq-localhost');
});

/**
 * Legado
 *  Recupera as informações do usuário logado.
 */
server.get('/permissao/1.0.0/autorizacao/usuarios', (req, res) => {

    res.jsonp({
        "resultado": {
            "login": "gearqc0300_00",
            "nome": "Tiago",
            "cpf": "62663522732",
            "email": "gearqc@sicoob.com.br",
            "numeroCooperativa": 300,
            "idInstituicaoOrigem": 2,
            "idUnidadeInstOrigem": 0,
            "dataHoraUltimoLogin": Date.now() - 1000
        }
    });

});

server.use(router);
server.listen(3000, () => {
    console.log('Json Server -> Sicoob Mock com está rodando na porta 3000!')
})
