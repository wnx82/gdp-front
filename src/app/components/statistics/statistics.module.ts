import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';

@NgModule({
  declarations: [StatisticsComponent],
  imports: [CommonModule],
  exports: [StatisticsComponent] // Exporter le composant pour l'utiliser ailleurs
})
export class StatisticsModule {}
