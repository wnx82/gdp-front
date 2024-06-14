import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstatsStatsComponent } from './constats-stats.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 


@NgModule({
  declarations: [ConstatsStatsComponent],
  imports: [CommonModule,  BrowserModule, FormsModule],
  exports: [ConstatsStatsComponent],
  providers: [],
  bootstrap: [ConstatsStatsComponent]
})
export class ConstatsStatsModule {}
