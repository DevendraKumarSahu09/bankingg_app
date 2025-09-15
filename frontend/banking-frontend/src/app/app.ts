import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // Make sure RouterOutlet is imported
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'banking-frontend';
}
