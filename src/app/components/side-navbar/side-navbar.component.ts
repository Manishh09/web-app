import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent implements OnInit, AfterViewInit {
  menuList: any[] = [];
  @ViewChildren(MatExpansionPanel)
  childMenus!: QueryList<MatExpansionPanel>;
  private apiServ = inject(ApiService);


  ngOnInit(): void {
    this.getSideNavData()
  }

  private getSideNavData() {
    this.apiServ.getJson('assets/side-navbar-items.json').subscribe({
      next: (data) => {
        this.menuList = data;
      },
    });
  }

  ngAfterViewInit(): void {
    this.childMenus.changes.subscribe(() => {
      this.childMenus.toArray().forEach((panel) => {
        panel.expandedChange.subscribe((expanded) => {
          if (expanded) {
            this.closeOtherChildMenus(panel);
          }
        });
      });
    });
  }

  closeOtherChildMenus(expandedPanel: MatExpansionPanel): void {
    this.childMenus.toArray().forEach((panel) => {
      if (panel !== expandedPanel && panel.expanded) {
        panel.close();
      }
    });
  }
}
