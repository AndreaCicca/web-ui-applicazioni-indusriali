import { Component } from '@angular/core';
import { marked } from 'marked';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

  constructor() {
    this.renderMarkdown('# About\n\n');
  }

  public renderMarkdown(markdown: string): void {
    const htmlContent = marked.parse(markdown);
    if (htmlContent instanceof Promise) {
      htmlContent.then((content) => {
        const agentResponseElement = document.getElementById('markdownAbout');
        if (agentResponseElement) {
          agentResponseElement.innerHTML = content;
        }
      });
    } else {
      const agentResponseElement = document.getElementById('markdownAbout');
      if (agentResponseElement) {
        agentResponseElement.innerHTML = htmlContent;
      }
    }
  }

}
