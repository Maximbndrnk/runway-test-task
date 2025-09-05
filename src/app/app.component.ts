import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  showBackButton = false;
  private sub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateBackButton(this.router.url);

    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.updateBackButton(e.urlAfterRedirects));
  }

  private updateBackButton(url: string) {
    this.showBackButton = !(url === '/users' || url === '/' || url === '');
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
