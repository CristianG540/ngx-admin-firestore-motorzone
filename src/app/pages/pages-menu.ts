import { NbMenuItem } from '@nebular/theme'

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Inicio',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true
  },
  {
    title: 'Clientes',
    icon: 'ion-ios-people-outline',
    link: '/pages/clientes',
    children: [
      {
        title: 'Buscar cliente',
        link: '/pages/clientes/buscar-cliente'
      },
      {
        title: 'Consultar cartera',
        link: '/pages/clientes/consultar-cartera'
      },
      {
        title: 'Mapa clientes',
        link: '/pages/clientes/mapa-clientes'
      }
    ]
  },
  {
    title: 'Auth',
    icon: 'nb-locked',
    children: [
      {
        title: 'Login',
        link: '/auth/login'
      },
      {
        title: 'Register',
        link: '/auth/register'
      },
      {
        title: 'Request Password',
        link: '/auth/request-password'
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password'
      }
    ]
  }
]
