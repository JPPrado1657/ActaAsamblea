import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { AssemblyComponent } from '../../assembly/assembly.component';
import { CompleteAssemblyComponent } from '../../complete-assembly/complete-assembly.component';
import { SignageComponent } from '../../signage/signage.component';

export const AdminLayoutRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'user-profile',
        component: UserProfileComponent
    },
    {
        path: 'table-list',
        component: TableListComponent
    },
    {
        path: 'assembly',
        component: NotificationsComponent
    },
    {
        path: 'create_assembly',
        component: AssemblyComponent
    },
    {
        path: 'complete_assembly',
        component: CompleteAssemblyComponent
    },
    {
        path: 'signage',
        component: SignageComponent
    }
];
