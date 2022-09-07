import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuncionarioRoutingModule } from './funcionario-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FuncionarioComponent } from './funcionario.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    FuncionarioComponent
  ],
  imports: [
    CommonModule,
    FuncionarioRoutingModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class FuncionarioModule { }
