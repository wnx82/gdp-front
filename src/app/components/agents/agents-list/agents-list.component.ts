import { Component, OnInit } from '@angular/core';
import { Agent } from '../agent';
import { AgentService } from '../agent.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents-list.component.html',
  styleUrls: ['./agents-list.component.css'],
})
export class AgentsListComponent {
  agents: Agent[] = [];
  showMe: boolean = false;
  constructor(private agentService: AgentService) {}
  ngOnInit(): void {
    this.getAgents();
  }

  getAgents(): void {
    this.agentService.getAgents().subscribe((agents) => {
      this.agents = agents.filter((agent) => !agent.deletedAt);
      console.log('Agents filtrés :', this.agents);
    });
  }

  goToAgent(agent: Agent) {
    // this.router.navigate(['/agents', agent._id]);
  }
  add(firstname: string): void {
    firstname = firstname.trim();
    if (!firstname) {
      return;
    }
    this.agentService.addAgent({ firstname } as Agent).subscribe((agent) => {
      this.agents.push(agent);
    });
  }

  delete(agent: Agent): void {
    this.agents = this.agents.filter((h) => h !== agent);
    this.agentService.deleteAgent(agent).subscribe();
  }
  toogleTag() {
    this.showMe = !this.showMe;
  }
}
