import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoComponent } from './demo/demo.component';
import { Demo2Component } from './demo2/demo2.component';


const appRoutes: Routes = [
  { path: 'DemoComponent', component: DemoComponent },
  { path: 'DemoComponent2', component: Demo2Component },
];



@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
