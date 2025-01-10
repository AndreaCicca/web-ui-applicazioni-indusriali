import { Component, OnInit } from '@angular/core';
import { marked } from 'marked';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

  constructor() {

  }
  ngOnInit(): void {
    this.renderMarkdown(`# Informazioni a proposito del progetto.

Il progetto affronta il problema di semplificare e ottimizzare l’accesso a un ampio archivio di documenti, spesso caratterizzati da una struttura non intuitiva e difficili da consultare in modo efficace. L’obiettivo è sviluppare un sistema intelligente che consenta agli utenti di interagire con il contenuto di questi documenti in maniera fluida, utilizzando il linguaggio naturale per porre domande e ricevere come risposta l'elenco dei documenti maggiormente attinenti all'argomento ricercato.

Questo sistema dovrà organizzare, processare e indicizzare i documenti, sfruttando tecnologie avanzate di intelligenza artificiale, come modelli di linguaggio e database vettoriali, per comprendere e restituire le informazioni più rilevanti. In tal modo, si mira a risolvere le difficoltà legate alla ricerca manuale e al recupero di informazioni, rendendo l’intero processo più efficiente e accessibile.

## Progettazione dell'architettura

L'architettura del progetto prevede i seguenti elementi infrastrutturali e le loro relazioni:
- Un Database vettoriale per memorizzare gli embeddings dei documenti e i relativi metadati: in questo caso si è scelto di utilizzare il database Qdrant. Il vector DB ha il compito di facilitare la ricerca e recupero dei contenuti rilevanti in base alla vicinanza semantica con la query dell'utente.
- Uno o più Modelli di linguaggio LLM per interpretare le domande degli utenti, generare embeddings per le query e costruire risposte basate sui documenti recuperati.
- Un sistema ad agenti che possa gestire l’invocazione dei diversi strumenti utilizzati per effettuare le query e formattare l’output.
- Una API REST per servire il sistema verso l’esterno.
- Una interfaccia web che permetta all’utente di interagire con il sistema.

Il vector DB Qdrant, il sistema ad agenti, l’API e pagina web sono istanziate sulla stessa macchina, mentre i modelli LLM sono serviti in cloud (DeepSeek) o da una macchina esterna (Llama 3.2, qwq).


## Crediti
Il progetto è stato sviluppato per il corso di Applicazioni industriali dell'intelligenza artificiale dal seguente gruppo:
- Andrea Ciccarello
- Gian Marco Simonazzi
- Jacopo Arcari

## Link ai repository github

- [Frontend in Angular](https://github.com/AndreaCicca/web-ui-applicazioni-indusriali/tree/main).
- [Backend per vettorizzazione, agente e query](https://github.com/AndreaCicca/arXiv-vettorizzazione).
`);
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
