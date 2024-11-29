import {NgModule} from '@angular/core';
import {KeeniconComponent} from './keenicon/keenicon.component';
import {CommonModule} from "@angular/common";
import { NumericInputDirective } from './directives/numeric-input.directive';

@NgModule({
  declarations: [
    KeeniconComponent,
    NumericInputDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    KeeniconComponent,
    NumericInputDirective
  ]
})
export class SharedModule {
}
