import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    ProgressSpinnerModule,
    DropdownModule,
    ButtonModule
  ],
  exports: [
    InputTextModule,
    ProgressSpinnerModule,
    DropdownModule,
    ButtonModule
  ]
})
export class SharedModule {}
