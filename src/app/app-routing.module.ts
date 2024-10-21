import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/ui-component/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/ui-component/ui-color/ui-color.component')
      },
      {
        path: 'customers',
        loadComponent: () => import('./customers/customers.component').then(m => m.CustomersComponent),
      },
      {
        path: 'create-customer',
        loadComponent: () => import('./demo/other/sample-page/create-customer/create-customer.component').then(m => m.CreateCustomerComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./demo/other/sample-page/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./transactions/transactions.component').then(m => m.TransactionsComponent)
      },
      {
        path: 'merchant',
        loadComponent: () => import('./merchant/merchant.component').then(m => m.MerchantComponent)
      },
      {
        path: 'agent',
        loadComponent: () => import('./agent/agent.component').then(m => m.AgentComponent)
      },
      {
        path: 'partner',
        loadComponent: () => import('./partner/partner.component').then(m => m.PartnerComponent)
      },
      {
        path: 'create-merchant',
        loadComponent: () => import('./create-merchant/create-merchant.component').then(m => m.CreateMerchantComponent)
      },
      {
        path: 'create-agent',
        loadComponent: () => import('./create-agent/create-agent.component').then(m => m.CreateAgentComponent)
      },
      {
        path: 'create-partner',
        loadComponent: () => import('./create-partner/create-partner.component').then(m => m.CreatePartnerComponent)
      },
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/authentication/login/login.component')
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component')
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
