import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstatsStatsComponent } from './constats-stats.component';

@NgModule({
  declarations: [ConstatsStatsComponent],
  imports: [CommonModule],
  exports: [ConstatsStatsComponent] // Exporter le composant pour l'utiliser ailleurs
})
export class StatisticsModule {}
