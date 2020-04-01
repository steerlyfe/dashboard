import {NgModule} from'@angular/core'
import { CommonModule } from '@angular/common';
import * as Material from "@angular/material";

@NgModule({
    imports: [
      CommonModule,
      Material.MatToolbarModule,
      Material.MatGridListModule,
      Material.MatFormFieldModule,
      Material.MatInputModule,
      Material.MatRadioModule,
      Material.MatSelectModule,
      Material.MatCheckboxModule,
      Material.MatDatepickerModule,
      Material.MatNativeDateModule,
      Material.MatButtonModule,
      Material.MatSnackBarModule,
      Material.MatTableModule,
      Material.MatIconModule,
      Material.MatPaginatorModule,
      Material.MatSortModule,
      Material.MatStepperModule,
    //  Material.MatSidenav
    Material.MatSidenavModule,
    Material.MatListModule,
    Material.MatDialogModule,
    Material.MatCardModule,
    Material.MatGridListModule,
   Material.MatTooltipModule, 
   Material.MatChipsModule, 
  
    
    ],
    exports: [
      Material.MatToolbarModule,
      Material.MatGridListModule,
      Material.MatFormFieldModule,
      Material.MatInputModule,
      Material.MatRadioModule,
      Material.MatSelectModule,
      Material.MatCheckboxModule,
      Material.MatDatepickerModule,
      Material.MatNativeDateModule,
      Material.MatButtonModule,
      Material.MatSnackBarModule,
      Material.MatTableModule,
      Material.MatIconModule,
      Material.MatPaginatorModule,
      Material.MatSortModule,
      Material.MatSidenavModule,
      Material.MatListModule,
      Material.MatDialogModule,
      Material.MatCardModule,
      Material.MatGridListModule,
      Material.MatTooltipModule,
      Material.MatStepperModule,
      Material.MatChipsModule, 
    ],
    declarations: []
  })
  export class MaterialModule { }