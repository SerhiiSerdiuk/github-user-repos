import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    ProgressSpinnerModule,
    DropdownModule
  ],
  exports: [InputTextModule, ProgressSpinnerModule, DropdownModule]
})
export class SharedModule {}
