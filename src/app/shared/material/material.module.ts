import { NgModule } from "@angular/core";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';


import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatSelectModule } from '@angular/material/select';

import { MatDialogModule } from '@angular/material/dialog';

import { MatDividerModule } from '@angular/material/divider';

import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';

import {MatRadioModule} from '@angular/material/radio';

import {MatTabsModule} from '@angular/material/tabs';

import { CommonModule } from '@angular/common';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
    imports:[   
        MatPaginatorModule,
        MatSortModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatSelectModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        MatButtonToggleModule,
        MatSnackBarModule,
        MatTooltipModule,
        DragDropModule,
        CommonModule,
        MatToolbarModule,
        MatTabsModule,
        MatRadioModule,
        MatSidenavModule,
        MatMenuModule,
        MatSnackBarModule
    ],
    exports:[    
        MatPaginatorModule,
        MatSortModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatSelectModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        MatButtonToggleModule,
        MatSnackBarModule,
        MatTooltipModule,
        DragDropModule,
        CommonModule,
        MatCardModule,
        MatToolbarModule,
        MatTabsModule,
        MatRadioModule,
        MatSidenavModule,
        MatMenuModule,
        MatSnackBarModule
    ]

})
export class MaterialModule {}